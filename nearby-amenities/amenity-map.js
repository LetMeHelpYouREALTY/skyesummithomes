/* Hyperlocal amenity map — lazy-loaded Google Maps + Places (New) searchNearby */
(function () {
  'use strict';

  var mapsReady = null;
  var searchCache = new Map();
  var mapsAuthFailed = false;

  if (typeof window !== 'undefined') {
    window.addEventListener('gmaps:auth-failure', function () {
      mapsAuthFailed = true;
    });
  }

  function loadGoogleMaps(apiKey) {
    if (typeof window === 'undefined') return Promise.reject(new Error('ssr'));
    if (typeof window.google !== 'undefined' && window.google.maps && typeof window.google.maps.importLibrary === 'function') {
      return Promise.resolve();
    }
    if (mapsReady) return mapsReady;
    mapsReady = new Promise(function (resolve, reject) {
      var cb = '__gmapsReady';
      window[cb] = function () {
        resolve();
      };
      window.gm_authFailure = function () {
        window.dispatchEvent(new Event('gmaps:auth-failure'));
        mapsReady = null;
        reject(new Error('gm_authFailure'));
      };
      var s = document.createElement('script');
      s.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        encodeURIComponent(apiKey) +
        '&v=weekly&loading=async&callback=' +
        cb;
      s.async = true;
      s.onerror = function () {
        mapsReady = null;
        reject(new Error('maps script failed'));
      };
      document.head.appendChild(s);
    });
    return mapsReady;
  }

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

  function showFallback(wrap, statusMessage) {
    var mapEl = wrap.querySelector('.amenity-map-widget__map');
    var fb = wrap.querySelector('.amenity-map-fallback');
    if (mapEl) mapEl.setAttribute('hidden', 'hidden');
    if (fb) fb.removeAttribute('hidden');
    var status = wrap.querySelector('.amenity-map-widget__status');
    if (status) {
      status.textContent =
        statusMessage ||
        'Showing map preview and featured places. Interactive map is unavailable right now.';
    }
  }

  function curatedForCategory(cfg, categoryId) {
    var all = cfg.featuredPlaces || [];
    return all.filter(function (p) {
      return p.category === categoryId;
    });
  }

  function renderCuratedList(wrap, cfg, categoryId, prefix) {
    var host = wrap.querySelector('.amenity-map-widget__sidebar');
    if (!host) return;
    var listEl = host.querySelector('.amenity-map-dynamic-list');
    if (!listEl) {
      listEl = document.createElement('ul');
      listEl.className = 'amenity-map-static__list amenity-map-dynamic-list';
      var title = host.querySelector('.amenity-map-widget__sidebar-title');
      if (title && title.nextSibling) {
        host.insertBefore(listEl, title.nextSibling);
      } else {
        host.appendChild(listEl);
      }
    }
    var places = categoryId ? curatedForCategory(cfg, categoryId) : cfg.featuredPlaces || [];
    listEl.innerHTML = '';
    places.forEach(function (p) {
      var li = document.createElement('li');
      var strong = document.createElement('strong');
      strong.textContent = p.name;
      li.appendChild(strong);
      li.appendChild(document.createTextNode(' — ' + (p.address || '')));
      if (p.note) {
        var note = document.createElement('span');
        note.className = 'amenity-map-static__note';
        note.textContent = ' (' + p.note + ')';
        li.appendChild(note);
      }
      var dir = document.createElement('a');
      dir.href =
        'https://www.google.com/maps/dir/?api=1&destination=' +
        encodeURIComponent(p.name + ' ' + (p.address || ''));
      dir.target = '_blank';
      dir.rel = 'noopener noreferrer';
      dir.textContent = 'Directions';
      li.appendChild(document.createTextNode(' · '));
      li.appendChild(dir);
      listEl.appendChild(li);
    });
    var status = wrap.querySelector('.amenity-map-widget__status');
    if (status && prefix) {
      status.textContent = prefix + (places.length ? places.length + ' featured places listed.' : 'No featured places for this category.');
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

  function placeDisplayName(place) {
    if (!place) return 'Place';
    if (place.displayName && typeof place.displayName === 'string') return place.displayName;
    if (place.displayName && place.displayName.text) return place.displayName.text;
    if (place.name) return place.name;
    return 'Place';
  }

  function openInfoWindow(infoWindow, map, marker, place) {
    var name = placeDisplayName(place);
    var address = place.formattedAddress || place.vicinity || '';
    var dir =
      place.googleMapsURI ||
      'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(name + ' ' + address);
    var wrap = document.createElement('div');
    wrap.style.cssText = 'padding:8px;max-width:260px;font-family:system-ui,sans-serif;';
    var title = document.createElement('div');
    title.style.cssText = 'font-weight:700;margin-bottom:4px;';
    title.textContent = name;
    wrap.appendChild(title);
    if (address) {
      var addr = document.createElement('div');
      addr.style.cssText = 'font-size:13px;margin-bottom:6px;';
      addr.textContent = address;
      wrap.appendChild(addr);
    }
    var link = document.createElement('a');
    link.href = dir;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.cssText = 'font-size:13px;font-weight:600;';
    link.textContent = 'Directions';
    wrap.appendChild(link);
    infoWindow.setContent(wrap);
    infoWindow.open(map, marker);
  }

  function searchCategoryPlaces(center, category, radius, maxResults) {
    var categoryId = category.id;
    var cached = searchCache.get(categoryId);
    if (cached) return cached;

    var promise = (async function () {
      var placesLib = await google.maps.importLibrary('places');
      var Place = placesLib.Place;
      var response = await Place.searchNearby({
        fields: ['displayName', 'location', 'formattedAddress', 'googleMapsURI'],
        locationRestriction: {
          circle: {
            center: center,
            radius: radius,
          },
        },
        includedPrimaryTypes: category.primaryTypes,
        maxResultCount: maxResults,
        rankPreference: 'POPULARITY',
      });
      return response.places || [];
    })();

    promise.catch(function () {
      searchCache.delete(categoryId);
    });
    searchCache.set(categoryId, promise);
    return promise;
  }

  function placePosition(place) {
    if (place.location) {
      if (typeof place.location.lat === 'function') {
        return { lat: place.location.lat(), lng: place.location.lng() };
      }
      if (typeof place.location.lat === 'number') {
        return { lat: place.location.lat, lng: place.location.lng };
      }
      if (typeof place.location.toJSON === 'function') {
        return place.location.toJSON();
      }
    }
    if (place.geometry && place.geometry.location) {
      return {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
    }
    return null;
  }

  async function searchCategory(map, wrap, cfg, category, markers, infoWindow) {
    var center = { lat: cfg.community.lat, lng: cfg.community.lng };
    markers.forEach(function (m) {
      m.setMap(null);
    });
    markers.length = 0;

    var status = wrap.querySelector('.amenity-map-widget__status');
    if (status) status.textContent = 'Loading ' + category.label + '…';

    var results = [];
    try {
      results = await searchCategoryPlaces(
        center,
        category,
        cfg.searchRadiusMeters || 5000,
        cfg.maxResults || 10
      );
    } catch (e) {
      results = [];
    }

    if (!results.length) {
      renderCuratedList(wrap, cfg, category.id, 'Map results unavailable — ');
      if (status) {
        status.textContent =
          'Showing featured ' + category.label.toLowerCase() + ' places from our guide.';
      }
      return;
    }

    results.forEach(function (place) {
      var pos = placePosition(place);
      if (!pos) return;
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: placeDisplayName(place),
      });
      marker.addListener('click', function () {
        openInfoWindow(infoWindow, map, marker, place);
      });
      markers.push(marker);
    });

    renderCuratedList(wrap, cfg, category.id, '');
    if (status) {
      status.textContent =
        results.length +
        ' ' +
        category.label.toLowerCase() +
        ' places shown. Verify hours before you visit.';
    }
  }

  function initWidget(wrap) {
    if (mapsAuthFailed) {
      showFallback(wrap);
      return;
    }

    var cfg = readConfig(wrap);
    if (!cfg) {
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
    var map = null;
    var authDuringUse = function () {
      mapDiv.setAttribute('hidden', 'hidden');
      if (map && google.maps.event) {
        google.maps.event.clearInstanceListeners(map);
      }
      markers.forEach(function (m) {
        m.setMap(null);
      });
      markers.length = 0;
      onAuthFailure(wrap);
    };
    window.addEventListener('gmaps:auth-failure', authDuringUse);
    wrap.__amenityAuthListener = authDuringUse;

    map = new google.maps.Map(mapDiv, {
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
      openInfoWindow(infoWindow, map, communityMarker, {
        displayName: cfg.community.name,
        formattedAddress: cfg.community.city + ', NV (master plan center)',
      });
    });

    buildFilters(wrap, cfg, function (cat) {
      searchCategory(map, wrap, cfg, cat, markers, infoWindow);
    });

    if (cfg.categories[0]) {
      searchCategory(map, wrap, cfg, cfg.categories[0], markers, infoWindow);
    }

    var fb = wrap.querySelector('.amenity-map-fallback');
    if (fb) fb.setAttribute('hidden', 'hidden');
    mapDiv.removeAttribute('hidden');
  }

  function onAuthFailure(wrap) {
    showFallback(wrap);
    var cfg = readConfig(wrap);
    if (cfg && cfg.categories && cfg.categories[0]) {
      renderCuratedList(wrap, cfg, cfg.categories[0].id, '');
    }
  }

  function loadMapsAndInit(wrap) {
    if (mapsAuthFailed) {
      onAuthFailure(wrap);
      return;
    }

    var key = mapsKey();
    if (!key) {
      showFallback(wrap);
      return;
    }

    var authListener = function () {
      onAuthFailure(wrap);
    };
    window.addEventListener('gmaps:auth-failure', authListener);

    var cleanup = function () {
      window.removeEventListener('gmaps:auth-failure', authListener);
    };

    if (wrap.__amenityMapCleanup) wrap.__amenityMapCleanup();
    wrap.__amenityMapCleanup = cleanup;

    loadGoogleMaps(key)
      .then(function () {
        if (mapsAuthFailed) {
          onAuthFailure(wrap);
          return;
        }
        initWidget(wrap);
      })
      .catch(function () {
        onAuthFailure(wrap);
      });
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
