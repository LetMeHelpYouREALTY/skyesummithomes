/* Hyperlocal amenity map — lazy-loaded Google Maps + Places (New) searchNearby */
(function () {
  'use strict';

  function readConfig(root) {
    var el = root.querySelector('.amenity-map-config');
    if (!el) return null;
    try {
      return JSON.parse(el.textContent);
    } catch (e) {
      return null;
    }
  }

  function mapsKey() {
    var meta = document.querySelector('meta[name="google-maps-api-key"]');
    var key = meta && meta.getAttribute('content');
    if (!key || !String(key).trim() || key === 'YOUR_API_KEY') return '';
    return String(key).trim();
  }

  function showFallback(wrap) {
    var mapEl = wrap.querySelector('.amenity-map-widget__map');
    var fb = wrap.querySelector('.amenity-map-fallback');
    if (mapEl) mapEl.setAttribute('hidden', 'hidden');
    if (fb) {
      fb.removeAttribute('hidden');
    }
    var status = wrap.querySelector('.amenity-map-widget__status');
    if (status) {
      status.textContent =
        'Showing map preview and featured places. Add GOOGLE_MAPS_API_KEY in Vercel for the interactive map.';
    }
  }

  function buildFilters(wrap, cfg, onSelect) {
    var host = wrap.querySelector('.amenity-map-widget__filters');
    if (!host) return;
    host.innerHTML = '';
    cfg.categories.forEach(function (cat, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'amenity-map-chip' + (idx === 0 ? ' is-active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
      btn.setAttribute('aria-label', cat.ariaLabel || cat.label);
      btn.textContent = cat.label;
      btn.dataset.categoryId = cat.id;
      btn.addEventListener('click', function () {
        host.querySelectorAll('.amenity-map-chip').forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        onSelect(cat);
      });
      host.appendChild(btn);
    });
  }

  function infoContent(place, cfg) {
    var name = place.displayName || place.name || 'Place';
    var address = place.formattedAddress || place.vicinity || '';
    var rating = place.rating != null ? '<p style="margin:4px 0;">Rating: ' + place.rating + '</p>' : '';
    var dir =
      place.googleMapsURI ||
      'https://www.google.com/maps/dir/?api=1&destination=' +
        encodeURIComponent(name + ' ' + address);
    return (
      '<div style="padding:8px;max-width:260px;font-family:system-ui,sans-serif;">' +
      '<div style="font-weight:700;margin-bottom:4px;">' +
      name +
      '</div>' +
      (address ? '<div style="font-size:13px;margin-bottom:6px;">' + address + '</div>' : '') +
      rating +
      '<a href="' +
      dir +
      '" target="_blank" rel="noopener noreferrer" style="font-size:13px;font-weight:600;">Directions</a>' +
      '</div>'
    );
  }

  function legacyNearby(map, center, types, radius, max, infoWindow) {
    return new Promise(function (resolve) {
      if (!google.maps.places || !google.maps.places.PlacesService) {
        resolve([]);
        return;
      }
      var service = new google.maps.places.PlacesService(map);
      var type = types[0] || 'point_of_interest';
      service.nearbySearch(
        {
          location: center,
          radius: radius,
          type: type,
        },
        function (results, status) {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
            resolve([]);
            return;
          }
          resolve(results.slice(0, max));
        }
      );
    });
  }

  async function searchCategory(map, cfg, category, markers, infoWindow) {
    var center = { lat: cfg.community.lat, lng: cfg.community.lng };
    markers.forEach(function (m) {
      m.setMap(null);
    });
    markers.length = 0;

    var statusEl = map.getDiv().closest('.amenity-map-widget');
    var status = statusEl && statusEl.querySelector('.amenity-map-widget__status');
    if (status) status.textContent = 'Loading ' + category.label + '…';

    var results = [];
    try {
      if (google.maps.importLibrary) {
        var placesLib = await google.maps.importLibrary('places');
        var Place = placesLib.Place;
        if (Place && Place.searchNearby) {
          var response = await Place.searchNearby({
            fields: [
              'displayName',
              'location',
              'rating',
              'formattedAddress',
              'googleMapsURI',
            ],
            locationRestriction: {
              circle: {
                center: center,
                radius: cfg.searchRadiusMeters || 12000,
              },
            },
            includedPrimaryTypes: category.primaryTypes,
            maxResultCount: cfg.maxResults || 12,
          });
          results = response.places || [];
        }
      }
    } catch (e) {
      results = [];
    }

    if (!results.length) {
      var legacy = await legacyNearby(
        map,
        center,
        category.primaryTypes,
        cfg.searchRadiusMeters || 12000,
        cfg.maxResults || 12,
        infoWindow
      );
      results = legacy;
    }

    results.forEach(function (place) {
      var pos;
      if (place.location && place.location.lat) {
        pos = { lat: place.location.lat(), lng: place.location.lng() };
      } else if (place.geometry && place.geometry.location) {
        pos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
      } else {
        return;
      }
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: (place.displayName && place.displayName.text) || place.name || '',
      });
      marker.addListener('click', function () {
        var payload = {
          displayName:
            (place.displayName && place.displayName.text) || place.name || 'Place',
          formattedAddress: place.formattedAddress || place.vicinity,
          rating: place.rating,
          googleMapsURI: place.googleMapsURI,
        };
        infoWindow.setContent(infoContent(payload, cfg));
        infoWindow.open(map, marker);
      });
      markers.push(marker);
    });

    if (status) {
      status.textContent =
        results.length +
        ' ' +
        category.label.toLowerCase() +
        ' places shown (Google Places). Verify hours before you visit.';
    }
  }

  function initWidget(wrap) {
    var cfg = readConfig(wrap);
    if (!cfg) {
      showFallback(wrap);
      return;
    }
    var key = mapsKey();
    if (!key) {
      showFallback(wrap);
      return;
    }

    var mapDiv = wrap.querySelector('.amenity-map-widget__map');
    if (!mapDiv) {
      showFallback(wrap);
      return;
    }

    var markers = [];
    var infoWindow = new google.maps.InfoWindow();

    var map = new google.maps.Map(mapDiv, {
      center: { lat: cfg.community.lat, lng: cfg.community.lng },
      zoom: cfg.community.zoom || 13,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    var communityMarker = new google.maps.Marker({
      position: { lat: cfg.community.lat, lng: cfg.community.lng },
      map: map,
      title: cfg.community.name,
      zIndex: 999,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#0A2540',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
    });
    communityMarker.addListener('click', function () {
      infoWindow.setContent(
        infoContent(
          {
            displayName: cfg.community.name,
            formattedAddress: cfg.community.city + ', NV (master plan center)',
          },
          cfg
        )
      );
      infoWindow.open(map, communityMarker);
    });

    buildFilters(wrap, cfg, function (cat) {
      searchCategory(map, cfg, cat, markers, infoWindow);
    });

    if (cfg.categories[0]) {
      searchCategory(map, cfg, cfg.categories[0], markers, infoWindow);
    }

    var fb = wrap.querySelector('.amenity-map-fallback');
    if (fb) fb.setAttribute('hidden', 'hidden');
    mapDiv.removeAttribute('hidden');
  }

  function loadMapsAndInit(wrap) {
    var key = mapsKey();
    if (!key) {
      showFallback(wrap);
      return;
    }
    if (window.google && window.google.maps) {
      initWidget(wrap);
      return;
    }
    window.__amenityMapQueue = window.__amenityMapQueue || [];
    window.__amenityMapQueue.push(wrap);
    if (window.__amenityMapLoading) return;
    window.__amenityMapLoading = true;
    window.initAmenityMaps = function () {
      var queue = window.__amenityMapQueue || [];
      queue.forEach(initWidget);
      window.__amenityMapQueue = [];
    };
    var script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=' +
      encodeURIComponent(key) +
      '&libraries=places&loading=async&callback=initAmenityMaps';
    script.async = true;
    script.defer = true;
    script.onerror = function () {
      (window.__amenityMapQueue || []).forEach(showFallback);
      window.__amenityMapQueue = [];
    };
    document.head.appendChild(script);
  }

  function observeWidget(wrap) {
    if (!('IntersectionObserver' in window)) {
      loadMapsAndInit(wrap);
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            observer.disconnect();
            loadMapsAndInit(wrap);
          }
        });
      },
      { rootMargin: '120px', threshold: 0.05 }
    );
    observer.observe(wrap);
  }

  document.querySelectorAll('[data-amenity-map]').forEach(function (wrap) {
    var fb = wrap.querySelector('.amenity-map-fallback');
    if (fb) fb.removeAttribute('hidden');
    observeWidget(wrap);
  });
})();
