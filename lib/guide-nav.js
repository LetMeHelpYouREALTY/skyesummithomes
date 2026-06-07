'use strict';

/** Shared guide slugs for nav, footers, sitemap, and clean URLs */
const GUIDE_NAV = [
  { slug: 'skye-summit-master-plan', label: 'Master plan hub' },
  { slug: 'skye-summit-interest-list', label: 'Interest list' },
  { slug: 'kb-home-vertice-skye-summit', label: 'KB Home Vertice' },
  { slug: 'olympia-companies-skye-summit', label: 'Olympia Companies' },
  { slug: 'skye-summit-timeline', label: 'Fall 2027 timeline' },
  { slug: 'woodside-homes-skye-summit', label: 'Woodside Homes' },
  { slug: 'skye-summit-realtor', label: 'Skye Summit REALTOR®' },
  { slug: 'skye-summit-faq', label: 'Skye Summit FAQ' },
  { slug: 'skye-summit-home-prices', label: 'Home prices & market' },
  { slug: 'skye-summit-first-time-buyer', label: 'First-time buyers' },
  { slug: 'new-construction-skye-summit', label: 'New construction' },
  { slug: 'living-in-skye-summit', label: 'Living here' },
  { slug: 'skye-summit-hoa', label: 'HOA guide' },
  { slug: 'skye-summit-schools', label: 'Schools' },
  { slug: 'skye-summit-vs-summerlin', label: 'Skye Summit vs Summerlin' },
  { slug: 'northwest-las-vegas-real-estate', label: 'Northwest Las Vegas' },
  { slug: 'centennial-hills-real-estate', label: 'Centennial Hills' },
];

const GUIDE_SLUGS = GUIDE_NAV.map((g) => g.slug);

function guideFooterListHtml() {
  return GUIDE_NAV.map(
    (g) => `                        <li><a href="/${g.slug}">${g.label}</a></li>`
  ).join('\n');
}

function guideCtaLinksHtml() {
  return GUIDE_NAV.map((g) => `<a href="/${g.slug}">${g.label}</a>`).join(' · ');
}

module.exports = {
  GUIDE_NAV,
  GUIDE_SLUGS,
  guideFooterListHtml,
  guideCtaLinksHtml,
};
