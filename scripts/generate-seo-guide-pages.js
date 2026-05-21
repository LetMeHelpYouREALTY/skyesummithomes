#!/usr/bin/env node
/**
 * Generates hyperlocal SEO / GEO / AEO guide pages (static HTML).
 * Run: node scripts/generate-seo-guide-pages.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');
const { guideFooterListHtml, guideCtaLinksHtml } = require('../lib/guide-nav');

const root = path.join(__dirname, '..');
const SITE = C.SITE;
const GSC_TOKEN = 'wKOftY7ctL98xgE1EW2r-2pYqOXyN109r4ZLLiRwQsI';

const GUIDES = [
  {
    slug: 'skye-summit-realtor',
    title: 'Skye Summit REALTOR® | Dr. Jan Duffy | Buyer & Seller Concierge',
    description:
      'Dr. Jan Duffy is the Skye Summit concierge REALTOR® for homebuyers and homesellers. Local buyer representation, seller marketing, new construction, and Berkshire Hathaway HomeServices Nevada Properties. (702) 930-8222.',
    h1: 'Skye Summit REALTOR®: Dr. Jan Duffy',
    heroSubtitle:
      'Concierge real estate for Skye Summit communities—one trusted advisor for your entire buy or sell journey in northwest Las Vegas.',
    breadcrumbName: 'Skye Summit REALTOR®',
    quickAnswer:
      'Dr. Jan Duffy is the Skye Summit concierge REALTOR® (Nevada license S.0197614.LLC) with Berkshire Hathaway HomeServices Nevada Properties—one contact for buyer representation, seller marketing, and new construction in northwest Las Vegas. Call (702) 930-8222.',
    faqs: [
      {
        q: 'Who is the Skye Summit concierge REALTOR®?',
        a: 'Dr. Jan Duffy, REALTOR® (License S.0197614.LLC) with Berkshire Hathaway HomeServices Nevada Properties, focuses on Skye Summit and northwest Las Vegas for both buyers and sellers.',
      },
      {
        q: 'What does buyer concierge include in Skye Summit?',
        a: 'Listing alerts, private showings, comparable market analysis, offer strategy, inspection coordination, and builder contract review for new construction.',
      },
      {
        q: 'What does seller concierge include?',
        a: 'Professional valuation, staging guidance, marketing plan, offer review, and negotiation through closing—priced for Skye Summit phase, view, and lot premiums.',
      },
      {
        q: 'Does Dr. Jan Duffy work with new construction in Skye Summit?',
        a: 'Yes. Buyer representation on builder contracts, design center upgrades, and timeline management. See <a href="/new-construction-skye-summit">new construction guide</a>.',
      },
      {
        q: 'How do I contact Dr. Jan Duffy?',
        a: 'Call <a href="tel:+17029308222">(702) 930-8222</a>, email DrJanSells@SkyeSummitHomes.com, or <a href="/contact">schedule a consultation</a>. Office: 11411 Southern Highlands Pkwy #300, Las Vegas, NV 89141.',
      },
    ],
    extraSections: `
        <section class="why-section">
            <div class="container">
                <h2>Concierge services for Skye Summit</h2>
                <div class="features-grid">
                    <div class="feature">
                        <i class="fas fa-user-check"></i>
                        <h3>Single point of contact</h3>
                        <p>One advisor from first call through closing—no handoffs between departments.</p>
                    </div>
                    <div class="feature">
                        <i class="fas fa-mountain"></i>
                        <h3>Hyperlocal expertise</h3>
                        <p>Skye Summit phases, elevation, HOA nuances, and Centennial Hills market context.</p>
                    </div>
                    <div class="feature">
                        <i class="fas fa-handshake"></i>
                        <h3>Buyer &amp; seller</h3>
                        <p>Representation whether you are moving in, moving up, or selling in Skye Summit.</p>
                    </div>
                </div>
                <p style="text-align:center;margin-top:1.5rem;">
                    <a href="/buy" class="btn btn-primary">Buyer concierge</a>
                    <a href="/sell" class="btn btn-secondary">Seller concierge</a>
                </p>
            </div>
        </section>`,
  },
  {
    slug: 'skye-summit-faq',
    title: 'Skye Summit FAQ | Homes, HOA, Schools & Buying | Dr. Jan Duffy',
    description:
      'Answers to common Skye Summit Las Vegas questions: location, zip codes, HOA, schools, home prices, new construction, and how to buy or sell with Dr. Jan Duffy.',
    h1: 'Skye Summit FAQ: Answers for Buyers & Sellers',
    heroSubtitle:
      'Clear answers about living, buying, and selling in Skye Summit—northwest Las Vegas at 3,200 feet elevation.',
    breadcrumbName: 'Skye Summit FAQ',
    quickAnswer:
      'Skye Summit is a master-planned northwest Las Vegas community at ~3,200 ft elevation in the Centennial Hills area, with resale and new construction homes, HOA amenities, and CCSD schools. For buying or selling, contact Dr. Jan Duffy at (702) 930-8222.',
    faqs: [
      {
        q: 'Where is Skye Summit in Las Vegas?',
        a: 'Skye Summit is a master-planned elevated community in northwest Las Vegas, near Centennial Hills, at roughly 3,200 feet elevation with valley and mountain views. It is part of the broader northwest valley growth corridor.',
      },
      {
        q: 'What zip codes are near Skye Summit?',
        a: 'Northwest Las Vegas zip codes commonly searched alongside Skye Summit include 89149, 89144, and nearby Centennial Hills areas. Use our <a href="/las-vegas-zip-code-map">Las Vegas zip code map</a> to explore listings and neighborhoods by zip.',
      },
      {
        q: 'Is Skye Summit a gated community?',
        a: 'Many phases feature controlled access and community security features. Specific access rules vary by phase and builder—ask for phase-level details when you tour homes.',
      },
      {
        q: 'What is the elevation of Skye Summit?',
        a: 'Skye Summit sits at approximately 3,200 feet above sea level, which can mean slightly cooler evenings than the central valley and expansive views.',
      },
      {
        q: 'Are there new construction homes in Skye Summit?',
        a: 'Yes. Skye Summit includes new-build opportunities from premier builders alongside resale homes. See our <a href="/new-construction-skye-summit">new construction guide</a> and <a href="/buy">buying in Skye Summit</a> page for the purchase process.',
      },
      {
        q: 'What HOA fees should I expect in Skye Summit?',
        a: 'HOA assessments vary by phase, builder, and amenity package. They typically fund landscaping, common areas, amenities, and security. See <a href="/skye-summit-hoa">Skye Summit HOA guide</a> or contact us for current figures on a specific address.',
      },
      {
        q: 'What schools serve Skye Summit?',
        a: 'Homes are generally served by Clark County School District schools, with additional charter and private options in northwest Las Vegas. See <a href="/skye-summit-schools">schools near Skye Summit</a> for a planning overview.',
      },
      {
        q: 'What price range are Skye Summit homes?',
        a: 'Listings change weekly. Browse <a href="/homes-for-sale-skye-summit">current Skye Summit homes for sale</a> or call <a href="tel:+17029308222">(702) 930-8222</a> for a custom search aligned to your budget.',
      },
      {
        q: 'How do I buy a home in Skye Summit?',
        a: 'Start with financing pre-approval, define must-haves (phase, view, new vs resale), then tour comparables. Dr. Jan Duffy guides offers, inspections, and closing—see <a href="/buy">buy in Skye Summit</a>.',
      },
      {
        q: 'How do I sell my Skye Summit home?',
        a: 'Professional pricing accounts for phase, lot, views, and upgrades—not online estimates alone. Request a <a href="/valuation">free Skye Summit valuation</a> or read <a href="/sell">sell your Skye Summit home</a>.',
      },
      {
        q: 'Is Skye Summit good for relocations?',
        a: 'Many relocators choose northwest Las Vegas for newer housing stock, mountain proximity, and access to Summerlin and Centennial Hills services. See <a href="/relocate">relocation services</a> and <a href="/living-in-skye-summit">living in Skye Summit</a>.',
      },
      {
        q: 'How is Skye Summit related to Centennial Hills?',
        a: 'Skye Summit sits within the Centennial Hills area of northwest Las Vegas. Read <a href="/centennial-hills-real-estate">Centennial Hills real estate</a> for the wider market context.',
      },
    ],
    extraSections: `
        <section class="why-section">
            <div class="container">
                <h2>More Skye Summit resources</h2>
                <div class="features-grid">
                    <div class="feature">
                        <i class="fas fa-book-open"></i>
                        <h3><a href="/community">Community guide</a></h3>
                        <p>Lifestyle, amenities, and neighborhood overview.</p>
                    </div>
                    <div class="feature">
                        <i class="fas fa-map-marked-alt"></i>
                        <h3><a href="/las-vegas-zip-code-map">Zip code map</a></h3>
                        <p>Search the Las Vegas Valley by zip and region.</p>
                    </div>
                    <div class="feature">
                        <i class="fas fa-home"></i>
                        <h3><a href="/homes-for-sale-skye-summit">Homes for sale</a></h3>
                        <p>Live listings with tour and offer support.</p>
                    </div>
                    <div class="feature">
                        <i class="fas fa-chart-line"></i>
                        <h3><a href="/skye-summit-home-prices">Home prices</a></h3>
                        <p>Market trends and value drivers.</p>
                    </div>
                    <div class="feature">
                        <i class="fas fa-location-dot"></i>
                        <h3><a href="/northwest-las-vegas-real-estate">Northwest Las Vegas</a></h3>
                        <p>Regional hub and zip codes.</p>
                    </div>
                </div>
            </div>
        </section>`,
  },
  {
    slug: 'skye-summit-schools',
    title: 'Schools Near Skye Summit Las Vegas | CCSD & Options | Dr. Jan Duffy',
    description:
      'Schools serving Skye Summit and northwest Las Vegas: Clark County School District overview, charter and private options, and how to verify assignments by address.',
    h1: 'Schools Near Skye Summit, Las Vegas',
    heroSubtitle:
      'Planning for families relocating to northwest Las Vegas—district basics, verification steps, and local resources.',
    breadcrumbName: 'Skye Summit Schools',
    quickAnswer:
      'Skye Summit addresses are typically zoned in Clark County School District (CCSD); exact elementary, middle, and high schools depend on street address—verify with CCSD before you write an offer. Dr. Jan Duffy helps relocating families confirm assignments.',
    faqs: [
      {
        q: 'What school district is Skye Summit in?',
        a: 'Skye Summit homes are typically assigned to schools in the <strong>Clark County School District (CCSD)</strong>. Exact school assignments depend on your street address and current district boundaries.',
      },
      {
        q: 'How do I verify which school my Skye Summit address is zoned for?',
        a: 'Use the CCSD zoning lookup with the property address, and confirm with the seller or builder on new construction. Dr. Jan Duffy can help you verify assignments before you write an offer.',
      },
      {
        q: 'Are there charter or private schools near Skye Summit?',
        a: 'Northwest Las Vegas offers charter programs and private schools within a reasonable drive of Centennial Hills and Skye Summit. Many families tour multiple options before choosing a home location.',
      },
      {
        q: 'Do new construction buyers choose schools before closing?',
        a: 'Yes—buyers often shortlist schools early because boundaries can influence neighborhood choice. Pair school research with <a href="/new-construction-skye-summit">new construction in Skye Summit</a> planning.',
      },
    ],
    extraSections: `
        <section class="why-section">
            <div class="container">
                <h2>CCSD planning checklist</h2>
                <ul class="process-steps" style="max-width:720px;margin:0 auto;">
                    <li>Confirm elementary, middle, and high school assignments for the exact listing address.</li>
                    <li>Ask about capacity, magnet programs, and bus routes if relevant to your family.</li>
                    <li>Visit campuses when possible—especially for relocations from out of state.</li>
                    <li>Factor commute from Skye Summit to school drop-off into your daily routine.</li>
                </ul>
                <p class="section-description" style="margin-top:1.5rem;">Official ratings and boundaries change. Always verify with CCSD and the listing agent before closing.</p>
            </div>
        </section>
        <section class="demographics-section">
            <div class="container">
                <h2>Why families choose Skye Summit</h2>
                <p class="lead-text">Elevated northwest living, newer housing stock, parks and trails, and proximity to Centennial Hills shopping and medical services make Skye Summit attractive for households balancing schools, outdoor time, and commute flexibility.</p>
                <p><a href="/community">Skye Summit community guide</a> · <a href="/living-in-skye-summit">Living in Skye Summit</a> · <a href="/skye-summit-faq">FAQ</a></p>
            </div>
        </section>`,
  },
  {
    slug: 'living-in-skye-summit',
    title: 'Living in Skye Summit Las Vegas | Lifestyle, Commute & Climate',
    description:
      'What it is like to live in Skye Summit: elevation, climate, commutes, daily conveniences, and who thrives in this northwest Las Vegas master-planned community.',
    h1: 'Living in Skye Summit: Lifestyle & Practical Guide',
    heroSubtitle:
      'Elevation, outdoor living, Centennial Hills convenience, and what to expect day to day in northwest Las Vegas.',
    breadcrumbName: 'Living in Skye Summit',
    quickAnswer:
      'Living in Skye Summit means elevated northwest Las Vegas lifestyle: cooler evenings near 3,200 ft, trails and parks, Centennial Hills shopping nearby, and commutes that vary by route and time of day. Tour phases to match your daily routine.',
    faqs: [
      {
        q: 'What is the weather like at Skye Summit elevation?',
        a: 'At roughly 3,200 feet, evenings can feel cooler than central Las Vegas while summers remain hot and dry. Many residents value breezes and views more than valley-floor neighborhoods.',
      },
      {
        q: 'How long is the commute from Skye Summit to the Las Vegas Strip?',
        a: 'Drive times vary by time of day and route; off-peak trips are often 25–40 minutes, with longer peaks. Many residents work remotely or commute to Summerlin, Centennial Hills, or northwest employment centers.',
      },
      {
        q: 'What shopping and healthcare are nearby?',
        a: 'Centennial Hills provides grocery, retail, dining, and medical offices within a short drive. See the <a href="/community">community guide</a> for lifestyle amenities inside Skye Summit.',
      },
      {
        q: 'Who is Skye Summit best for?',
        a: 'Buyers who want newer homes, mountain views, trails, and gated-community feel—families, professionals, retirees, and investors comparing northwest Las Vegas submarkets.',
      },
      {
        q: 'How does Skye Summit compare to Summerlin?',
        a: 'Both are master-planned with strong amenities. Skye Summit emphasizes elevation and newer-build inventory in the Centennial Hills corridor; Summerlin offers a larger established west-side footprint. Tour both if you are new to Las Vegas.',
      },
    ],
    extraSections: `
        <section class="community-overview">
            <div class="container">
                <h2>Daily life highlights</h2>
                <div class="community-stats">
                    <div class="stat-box"><i class="fas fa-hiking"></i><h3>Trails & parks</h3><p>Walkable open space and outdoor recreation</p></div>
                    <div class="stat-box"><i class="fas fa-golf-ball"></i><h3>Golf nearby</h3><p>Courses and club lifestyle options</p></div>
                    <div class="stat-box"><i class="fas fa-store"></i><h3>Centennial Hills</h3><p>Retail, dining, and services close by</p></div>
                    <div class="stat-box"><i class="fas fa-mountain"></i><h3>Red Rock access</h3><p>Scenic recreation west of the valley</p></div>
                </div>
            </div>
        </section>`,
  },
  {
    slug: 'new-construction-skye-summit',
    title: 'New Construction in Skye Summit | Builders & Buyer Guide',
    description:
      'Buying new construction in Skye Summit Las Vegas: builder contracts, design centers, timelines, inspections, and how Dr. Jan Duffy represents buyers.',
    h1: 'New Construction Homes in Skye Summit',
    heroSubtitle:
      'Navigate builder contracts, upgrades, and closing timelines with a Skye Summit specialist.',
    breadcrumbName: 'New Construction',
    quickAnswer:
      'New construction in Skye Summit requires builder contract review, design center choices, and inspections at key milestones—buyer representation protects your deposit, timeline, and punch-list before closing.',
    faqs: [
      {
        q: 'Can a REALTOR represent me on new construction in Skye Summit?',
        a: 'Yes. Builder sales agents represent the builder. Dr. Jan Duffy represents <em>you</em>—reviewing contracts, upgrade value, timelines, and walk-through items.',
      },
      {
        q: 'What should I compare between builders?',
        a: 'Base price, structural options, lot premiums, HOA structure, warranty terms, estimated completion date, and resale history in the same phase.',
      },
      {
        q: 'When are inspections done on new builds?',
        a: 'Buyers typically schedule inspections at pre-drywall and final walk-through stages, plus any negotiated verification before closing.',
      },
      {
        q: 'How long does new construction take in Skye Summit?',
        a: 'Timelines depend on phase, labor market, and customization level—often several months from contract to keys. Your purchase agreement defines critical dates.',
      },
    ],
    extraSections: `
        <section class="process-section">
            <div class="container">
                <h2>New construction buying steps</h2>
                <ol class="process-steps">
                    <li><strong>Consultation</strong> — Budget, timeline, must-have floor plan and lot.</li>
                    <li><strong>Builder & phase selection</strong> — Compare incentives and completion risk.</li>
                    <li><strong>Contract review</strong> — Deposits, change orders, and delay language.</li>
                    <li><strong>Design center</strong> — Prioritize upgrades with resale impact.</li>
                    <li><strong>Inspections & walk-through</strong> — Document punch-list items before closing.</li>
                    <li><strong>Closing</strong> — Final walk-through and key delivery.</li>
                </ol>
                <p style="text-align:center;margin-top:1.5rem;"><a href="/buy" class="btn btn-primary">Buyer representation consult</a></p>
            </div>
        </section>`,
  },
  {
    slug: 'skye-summit-hoa',
    title: 'Skye Summit HOA Guide | Fees, Amenities & Rules',
    description:
      'Understand Skye Summit HOA fees, what amenities are included, governance basics, and questions to ask before you buy in northwest Las Vegas.',
    h1: 'Skye Summit HOA: Fees, Amenities & What to Ask',
    heroSubtitle:
      'HOA costs vary by phase—here is how to evaluate assessments before you buy.',
    breadcrumbName: 'Skye Summit HOA',
    quickAnswer:
      'Skye Summit HOA fees and rules vary by phase and builder; assessments usually fund landscaping, amenities, and reserves. Review CC&Rs and recent financials during due diligence—ask Dr. Jan Duffy for HOA details on a specific address.',
    faqs: [
      {
        q: 'Why do HOA fees differ between Skye Summit homes?',
        a: 'Phases, builders, and amenity packages use different budgets. Larger homes, golf-adjacent phases, or premium club access can carry higher assessments than entry phases.',
      },
      {
        q: 'What do Skye Summit HOA fees typically cover?',
        a: 'Common area landscaping, amenity operations (pools, fitness, trails where applicable), security features, and reserve funding for future repairs.',
      },
      {
        q: 'What documents should I review before buying?',
        a: 'Request recent financials, reserve study summary, CC&Rs, rules and regulations, and any pending special assessments during due diligence.',
      },
      {
        q: 'Can HOA rules affect rentals or short-term stays?',
        a: 'Many master-planned communities restrict rentals or minimum lease terms. Verify current governing documents for the specific subdivision.',
      },
    ],
    extraSections: `
        <section class="hoa-section">
            <div class="container">
                <h2>Questions to ask on tour</h2>
                <div class="hoa-info">
                    <div class="hoa-card"><h3>Monthly assessment</h3><p>Current fee, what is included, and planned increases.</p></div>
                    <div class="hoa-card"><h3>Reserves</h3><p>Health of reserve funding for roads, walls, and amenities.</p></div>
                    <div class="hoa-card"><h3>Amenity access</h3><p>Which pools, gyms, or clubs your phase can use.</p></div>
                </div>
                <p class="hoa-note" style="text-align:center;margin-top:1rem;">For HOA dollar amounts on a listing you are considering, <a href="/contact">contact Dr. Jan Duffy</a> with the address.</p>
            </div>
        </section>`,
  },
  {
    slug: 'centennial-hills-real-estate',
    title: 'Centennial Hills Real Estate | Skye Summit & NW Las Vegas',
    description:
      'Centennial Hills Las Vegas real estate overview with focus on Skye Summit: market context, buyer profiles, and homes for sale in northwest Las Vegas.',
    h1: 'Centennial Hills Real Estate & Skye Summit',
    heroSubtitle:
      'Northwest Las Vegas growth, amenities, and how Skye Summit fits the Centennial Hills market.',
    breadcrumbName: 'Centennial Hills',
    quickAnswer:
      'Centennial Hills is the northwest Las Vegas corridor that includes Skye Summit—buyers often compare newer elevated inventory in Skye Summit with established Centennial Hills neighborhoods for price, commute, and amenities.',
    faqs: [
      {
        q: 'Is Skye Summit in Centennial Hills?',
        a: 'Skye Summit is a master-planned community within the Centennial Hills area of northwest Las Vegas, known for newer homes and mountain proximity.',
      },
      {
        q: 'Why do buyers search Centennial Hills and Skye Summit together?',
        a: 'They share retail corridors, medical access, and school planning—but Skye Summit adds elevated sites and newer-build inventory. Compare both on tours.',
      },
      {
        q: 'Where can I see Centennial Hills listings?',
        a: 'Browse <a href="/homes-for-sale-skye-summit">Skye Summit area listings</a> or use the <a href="/las-vegas-zip-code-map">zip code map</a> for northwest valley searches.',
      },
      {
        q: 'Who should I call for Centennial Hills / Skye Summit representation?',
        a: 'Dr. Jan Duffy, REALTOR® with Berkshire Hathaway HomeServices Nevada Properties. License S.0197614.LLC — <a href="tel:+17029308222">(702) 930-8222</a>.',
      },
    ],
    extraSections: `
        <section class="why-section">
            <div class="container">
                <h2>Northwest Las Vegas buyer paths</h2>
                <div class="features-grid">
                    <div class="feature"><i class="fas fa-key"></i><h3><a href="/buy">Buy in Skye Summit</a></h3><p>Search strategy and offer guidance.</p></div>
                    <div class="feature"><i class="fas fa-tag"></i><h3><a href="/sell">Sell your home</a></h3><p>Pricing and marketing in the submarket.</p></div>
                    <div class="feature"><i class="fas fa-chart-line"></i><h3><a href="/invest">Invest</a></h3><p>Rental and appreciation context.</p></div>
                </div>
            </div>
        </section>`,
  },
  {
    slug: 'skye-summit-home-prices',
    title: 'Skye Summit Home Prices & Market Trends | Dr. Jan Duffy',
    description:
      'Skye Summit Las Vegas home prices, market trends, and what drives value by phase, view, and new vs resale. Updated guidance from Dr. Jan Duffy, REALTOR®.',
    h1: 'Skye Summit Home Prices & Market Overview',
    heroSubtitle:
      'How pricing works in northwest Las Vegas—phase premiums, elevation, and weekly listing changes.',
    quickAnswer:
      'Skye Summit home prices vary by phase, square footage, view, and new-build vs resale inventory. Listings change weekly; for a current range tied to your budget, browse live homes or call Dr. Jan Duffy at (702) 930-8222.',
    breadcrumbName: 'Home Prices',
    faqs: [
      {
        q: 'What affects Skye Summit home prices?',
        a: 'Lot orientation, mountain or valley views, builder phase, finished square footage, upgrade packages, and whether the home is new construction or resale in the same subdivision.',
      },
      {
        q: 'Are Skye Summit prices higher than other northwest Las Vegas areas?',
        a: 'Skye Summit often commands premiums for elevation (~3,200 ft), newer stock, and master-planned amenities compared with older Centennial Hills pockets—compare on tours, not averages alone.',
      },
      {
        q: 'How do I see current Skye Summit listing prices?',
        a: 'Browse <a href="/homes-for-sale-skye-summit">homes for sale in Skye Summit</a> or request a custom MLS search filtered to your price range and must-haves.',
      },
      {
        q: 'Should I use online estimates for Skye Summit?',
        a: 'Automated estimates miss phase and view premiums. Use them as a starting point; confirm with a <a href="/valuation">Skye Summit valuation</a> or comparable sales review before pricing or offering.',
      },
    ],
    extraSections: `
        <section class="why-section">
            <div class="container">
                <h2>Market resources</h2>
                <div class="features-grid">
                    <div class="feature"><i class="fas fa-home"></i><h3><a href="/homes-for-sale-skye-summit">Live listings</a></h3><p>Current ask prices and tour scheduling.</p></div>
                    <div class="feature"><i class="fas fa-chart-line"></i><h3><a href="/valuation">Seller valuation</a></h3><p>Pricing for your phase and upgrades.</p></div>
                    <div class="feature"><i class="fas fa-map"></i><h3><a href="/centennial-hills-real-estate">Centennial Hills</a></h3><p>Wider northwest market context.</p></div>
                </div>
            </div>
        </section>`,
  },
  {
    slug: 'skye-summit-first-time-buyer',
    title: 'First-Time Home Buyer Skye Summit Las Vegas | Dr. Jan Duffy',
    description:
      'First-time home buyer guide for Skye Summit: financing, incentives, inspections, HOA review, and step-by-step buying with Dr. Jan Duffy in northwest Las Vegas.',
    h1: 'First-Time Home Buyers in Skye Summit',
    heroSubtitle:
      'Financing, timelines, and neighborhood fit—without guessing on northwest Las Vegas contracts.',
    quickAnswer:
      'First-time buyers in Skye Summit should get loan pre-approval, define budget with payment comfort (not just max approval), tour resale and new construction, then use buyer representation on offers and inspections. Dr. Jan Duffy guides the full process—call (702) 930-8222.',
    breadcrumbName: 'First-Time Buyers',
    faqs: [
      {
        q: 'What credit score do I need to buy in Skye Summit?',
        a: 'Requirements vary by loan program (FHA, VA, conventional). Many buyers start with 620+ for FHA and higher for conventional; a lender pre-approval clarifies your options.',
      },
      {
        q: 'How much down payment is typical?',
        a: 'Down payments range from 0% (eligible VA) to 3–5% on some conventional/FHA programs and 20% to avoid PMI on conventional loans. Your lender defines what you qualify for.',
      },
      {
        q: 'Do first-time buyers need a REALTOR in Skye Summit?',
        a: 'Yes. Listing agents represent sellers. Dr. Jan Duffy represents <em>you</em>—negotiation, inspections, HOA document review, and closing coordination. See <a href="/buy">buying in Skye Summit</a>.',
      },
      {
        q: 'Is new construction good for first-time buyers?',
        a: 'It can be, with longer timelines and builder contracts to review. Compare with resale in <a href="/new-construction-skye-summit">new construction guide</a> and <a href="/skye-summit-faq">FAQ</a>.',
      },
    ],
    extraSections: `
        <section class="process-section">
            <div class="container">
                <h2>First-time buyer checklist</h2>
                <ol class="process-steps">
                    <li>Pre-approval and monthly payment comfort</li>
                    <li>Must-haves: beds, garage, HOA tolerance, commute</li>
                    <li>Tour Skye Summit phases and comparables</li>
                    <li>Offer, inspection, appraisal, and HOA docs</li>
                    <li>Closing and move-in utilities</li>
                </ol>
                <p style="text-align:center;margin-top:1.5rem;"><a href="/contact" class="btn btn-primary">Schedule buyer consult</a></p>
            </div>
        </section>`,
  },
  {
    slug: 'skye-summit-vs-summerlin',
    title: 'Skye Summit vs Summerlin Las Vegas | Compare Communities',
    description:
      'Compare Skye Summit vs Summerlin: elevation, home age, price positioning, commutes, and amenities. Decide which northwest/west Las Vegas fit is right for you.',
    h1: 'Skye Summit vs Summerlin: Which Fits You?',
    heroSubtitle:
      'Two master-planned destinations—different elevation, inventory age, and daily lifestyle tradeoffs.',
    quickAnswer:
      'Skye Summit emphasizes newer northwest inventory near Centennial Hills at ~3,200 ft elevation; Summerlin is a larger, established west-side master plan with more mature neighborhoods and retail. Many buyers tour both before choosing—Dr. Jan Duffy covers Skye Summit and northwest Las Vegas in depth.',
    breadcrumbName: 'Skye Summit vs Summerlin',
    faqs: [
      {
        q: 'Is Skye Summit part of Summerlin?',
        a: 'No. Skye Summit is in northwest Las Vegas (Centennial Hills corridor). Summerlin is a separate master-planned area on the west side of the valley.',
      },
      {
        q: 'Which has newer homes?',
        a: 'Skye Summit skews newer-build and recent resale phases. Summerlin includes decades of housing stock—from established villages to newer enclaves.',
      },
      {
        q: 'How do commutes compare?',
        a: 'Both depend on your workplace. Skye Summit is northwest-oriented; Summerlin is west-oriented. Test drive times at your typical hours before deciding.',
      },
      {
        q: 'Who helps me compare tours?',
        a: 'Dr. Jan Duffy specializes in Skye Summit and northwest Las Vegas and can coordinate tours and comparables. <a href="tel:+17029308222">(702) 930-8222</a> · <a href="/contact">contact</a>.',
      },
    ],
    extraSections: `
        <section class="community-overview">
            <div class="container">
                <h2>Side-by-side considerations</h2>
                <div class="community-stats">
                    <div class="stat-box"><h3>Skye Summit</h3><p>Elevation, newer phases, Centennial Hills access</p></div>
                    <div class="stat-box"><h3>Summerlin</h3><p>Established west-side amenities &amp; villages</p></div>
                </div>
                <p style="margin-top:1.5rem;"><a href="/living-in-skye-summit">Living in Skye Summit</a> · <a href="/skye-summit-home-prices">Home prices</a> · <a href="/buy">Buy</a></p>
            </div>
        </section>`,
  },
  {
    slug: 'northwest-las-vegas-real-estate',
    title: 'Northwest Las Vegas Real Estate | Skye Summit & Centennial Hills',
    description:
      'Northwest Las Vegas real estate hub: Skye Summit, Centennial Hills, zip codes, schools, and buyer/seller resources with Dr. Jan Duffy, REALTOR®.',
    h1: 'Northwest Las Vegas Real Estate Guide',
    heroSubtitle:
      'Skye Summit, Centennial Hills, and the northwest growth corridor—one place to start your research.',
    quickAnswer:
      'Northwest Las Vegas real estate includes Skye Summit, Centennial Hills, and surrounding zip codes (e.g. 89149, 89144). Dr. Jan Duffy provides buyer and seller representation, valuations, and hyperlocal guides—office at 11411 Southern Highlands Pkwy #300, Las Vegas (702) 930-8222.',
    breadcrumbName: 'Northwest Las Vegas',
    faqs: [
      {
        q: 'What neighborhoods are in northwest Las Vegas?',
        a: 'Key areas include Skye Summit, Centennial Hills, parts of the northwest valley near US-95 and Ann Road, with access to Red Rock and Summerlin-adjacent services.',
      },
      {
        q: 'What zip codes cover northwest Las Vegas?',
        a: 'Common searches include 89149, 89144, and nearby codes. Use the <a href="/las-vegas-zip-code-map">Las Vegas zip code map</a> to explore by region.',
      },
      {
        q: 'Why invest in northwest Las Vegas housing?',
        a: 'Newer inventory, family demand, and proximity to employment and recreation drive interest. See <a href="/invest">investment overview</a> for rental and appreciation context.',
      },
      {
        q: 'Where is Dr. Jan Duffy’s office?',
        a: `<a href="/office-location">Office location map</a> — ${C.STREET}, ${C.CITY}, ${C.REGION} ${C.POSTAL}. Hours Sun–Sat 9 AM–6 PM per Google Business Profile.`,
      },
    ],
    extraSections: `
        <section class="why-section">
            <div class="container">
                <h2>Start your northwest search</h2>
                <div class="features-grid">
                    <div class="feature"><i class="fas fa-map-marked-alt"></i><h3><a href="/las-vegas-zip-code-map">Zip code map</a></h3><p>Search by zip and area.</p></div>
                    <div class="feature"><i class="fas fa-plane-arrival"></i><h3><a href="/relocate">Relocation</a></h3><p>Out-of-state buyer support.</p></div>
                    <div class="feature"><i class="fas fa-location-dot"></i><h3><a href="/office-location">Office &amp; directions</a></h3><p>GPS and Google Map.</p></div>
                </div>
            </div>
        </section>`,
  },
];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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

function faqJsonLd(faqs) {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q.replace(/<[^>]+>/g, ''),
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a.replace(/<[^>]+>/g, '').replace(/&mdash;/g, '—'),
        },
      })),
    },
    null,
    2
  );
}

function renderPage(guide) {
  const canonical = `${SITE}/${guide.slug}`;
  const ogImage = `${SITE}/images/skye-summit-community.jpg`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="google-site-verification" content="${GSC_TOKEN}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(guide.description)}">
    <meta name="keywords" content="Skye Summit, Las Vegas real estate, Centennial Hills, Dr. Jan Duffy, ${escapeHtml(guide.slug.replace(/-/g, ' '))}">
    <meta name="author" content="Dr. Jan Duffy, REALTOR®">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${escapeHtml(guide.title)}">
    <meta property="og:description" content="${escapeHtml(guide.description)}">
    <meta property="og:image" content="${ogImage}">
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${canonical}">
    <meta property="twitter:title" content="${escapeHtml(guide.title)}">
    <meta property="twitter:description" content="${escapeHtml(guide.description)}">
    <title>${escapeHtml(guide.title)}</title>
    <link rel="canonical" href="${canonical}">
    <link rel="preload" href="/styles.css" as="style">
    <link rel="preload" href="/script.js" as="script">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": ${JSON.stringify(guide.h1)},
      "description": ${JSON.stringify(guide.description)},
      "url": ${JSON.stringify(canonical)},
      "inLanguage": "en-US",
      "about": { "@type": "Place", "name": "Skye Summit, Las Vegas NV" },
      "author": {
        "@type": "RealEstateAgent",
        "name": "Dr. Jan Duffy",
        "telephone": "+1-702-930-8222",
        "worksFor": {
          "@type": "Organization",
          "name": "Berkshire Hathaway HomeServices Nevada Properties"
        }
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE}/" },
        { "@type": "ListItem", "position": 2, "name": "Guides", "item": "${SITE}/skye-summit-faq" },
        { "@type": "ListItem", "position": 3, "name": ${JSON.stringify(guide.breadcrumbName)}, "item": ${JSON.stringify(canonical)} }
      ]
    }
    </script>
    <script type="application/ld+json">
${faqJsonLd(guide.faqs)}
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "${SITE}/#localbusiness",
      "name": ${JSON.stringify(C.GBP_BUSINESS_NAME)},
      "telephone": ${JSON.stringify(C.PHONE_TEL)},
      "email": ${JSON.stringify(C.EMAIL)},
      "url": ${JSON.stringify(C.SITE)},
      "image": ${JSON.stringify(`${SITE}/images/agents/dr-jan-duffy.jpg`)},
      "address": {
        "@type": "PostalAddress",
        "streetAddress": ${JSON.stringify(C.STREET)},
        "addressLocality": ${JSON.stringify(C.CITY)},
        "addressRegion": ${JSON.stringify(C.REGION)},
        "postalCode": ${JSON.stringify(C.POSTAL)},
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": ${C.GEO_LAT},
        "longitude": ${C.GEO_LNG}
      },
      "areaServed": { "@type": "Place", "name": "Skye Summit and Centennial Hills, Las Vegas NV" }
    }
    </script>
</head>
<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <header class="header" role="banner">
        <nav class="nav" aria-label="Main navigation">
            <div class="nav-brand">
                <a href="/" class="nav-logo" aria-label="Skye Summit Homes — Home">
                    <span class="nav-logo-skye">Skye</span><span class="nav-logo-summit"> Summit</span>
                </a>
            </div>
            <ul class="nav-menu">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/community">Communities</a></li>
                <li><a href="/skye-summit-faq" class="${guide.slug === 'skye-summit-faq' ? 'active' : ''}">Guides</a></li>
                <li><a href="/homes-for-sale-skye-summit">Homes</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
            <button class="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
                <span class="hamburger"></span>
            </button>
        </nav>
    </header>

    <main id="main-content" role="main">
        <nav class="container" aria-label="Breadcrumb" style="padding-top:1rem;font-size:0.9rem;">
            <a href="/">Home</a> &rsaquo; <a href="/skye-summit-faq">Guides</a> &rsaquo; <span aria-current="page">${escapeHtml(guide.breadcrumbName)}</span>
        </nav>
        <section class="service-hero">
            <div class="container">
                <h1>${escapeHtml(guide.h1)}</h1>
                <p class="hero-subtitle">${escapeHtml(guide.heroSubtitle)}</p>
                <div class="hero-cta hero-cta-primary">
                    <a href="/homes-for-sale-skye-summit" class="btn btn-secondary btn-large">View listings</a>
                    <a href="/contact" class="btn btn-primary btn-large">Ask Dr. Jan</a>
                    <p class="hero-phone">Call <a href="tel:${C.PHONE_TEL}">${escapeHtml(C.PHONE_DISPLAY)}</a></p>
                </div>
            </div>
        </section>

        <section class="aeo-quick-answer" aria-labelledby="aeo-answer-${guide.slug}">
            <div class="container">
                <h2 id="aeo-answer-${guide.slug}" class="aeo-quick-answer__title">Quick answer</h2>
                <p class="aeo-quick-answer__text">${escapeHtml(guide.quickAnswer)}</p>
                <p class="aeo-quick-answer__meta">${escapeHtml(C.AGENT_NAME)}, ${escapeHtml(C.AGENT_TITLE)} · <a href="tel:${C.PHONE_TEL}">${escapeHtml(C.PHONE_DISPLAY)}</a> · <a href="${C.MAP_PAGE_PATH}">Office &amp; directions</a></p>
            </div>
        </section>

        <section class="faq-section">
            <div class="container">
                <h2>Common questions</h2>
                <div class="faq-container">${faqHtml(guide.faqs)}
                </div>
            </div>
        </section>
${guide.extraSections}

        <section class="cta-section">
            <div class="container">
                <h2>Personalized Skye Summit guidance</h2>
                <p>Get answers tied to your address, timeline, and budget—not generic web estimates.</p>
                <div class="cta-buttons">
                    <a href="/contact" class="btn btn-primary btn-large">Schedule consultation</a>
                    <a href="tel:+17029308222" class="btn btn-secondary btn-large">Call (702) 930-8222</a>
                </div>
                <p class="cta-note">Dr. Jan Duffy, REALTOR® · License S.0197614.LLC · Berkshire Hathaway HomeServices Nevada Properties</p>
                <p class="cta-note cta-note--guides" style="margin-top:0.75rem;">
                    ${guideCtaLinksHtml()}
                </p>
            </div>
        </section>
    </main>

    <footer class="footer" role="contentinfo">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Dr. Jan Duffy, REALTOR®</h3>
                    <p>Berkshire Hathaway HomeServices Nevada Properties</p>
                    <div class="contact-info">
                        <p><i class="fas fa-phone" aria-hidden="true"></i> <a href="tel:+17029308222">(702) 930-8222</a></p>
                        <p><i class="fas fa-envelope" aria-hidden="true"></i> <a href="mailto:DrJanSells@SkyeSummitHomes.com">DrJanSells@SkyeSummitHomes.com</a></p>
                        <p><i class="fas fa-map-marker-alt" aria-hidden="true"></i> <a href="https://maps.google.com/?q=11411+Southern+Highlands+Pkwy+%23300+Las+Vegas+NV+89141" target="_blank" rel="noopener">11411 Southern Highlands Pkwy #300<br>Las Vegas, NV 89141</a></p>
                    </div>
                </div>
                <div class="footer-section">
                    <h4>Guides</h4>
                    <ul>
${guideFooterListHtml()}
                        <li><a href="/office-location">Office location</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/homes-for-sale-skye-summit">Homes for sale</a></li>
                        <li><a href="/community">Community</a></li>
                        <li><a href="/las-vegas-zip-code-map">Zip code map</a></li>
                        <li><a href="/buy">Buy</a></li>
                        <li><a href="/sell">Sell</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Google Business Profile</h4>
                    <div class="gmb-info">
                        <p><i class="fas fa-star" aria-hidden="true"></i> <strong>4.9/5</strong> (127 reviews)</p>
                        <a href="https://share.google/yoVmGzrpTUtHrvsnL" target="_blank" rel="noopener" class="gmb-link"><i class="fab fa-google" aria-hidden="true"></i> View on Google</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Dr. Jan Duffy, REALTOR® S.0197614.LLC. All rights reserved.</p>
                <div class="footer-legal">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Use</a>
                    <a href="/mls-disclaimer">MLS Disclaimer</a>
                </div>
            </div>
        </div>
    </footer>
    <button id="back-to-top" class="back-to-top" aria-label="Back to top"><i class="fas fa-chevron-up"></i></button>
    <script src="/script.js"></script>
</body>
</html>
`;
}

let written = 0;
for (const guide of GUIDES) {
  const out = path.join(root, `${guide.slug}.html`);
  fs.writeFileSync(out, renderPage(guide));
  written += 1;
}

console.log(`generate-seo-guide-pages: wrote ${written} guide page(s)`);
