#!/usr/bin/env node
/**
 * Adds AEO quick-answer blocks and page-specific FAQs to core marketing pages.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');

const root = path.join(__dirname, '..');
const MARKER = 'AEO_CORE_BEGIN';
const enrichmentPath = path.join(root, 'lib/parallel-seo-enrichment.json');

function mergeParallelEnrichment(pages) {
  if (!fs.existsSync(enrichmentPath)) return pages;
  try {
    const data = JSON.parse(fs.readFileSync(enrichmentPath, 'utf8'));
    const merged = { ...pages };
    for (const [fileName, overlay] of Object.entries(data.corePages || {})) {
      if (!merged[fileName]) continue;
      merged[fileName] = {
        ...merged[fileName],
        quickAnswer: overlay.quickAnswer || merged[fileName].quickAnswer,
        faqs: overlay.faqs?.length ? overlay.faqs : merged[fileName].faqs,
      };
    }
    for (const [fileName, overlay] of Object.entries(data.utilityPages || {})) {
      if (!merged[fileName]) {
        merged[fileName] = overlay;
      }
    }
    return merged;
  } catch (e) {
    console.warn('enhance-core-pages-aeo: parallel enrichment load failed', e.message);
    return pages;
  }
}

const CORE_PAGES = mergeParallelEnrichment({
  'about.html': {
    quickAnswer:
      'Dr. Jan Duffy is a Las Vegas REALTOR® (license S.0197614.LLC) with Berkshire Hathaway HomeServices Nevada Properties, specializing in Skye Summit and northwest Las Vegas since 2009. Call (702) 930-8222 or visit the office at 11411 Southern Highlands Pkwy #300, Las Vegas.',
    faqs: [
      {
        q: 'Who is Dr. Jan Duffy?',
        a: 'Dr. Jan Duffy is a Nevada REALTOR® focused on Skye Summit, Centennial Hills, and northwest Las Vegas buyer and seller representation.',
      },
      {
        q: 'What brokerage is Dr. Jan Duffy with?',
        a: 'Berkshire Hathaway HomeServices Nevada Properties. License S.0197614.LLC.',
      },
      {
        q: 'How do I verify the office address?',
        a: `Office: ${C.STREET}, ${C.CITY}, ${C.REGION} ${C.POSTAL} (${C.LABEL_OFFICE_SAME_AS_GOOGLE}). See <a href="${C.MAP_PAGE_PATH}">office map &amp; directions</a>.`,
      },
    ],
  },
  'buy.html': {
    quickAnswer:
      'To buy in Skye Summit: get mortgage pre-approval from your lender, decide what you need (neighborhood phase, view, new vs resale), tour homes, then make an offer with help on inspections and HOA paperwork. Dr. Jan Duffy serves Skye Summit and northwest Las Vegas—(702) 930-8222.',
    faqs: [
      {
        q: 'How do I start buying a home in Skye Summit?',
        a: 'Start with mortgage pre-approval, then a buyer consult to set your search. Browse <a href="/homes-for-sale-skye-summit">homes for sale</a> or call for a custom search.',
      },
      {
        q: 'Do I need my own agent for new construction?',
        a: 'Yes—the builder’s sales team represents the builder. See <a href="/new-construction-skye-summit">new construction guide</a>.',
      },
      {
        q: 'What should I budget beyond the purchase price?',
        a: 'Plan for closing costs, prepaid items, moving, and reserves. Your lender provides a Loan Estimate; your agent helps negotiate seller credits when available.',
      },
    ],
  },
  'sell.html': {
    quickAnswer:
      'To sell in Skye Summit: price using phase, view, and similar recent sales—not generic online estimates—then market to qualified northwest buyers. Dr. Jan Duffy provides valuation, staging guidance, and negotiation through closing. Call (702) 930-8222.',
    faqs: [
      {
        q: 'How is my Skye Summit home priced?',
        a: 'Pricing uses recent closed sales in your phase, lot premiums, and condition. Request a <a href="/valuation">free valuation</a>.',
      },
      {
        q: 'How long does it take to sell in Skye Summit?',
        a: 'Days on market depend on price, condition, and season. A targeted marketing plan and correct list price are the main levers.',
      },
      {
        q: 'What documents do sellers need in Nevada?',
        a: 'Seller disclosures, HOA documents, and title items are coordinated through escrow; your listing agent outlines the timeline at listing.',
      },
    ],
  },
  'valuation.html': {
    quickAnswer:
      'A Skye Summit home valuation from Dr. Jan Duffy uses local closed sales, phase and view adjustments, and upgrade value—not automated portals alone. Request a no-obligation pricing review at (702) 930-8222.',
    faqs: [
      {
        q: 'Is an online home value estimate accurate for Skye Summit?',
        a: 'Automated values often miss elevation, phase, and view premiums. Use them as a starting point only.',
      },
      {
        q: 'What is included in a seller valuation consult?',
        a: 'Comparable sales, suggested list range, prep recommendations, and marketing overview for your submarket.',
      },
      {
        q: 'How fast can I get a valuation?',
        a: 'Schedule via <a href="/contact">contact</a> or call <a href="tel:+17029308222">(702) 930-8222</a>.',
      },
    ],
  },
  'invest.html': {
    quickAnswer:
      'Skye Summit and northwest Las Vegas attract investors for newer housing stock, rental demand, and long-term appreciation potential. Dr. Jan Duffy helps analyze rents, HOA rules, and acquisition metrics—(702) 930-8222.',
    faqs: [
      {
        q: 'Can I rent out a Skye Summit property?',
        a: 'Rental rules depend on HOA and phase governing documents. Verify before you buy—see <a href="/skye-summit-hoa">HOA guide</a>.',
      },
      {
        q: 'What metrics should investors review?',
        a: 'Gross rent, vacancy assumptions, HOA fees, insurance, taxes, and capex for turnovers.',
      },
      {
        q: 'Does Dr. Jan Duffy work with out-of-state investors?',
        a: 'Yes. Pair with <a href="/relocate">relocation</a> resources and local property management referrals as needed.',
      },
    ],
  },
  'relocate.html': {
    quickAnswer:
      'Relocating to Skye Summit or northwest Las Vegas? Dr. Jan Duffy offers virtual consults, curated tours, school and commute planning, and offer coordination for out-of-state buyers. Office hours Sun–Sat 9 AM–6 PM—(702) 930-8222.',
    faqs: [
      {
        q: 'Can I buy in Skye Summit before moving to Las Vegas?',
        a: 'Yes, with video tours, local inspections, and remote closing support where programs allow.',
      },
      {
        q: 'What should relocators compare besides price?',
        a: 'Commute, elevation climate, HOA structure, and school assignments—see <a href="/living-in-skye-summit">living guide</a>.',
      },
      {
        q: 'Where is the real estate office?',
        a: `<a href="${C.MAP_PAGE_PATH}">${C.STREET}, ${C.CITY}, ${C.REGION} ${C.POSTAL}</a>.`,
      },
    ],
  },
  'community.html': {
    quickAnswer:
      'Skye Summit is a master-planned northwest Las Vegas community at ~3,200 ft elevation with trails, amenities, and proximity to Centennial Hills. Explore lifestyle details here; for listings see <a href="/homes-for-sale-skye-summit">homes for sale</a> or call (702) 930-8222.',
    faqs: [
      {
        q: 'What amenities does Skye Summit offer?',
        a: 'Trails, parks, and community features vary by phase—tour to see pools, fitness, and club access for your target subdivision.',
      },
      {
        q: 'How far is Skye Summit from Red Rock Canyon?',
        a: 'Red Rock is a short drive west—popular for hiking and recreation among northwest residents.',
      },
      {
        q: 'Where can I read more FAQs?',
        a: 'See <a href="/skye-summit-faq">Skye Summit FAQ</a> and <a href="/living-in-skye-summit">living in Skye Summit</a>.',
      },
    ],
  },
  'homes-for-sale-skye-summit.html': {
    quickAnswer:
      'Skye Summit is a pre-construction Olympia Companies community with first homes expected Fall 2027. Join the early-interest list with Dr. Jan Duffy, and browse nearby Centennial Hills listings below—(702) 930-8222.',
    faqs: [
      {
        q: 'When will Skye Summit homes be available?',
        a: 'The first Skye Summit homes are expected Fall 2027. <a href="/contact">Join the interest list</a> for builder, floor plan, and pricing updates.',
      },
      {
        q: 'Can I filter nearby listings by zip code?',
        a: 'Yes—use the <a href="/las-vegas-zip-code-map">Las Vegas zip code map</a> or ask for a search in Centennial Hills and nearby northwest valley codes.',
      },
      {
        q: 'Do you represent buyers on nearby listings?',
        a: 'Dr. Jan Duffy represents buyers on active listings in Centennial Hills and northwest Las Vegas, and helps with Skye Summit pre-construction interest.',
      },
    ],
  },
  'contact.html': {
    quickAnswer:
      `Contact Dr. Jan Duffy at ${C.PHONE_DISPLAY}, ${C.EMAIL}, or ${C.STREET}, ${C.CITY}, ${C.REGION} ${C.POSTAL}. Office hours: Sun–Sat 9 AM–6 PM.`,
    faqs: [
      {
        q: 'What is the fastest way to reach Dr. Jan Duffy?',
        a: `Call or text <a href="tel:${C.PHONE_TEL}">${C.PHONE_DISPLAY}</a> for showings and valuation requests.`,
      },
      {
        q: 'Where is the office?',
        a: `<a href="${C.MAP_PAGE_PATH}">Office location &amp; directions</a> — ${C.LABEL_OFFICE_SAME_AS_GOOGLE}.`,
      },
    ],
  },
  'index.html': {
    quickAnswer:
      'Dr. Jan Duffy is a Berkshire Hathaway HomeServices REALTOR® specializing in Skye Summit and northwest Las Vegas. Skye Summit is pre-construction with first homes expected Fall 2027—join the interest list for updates and browse nearby Centennial Hills listings—(702) 930-8222.',
    faqs: [
      {
        q: 'Who lists Skye Summit homes on this site?',
        a: 'Dr. Jan Duffy, Nevada license S.0197614.LLC, specializing in Skye Summit buyer and seller services since 2009.',
      },
      {
        q: 'Where is Skye Summit located?',
        a: 'Northwest Las Vegas (Centennial Hills area), approximately 3,200 feet elevation. See <a href="/skye-summit-faq">FAQ</a>.',
      },
      {
        q: 'How do I get first-access Skye Summit updates?',
        a: '<a href="/contact">Join the Skye Summit interest list</a> or call <a href="tel:+17029308222">(702) 930-8222</a>.',
      },
    ],
  },
  'blog.html': {
    quickAnswer:
      'Insider notes on Skye Summit and northwest Las Vegas real estate from Dr. Jan Duffy—market updates, community tips, and buyer/seller guides. Call (702) 930-8222.',
    faqs: [
      {
        q: 'What topics does the blog cover?',
        a: 'Skye Summit lifestyle, market trends, buyer tips, and seller prep for northwest Las Vegas.',
      },
    ],
  },
  'office-location.html': {
    quickAnswer:
      `Dr. Jan Duffy's office is at ${C.STREET}, ${C.CITY}, ${C.REGION} ${C.POSTAL} (${C.LABEL_OFFICE_SAME_AS_GOOGLE}). Hours Sun–Sat 9 AM–6 PM—<a href="tel:${C.PHONE_TEL}">${C.PHONE_DISPLAY}</a>.`,
    faqs: [
      {
        q: 'How do I get directions to the office?',
        a: `<a href="${C.MAP_PAGE_PATH}">Open the office map</a> for GPS coordinates and Google Maps directions.`,
      },
    ],
  },
});

function faqHtml(faqs) {
  return faqs
    .map(
      (f) => `
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>${f.q}</span>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="faq-answer">
                            <p>${f.a}</p>
                        </div>
                    </div>`
    )
    .join('');
}

function faqJsonLd(faqs, pageUrl) {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q.replace(/<[^>]+>/g, ''),
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a.replace(/<[^>]+>/g, ''),
        },
      })),
      url: pageUrl,
    },
    null,
    2
  );
}

function quickAnswerBlock(pageKey, config) {
  const id = pageKey.replace('.html', '');
  return `
        <!-- ${MARKER} -->
        <section class="aeo-quick-answer" aria-labelledby="aeo-core-${id}">
            <div class="container">
                <h2 id="aeo-core-${id}" class="aeo-quick-answer__title">In plain terms</h2>
                <p class="aeo-quick-answer__text">${config.quickAnswer}</p>
                <p class="aeo-quick-answer__meta">${C.AGENT_NAME}, ${C.AGENT_TITLE} · <a href="tel:${C.PHONE_TEL}">${C.PHONE_DISPLAY}</a> · <a href="${C.MAP_PAGE_PATH}">Office</a> · <a href="/skye-summit-faq">Guides</a></p>
            </div>
        </section>`;
}

function faqSectionBlock(config) {
  return `
        <section class="faq-section aeo-core-faq" aria-labelledby="aeo-faq-title">
            <div class="container">
                <h2 id="aeo-faq-title">Questions about this page</h2>
                <div class="faq-container">${faqHtml(config.faqs)}
                </div>
            </div>
        </section>`;
}

/** Parse visible FAQ accordion markup for schema that matches on-page content. */
function extractFaqsFromHtml(html) {
  const faqs = [];
  const re =
    /<button class="faq-question"[^>]*>\s*<span>([^<]*)<\/span>[\s\S]*?<div class="faq-answer">\s*<p>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    faqs.push({ q: m[1].trim(), a: m[2].trim() });
  }
  return faqs;
}

function hasFaqSection(html) {
  return /<section class="faq-section"/i.test(html);
}

function stripAeo(html) {
  return html
    .replace(/\s*<!-- AEO_CORE_BEGIN -->[\s\S]*?<\/section>\s*/gi, '\n')
    .replace(
      /\s*<section class="faq-section aeo-core-faq"[\s\S]*?<\/section>\s*/gi,
      '\n'
    )
    .replace(
      /\s*<script type="application\/ld\+json" data-aeo-core-faq>[\s\S]*?<\/script>\s*/gi,
      '\n'
    );
}

function pageUrl(fileName) {
  if (fileName === 'index.html') return `${C.SITE}/`;
  const slug = fileName.replace(/\.html$/, '');
  return `${C.SITE}/${slug}`;
}

let updated = 0;

for (const [fileName, config] of Object.entries(CORE_PAGES)) {
  const filePath = path.join(root, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`enhance-core-pages-aeo: skip missing ${fileName}`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  html = stripAeo(html);

  const qa = quickAnswerBlock(fileName, config);
  const faqBlock = faqSectionBlock(config);

  if (/<section class="service-hero"/i.test(html)) {
    html = html.replace(
      /(<section class="service-hero"[\s\S]*?<\/section>)/i,
      `$1\n${qa}`
    );
  } else if (/<section id="home" class="hero hero--home"/i.test(html)) {
    html = html.replace(
      /(<section id="home" class="hero hero--home"[\s\S]*?<\/section>)/i,
      `$1\n${qa}`
    );
  } else if (/<main[^>]*>/i.test(html)) {
    html = html.replace(/<main[^>]*>/i, (m) => `${m}\n${qa}`);
  }

  const visibleFaqs = extractFaqsFromHtml(html);
  const faqsForSchema =
    visibleFaqs.length > 0 ? visibleFaqs : config.faqs;

  if (!hasFaqSection(html)) {
    if (/<section id="hyperlocal-gbp"/i.test(html)) {
      html = html.replace(
        /<section id="hyperlocal-gbp"/i,
        `${faqBlock}\n        <section id="hyperlocal-gbp"`
      );
    } else if (/<\/main>/i.test(html)) {
      html = html.replace(/<\/main>/i, `${faqBlock}\n    </main>`);
    }
  }

  if (faqsForSchema.length > 0 && /<\/head>/i.test(html)) {
    const schemaMarkup = `<script type="application/ld+json" data-aeo-core-faq>\n${faqJsonLd(faqsForSchema, pageUrl(fileName))}\n    </script>`;
    html = html.replace(/<\/head>/i, `    ${schemaMarkup}\n</head>`);
  }

  if (fileName === 'index.html') {
    html = html
      .replace(
        /content="36\.1699;-115\.1398"/g,
        `content="${C.GEO_POSITION}"`
      )
      .replace(
        /content="36\.1699, -115\.1398"/g,
        `content="${C.GEO_ICBM}"`
      );
  }

  fs.writeFileSync(filePath, html);
  updated += 1;
}

console.log(`enhance-core-pages-aeo: updated ${updated} core page(s)`);
