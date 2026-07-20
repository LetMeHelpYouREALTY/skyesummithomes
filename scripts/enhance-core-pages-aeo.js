#!/usr/bin/env node
/**
 * Adds AEO quick-answer blocks and page-specific FAQs to core marketing pages.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');
const { PAGE_SEO } = require('../lib/hyperlocal-seo');

const root = path.join(__dirname, '..');
const MARKER = 'AEO_CORE_BEGIN';
const enrichmentPath = path.join(root, 'lib/parallel-seo-enrichment.json');

function mergeHyperlocalSeoAnswers(pages) {
  const merged = { ...pages };
  for (const [fileName, seo] of Object.entries(PAGE_SEO)) {
    if (!seo.quickAnswer) continue;
    if (merged[fileName]) {
      merged[fileName] = {
        ...merged[fileName],
        quickAnswer: seo.quickAnswer,
      };
    } else {
      merged[fileName] = {
        quickAnswer: seo.quickAnswer,
        faqs: [
          {
            q: 'Who is the Skye Summit buyer\'s representative?',
            a: 'Dr. Jan Duffy, REALTOR® (license S.0197614.LLC) with Berkshire Hathaway HomeServices Nevada Properties. Call <a href="tel:+17029308222">(702) 930-8222</a>.',
          },
          {
            q: 'What is the Skye Summit Master Plan?',
            a: 'A 505-acre Olympia Companies community in northwest Las Vegas beyond the 215 Beltway, planned for about 3,500 homes. See <a href="/skye-summit-master-plan">master plan</a>.',
          },
        ],
      };
    }
  }
  return merged;
}

function mergeParallelEnrichment(pages) {
  let merged = mergeHyperlocalSeoAnswers(pages);
  if (!fs.existsSync(enrichmentPath)) return merged;
  try {
    const data = JSON.parse(fs.readFileSync(enrichmentPath, 'utf8'));
    for (const [fileName, overlay] of Object.entries(data.corePages || {})) {
      if (!merged[fileName]) continue;
      merged[fileName] = {
        ...merged[fileName],
        // Prefer research-backed PAGE_SEO answers when present
        quickAnswer:
          PAGE_SEO[fileName]?.quickAnswer ||
          overlay.quickAnswer ||
          merged[fileName].quickAnswer,
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
    return merged;
  }
}

const CORE_PAGES = mergeParallelEnrichment({
  'about.html': {
    quickAnswer:
      'Dr. Jan Duffy is a Las Vegas REALTOR® (license S.0197614.LLC) with Berkshire Hathaway HomeServices Nevada Properties—the buyer\'s representative for the Skye Summit Master Plan (505 acres, coming Fall 2027). Call (702) 930-8222 or visit the office at 11411 Southern Highlands Pkwy #300, Las Vegas.',
    faqs: [
      {
        q: 'Who is Dr. Jan Duffy?',
        a: 'Dr. Jan Duffy is a Nevada REALTOR® and buyer\'s representative for the Skye Summit Master Plan—early-access updates, builder coordination, and new-construction buyer representation.',
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
      'To buy in the Skye Summit Master Plan: join the early-interest list, get mortgage pre-approval, review builder phases and floor plans, then coordinate offers with buyer representation. Dr. Jan Duffy serves Skye Summit Master Plan buyers—(702) 930-8222.',
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
      'Selling within the Skye Summit Master Plan corridor? Dr. Jan Duffy helps with builder-phase timing, interest-list coordination, and consultation on new-construction positioning. Call (702) 930-8222.',
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
      'Consult Dr. Jan Duffy about Skye Summit Master Plan phases, builder pricing, and early-access updates—not automated portal estimates alone. Request a no-obligation consult at (702) 930-8222.',
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
      'The Skye Summit Master Plan (505 acres, Fall 2027) attracts investors tracking new-build phases, rental potential, and long-term appreciation. Dr. Jan Duffy helps analyze master-plan timelines and acquisition strategy—(702) 930-8222.',
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
      'Relocating for the Skye Summit Master Plan? Dr. Jan Duffy offers virtual consults, early-access updates, builder briefings, and buyer representation for out-of-state purchasers. Office hours Sun–Sat 9 AM–6 PM—(702) 930-8222.',
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
      'The Skye Summit Master Plan is a 505-acre Olympia Companies community coming Fall 2027—desert-conscious design, integrated parks, and trail systems just beyond the 215 Beltway. <a href="/new-construction-skye-summit">New construction guide</a> · <a href="/contact">Join the interest list</a> · (702) 930-8222.',
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
      'The Skye Summit Master Plan is a 505-acre Olympia Companies community beyond the 215 Beltway, coming Fall 2027. KB Home Vertice sales may open early 2027. Join the interest list with Dr. Jan Duffy—(702) 930-8222.',
    faqs: [
      {
        q: 'When will new Skye Summit builder homes be available?',
        a: 'Olympia Companies lists Skye Summit as coming Fall 2027. KB Home&rsquo;s Vertice at Skye Summit (299 homesites) may begin sales early 2027 while homesite work is underway. <a href="/contact">Join the interest list</a> for updates.',
      },
      {
        q: 'What is the Skye Summit Master Plan?',
        a: 'A 505-acre Olympia Companies master-planned community with about 3,500 planned homes, integrated parks, and trail systems—coming Fall 2027. See <a href="/new-construction-skye-summit">new construction guide</a>.',
      },
      {
        q: 'How do I get early access?',
        a: 'Dr. Jan Duffy maintains an interest list for Skye Summit Master Plan updates—floor plans, builder news, and pricing. <a href="/contact">Contact</a> or call <a href="tel:+17029308222">(702) 930-8222</a>.',
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
      'Dr. Jan Duffy is a Berkshire Hathaway HomeServices REALTOR® and buyer\'s representative for the Skye Summit Master Plan—a 505-acre Olympia Companies community coming Fall 2027. Join the interest list for early-access updates—(702) 930-8222.',
    faqs: [
      {
        q: 'Who lists Skye Summit homes on this site?',
        a: 'Dr. Jan Duffy, Nevada license S.0197614.LLC, is the buyer\'s representative for the Skye Summit Master Plan since 2009.',
      },
      {
        q: 'Where is the Skye Summit Master Plan?',
        a: 'Northwest Las Vegas, just beyond the 215 Beltway—a 505-acre Olympia Companies master plan coming Fall 2027. See <a href="/skye-summit-faq">FAQ</a>.',
      },
      {
        q: 'When will Skye Summit Master Plan homes be available?',
        a: 'Olympia Companies targets Fall 2027 for the community launch. KB Home Vertice sales may open early 2027. <a href="/contact">Join the interest list</a> for updates.',
      },
    ],
  },
  'blog.html': {
    quickAnswer:
      'Insider notes on the Skye Summit Master Plan from Dr. Jan Duffy—builder updates, community planning, and buyer guides. Call (702) 930-8222.',
    faqs: [
      {
        q: 'What topics does the blog cover?',
        a: 'Skye Summit Master Plan updates, new construction timelines, buyer tips, and community planning.',
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

  // Keep RealScout office widget immediately under the hero — insert AEO after it.
  if (/id="realscout-listings"/i.test(html)) {
    html = html.replace(
      /(<section[^>]*id="realscout-listings"[^>]*>[\s\S]*?<\/section>)/i,
      `$1\n${qa}`
    );
  } else if (/<section class="service-hero"/i.test(html)) {
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
