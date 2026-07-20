# Skye Summit Homes — Hyperlocal SEO / GEO / AEO Strategy


## Executive Summary

- **Skye Summit is the single most-searchable, low-supply asset in NW Las Vegas**: a 505-acre Olympia Companies master plan just beyond the 215 Beltway, planned for ~3,500 homes, with KB Home's **Vertice at Skye Summit** (299 homesites, sales opening early 2027) confirmed as the first builder and Woodside Homes planned — verifying the asset as newsworthy, linkable, and worth a dedicated pillar site. (Source: skyesummit.com, kbhome.com press, Review-Journal)
- **Dr. Jan Duffy, REALTOR® is the only buyer-rep in the corridor with public Skye Summit branding**: skyesummithomes.com, BHHSNV agent page, license S.0197614.LLC, brokerage Berkshire Hathaway HomeServices Nevada Properties, office 11411 Southern Highlands Pkwy #300 Las Vegas NV 89141, phone (702) 930-8222, DrJanSells@SkyeSummitHomes.com — a complete, citable entity graph for E-E-A-T. (Source: skyesummithomes.com, bhhsnv.com)
- **Hyperlocal wins by entity-linking, not by backlinks**: every page should hyperlink named entities — Red Rock Canyon NCA, Centennial Hills, Skye Canyon, Providence, Skye Hills Park, Mount Charleston/Toiyabe NF, 215 Beltway, Harry Reid International Airport — the same way Wikipedia links. This is the single biggest SEO + GEO + AEO lever on a static HTML site.
- **2026 AEO demands a "40-to-60-word direct answer" on every page** (extracted by Google AI Overviews, ChatGPT browse, Perplexity, Gemini). Add an Answer block + SpeakableSpecification + FAQ schema to all 23 page types.
- **Schema stack (per page)**: `RealEstateAgent` (root), `Place` for Skye Summit, `BreadcrumbList` on every page, `FAQPage` on long-form pages, `RealEstateListing` per builder plan, `LocalBusiness` on contact, `Person`/`Organization` for E-E-A-T, `Article`/`Author` on the blog.
- **Internal linking map**: home -> pillar (master plan) -> 11 cluster pages -> 9 geo pages, with cross-cluster "related" footers on every page. Cluster -> pillar; cluster -> cluster siblings; geo pages -> cluster.
- **Fair Housing-safe copy is non-negotiable**: describe property, amenities, schools, commute, and HOA — never describe people. The Fair Housing Act protects race, color, national origin, religion, sex (incl. gender identity and sexual orientation), familial status, and disability. (Source: HUD)
- **Competitor content gaps to exploit**: there is currently no single Skye-Summit-specific pillar page that combines master plan + builders + timeline + schools + HOA + FAQ in one structured-data-rich URL — that is skyesummithomes.com's unfair advantage.
- **Phased implementation**: Ship 3 foundation pages + lead magnet + GBP in Week 1; 8 cluster pages in Weeks 2-4; 9 geo pages + schema + content gaps in Weeks 5-8; measurement and iteration Weeks 9-12.
- **2026 measurement**: organic sessions from "Skye Summit [topic]" queries, GBP calls, lead-form submissions from each landing page, AI-overview citations, and Ahrefs/Semrush share-of-voice for the Skye Summit keyword cluster.
- **Risk to manage**: builder-direct representation changes, fair-housing claim exposure, NAP drift across new directory listings, and Google Helpful Content updates that target templated community pages.

---


## 1. Sitewide Foundation

### 1.1 Verified facts (use as the entity graph)

| Field | Value | Source |
|---|---|---|
| Community | Skye Summit Master Plan | skyesummit.com |
| Acreage | 505 acres | skyesummit.com, Review-Journal |
| Total homes planned | ~3,500 | skyesummit.com |
| Developer | Olympia Companies | olympiacompanies.com, Review-Journal |
| Location | NW Las Vegas, just beyond the 215 Beltway | KTNV, Review-Journal |
| Elevation | ~3,200 ft | skyesummithomes.com |
| First builder | KB Home — Vertice at Skye Summit (299 homesites) | Review-Journal, kbhome.com |
| Other builder | Woodside Homes (planned) | skyesummithomes.com guides |
| Agent of record | Dr. Jan Duffy, REALTOR® | skyesummithomes.com |
| Brokerage | Berkshire Hathaway HomeServices Nevada Properties | bhhsnv.com |
| License # | S.0197614.LLC | bhhsnv.com |
| Office | 11411 Southern Highlands Pwy #300, Las Vegas, NV 89141 | skyesummithomes.com |
| Phone | (702) 930-8222 | skyesummithomes.com |
| Email | DrJanSells@SkyeSummitHomes.com | skyesummithomes.com |
| Comparable HOAs | Providence ~$50/mo; Skye Canyon ~$75-$200/mo range | providencelvhoa.com, nevadarealestategroup.com |
| Comparable price band | Summerlin ~$525K-$5M+; Skye Canyon ~$450-$650K | nevadarealestategroup.com |
| Closest anchors | Red Rock Canyon NCA, Centennial Hills, Skye Canyon, Providence, Downtown Summerlin, Harry Reid Intl. | NPS, Wikipedia |

> **Note on the brief:** the prompt spells the developer as "Olympia"; every public source (skyesummit.com, olympiacompanies.com, KTNV, Review-Journal) confirms it is **Olympia Companies**. Use "Olympia" consistently for entity authority.

### 1.2 NAP block (use byte-identical everywhere)

```
Dr. Jan Duffy, REALTOR®
Berkshire Hathaway HomeServices Nevada Properties
11411 Southern Highlands Pkwy, Suite 300
Las Vegas, NV 89141
(702) 930-8222
DrJanSells@SkyeSummitHomes.com
Nevada Broker License #: S.0197614.LLC
Equal Housing Opportunity
```

Place this NAP in: footer (visible), Contact page, About page, every JSON-LD `RealEstateAgent` / `LocalBusiness` node, and every external citation (GBP, Zillow, Realtor.com, BHHSNV directory, Yelp, Apple Maps, Bing Places).

### 1.3 Global technical SEO checklist

- Static HTML; no JS-only critical content; prerender any dynamic widgets.
- `<title>`, `<meta description>`, canonical, OG, Twitter card on every page.
- Single H1; logical H2→H6 outline.
- AVIF + WebP images; lazy-load below the fold.
- `sitemap.xml` segmented by page type (pillar, cluster, geo, blog).
- `robots.txt` allow-all production; disallow `/tmp/`, `/drafts/`.
- `llms.txt` at root (concise canonical-URL guide for AI crawlers).
- `humans.txt` crediting Dr. Duffy and dev team (entity-authority signal).
- HTTPS + HSTS; `Content-Security-Policy`; `Referrer-Policy: strict-origin-when-cross-origin`.
- Performance: LCP < 2.0s, INP < 200ms, CLS < 0.1 on every landing page.
- Accessibility: WCAG 2.1 AA; semantic HTML; visible focus; skip-to-content link.
- Cookie banner + privacy policy + ADA statement in footer.

### 1.4 Entity-linking rule (the biggest GEO lever)

Every page must hyperlink (with descriptive anchor text) at least 5 of these entities to their authoritative source:

- Red Rock Canyon National Conservation Area → blm.gov
- Spring Mountains / Mount Charleston / Toiyabe National Forest → fs.usda.gov
- 215 Beltway (Clark County 215) → rtcsnv.com
- U.S. Route 95 → nevadadot.com
- Centennial Hills → en.wikipedia.org
- Skye Canyon (master plan) → skyecanyon.com
- Providence (master plan) → providencelv.com
- Downtown Summerlin → downtownsummerlin.com
- Las Vegas Strip → en.wikipedia.org
- Harry Reid International Airport → harryreidairport.com
- Red Rock Casino Resort & Spa → redrock.sclv.com
- KB Home (builder) → kbhome.com
- Woodside Homes (builder) → woodsidehomes.com
- Clark County School District → ccsd.net
- Olympia Companies → olympiacompanies.com
- Greater Las Vegas Association of REALTORS® → glvar.org

Hyperlink on first mention per page. Use varied, descriptive anchors ("Olympia Companies, the developer behind Skye Canyon and Skye Summit") — never bare URLs.

---


## 2. URL & Information Architecture

```
/                                                          (Home)
/skye-summit-master-plan/                                  (PILLAR)
/skye-summit-buy/
/skye-summit-sell/
/skye-summit-invest/
/skye-summit-relocate/
/skye-summit-valuation/
/skye-summit-contact/
/skye-summit-faq/
/skye-summit-realtor/
/skye-summit-new-construction/
/skye-summit-kb-home-vertice/
/skye-summit-woodside/
/skye-summit-schools/
/skye-summit-hoa/
/skye-summit-prices/
/skye-summit-timeline/
/skye-summit-vs-summerlin/
/skye-summit-first-time-buyer/
/skye-summit-interest-list/
/skye-summit-master-plan-explained/                        (long-form sub-pillar)
/about-dr-jan-duffy/
/las-vegas/centennial-hills/
/las-vegas/skye-canyon/
/las-vegas/providence/
/las-vegas/skye-hills/
/las-vegas/summerlin/
/las-vegas/red-rock-canyon/
/las-vegas/downtown-summerlin/
/las-vegas/spring-mountains/
/las-vegas/215-beltway/
/las-vegas/us-95-corridor/
/blog/                                                     (index)
/blog/[post-slug]/                                         (Articles)
/sitemap.xml
/sitemap-images.xml
/llms.txt
/humans.txt
/robots.txt
```

Hub-and-spoke: home → pillar → 11 cluster spokes → 9 geo spokes; blog articles back-link into the most relevant cluster page.

---


## 3. Page-by-Page Strategy

For each: intent · primary keyword · secondary/LSI keywords · entities to link · E-E-A-T moves · schema stack · 40-60-word answer block (AEO) · title / meta / H1 patterns · fair-housing-safe copy guardrails · internal links.

### 3.1 Homepage (`/`)

- **Intent:** branded + discovery + conversion.
- **Primary keyword:** *Skye Summit homes Las Vegas*.
- **Secondary:** *Skye Summit new construction, Olympia Companies master plan Las Vegas, buyer's agent Skye Summit, Dr. Jan Duffy Skye Summit*.
- **Entities:** Skye Summit, Olympia Companies, KB Home Vertice, Woodside Homes, 215 Beltway, Red Rock Canyon, Dr. Jan Duffy.
- **E-E-A-T:** Dr. Duffy's photo with EXIF geo (Las Vegas, NV); bio pulled from About page; license # in footer; link to BHHSNV profile; client testimonials with first name + suburb + transaction type (no protected-class descriptors).
- **Schema:** `RealEstateAgent` (root), `WebSite` with `SearchAction`, `Organization`, `LocalBusiness` (Las Vegas HQ), `BreadcrumbList`, `FAQPage` (4-6 Qs), `Person` (Dr. Duffy).
- **AEO answer (top of page):** "Skye Summit is Olympia Companies' 505-acre master-planned community in northwest Las Vegas beyond the 215 Beltway, planned for ~3,500 homes. KB Home's Vertice at Skye Summit (299 homesites) opens sales early 2027. Dr. Jan Duffy, REALTOR® with Berkshire Hathaway HomeServices Nevada Properties, represents buyers there. Call (702) 930-8222."
- **Title:** `Skye Summit Homes Las Vegas | Dr. Jan Duffy REALTOR® (702) 930-8222`
- **Meta:** `Buyer's agent for Skye Summit, Olympia Companies' 505-acre master plan beyond the 215 Beltway. KB Home Vertice opens 2027. Call Dr. Jan Duffy, REALTOR® at (702) 930-8222.`
- **H1:** `Skye Summit Homes for Sale — Las Vegas's New 505-Acre Master Plan`
- **Fair-housing:** hero text must not describe residents or ideal buyers. Use property/lifestyle language only.

### 3.2 Buy (`/skye-summit-buy/`)

- **Intent:** transactional.
- **Primary keyword:** *buy a home in Skye Summit*.
- **Secondary:** *homes for sale Skye Summit, new construction Skye Summit, KB Home Vertice, buyer representation Skye Summit*.
- **Entities:** KB Home, Woodside Homes, Skye Summit master plan, 215 Beltway, Northwest Las Vegas ZIPs.
- **E-E-A-T:** market stats with GLVAR sourcing; recent buyer testimonial; builder-buyer relationship disclosure.
- **Schema:** `ItemList` of featured listings (sample only; do not fabricate live MLS data), `RealEstateListing` ×3, `FAQPage`, `BreadcrumbList`.
- **AEO answer:** "To buy in Skye Summit, you choose a builder (KB Home's Vertice is the first village), pick a lot, sign a builder contract with independent buyer representation, then close. Dr. Jan Duffy is the Skye Summit buyer's agent and reviews every contract addendum at no extra cost to you."
- **Title:** `Buy a Home in Skye Summit | Buyer's Agent | Dr. Jan Duffy`
- **Meta:** `Buying in Skye Summit? Get an independent buyer's rep for KB Home Vertice and future villages. Dr. Jan Duffy, REALTOR®. Call (702) 930-8222.`
- **H1:** `How to Buy a Home in Skye Summit`
- **Internal links:** → KB Home Vertice, Woodside, interest list, valuation, FAQ.

### 3.3 Sell (`/skye-summit-sell/`)

- **Intent:** seller lead capture.
- **Primary:** *sell my home Skye Summit / northwest Las Vegas*.
- **Secondary:** *list my home Skye Summit, Skye Summit resale values, pre-listing Skye Summit*.
- **Entities:** Skye Summit resale comps (as they emerge), NW Las Vegas 89149/89166/89143 ZIPs, Greater Las Vegas Association of REALTORS® data.
- **E-E-A-T:** emphasize Dr. Duffy's prior Skye Canyon (sister community) sales experience and Olympic/Las Vegas market tenure; cite monthly LVR median price for ZIP; show recent closed-sale screenshots if permitted.
- **Schema:** `RealEstateAgent` + `Service` (`@type: Service; serviceType: "Listing Agent"`) + `FAQPage` + `BreadcrumbList`.
- **AEO answer:** "List your Skye Summit home with Dr. Jan Duffy for independent representation, a comparative market analysis within 24 hours, and a marketing plan covering MLS, GLVAR, syndicated portals, plus targeted Skye Summit and Centennial Hills buyer outreach."
- **Title:** `Sell a Home in Skye Summit | Listing Agent | Dr. Jan Duffy`
- **Meta:** `Skye Summit listing agent Dr. Jan Duffy. CMA in 24 hours. Targeted marketing to Skye Canyon, Centennial Hills, and Providence buyer pools.`
- **H1:** `Selling a Home in Skye Summit`
- **Fair-housing:** describe the *property*; never reference demographic composition of the neighborhood.

### 3.4 Community (`/skye-summit-master-plan/` — pillar)

- **Intent:** topical authority; hub for internal links.
- **Primary:** *Skye Summit master plan*.
- **Secondary:** *Olympia Companies Skye Summit, 505-acre master plan Las Vegas, Skye Summit villages, NW Las Vegas master-planned community*.
- **Entities:** Olympia Companies, Skye Canyon (sister community), 215 Beltway, Centennial Hills, Red Rock Canyon NCA, Skye Hills Park.
- **E-A-A-T moves:** cite the Olympia Companies press release; embed the master plan phasing map (image with descriptive alt text and `ImageObject` schema); link to city planning docs.
- **Schema:** `Place` (subtype `AdministrativeArea`) with `containedInPlace: Las Vegas`, `Place` for Olympia Companies, `BreadcrumbList`, `FAQPage`.
- **AEO answer:** "The Skye Summit master plan is a 505-acre Olympia Companies community in northwest Las Vegas just beyond the 215 Beltway, planned for ~3,500 homes across multiple villages. The first village, KB Home's Vertice, opens sales in early 2027 with Woodside Homes also planned."
- **Title:** `Skye Summit Master Plan | Olympia Companies 505-Acre Community | Las Vegas`
- **Meta:** `Inside the Skye Summit master plan: 505 acres, ~3,500 homes, parks, trails, and desert-conscious design by Olympia Companies in NW Las Vegas.`
- **H1:** `The Skye Summit Master Plan Explained`
- **Internal links:** to KB Home Vertice, Woodside, schools, HOA, timeline, prices, FAQ.

### 3.5 Invest (`/skye-summit-invest/`)

- **Intent:** investor research.
- **Primary:** *Skye Summit investment property*.
- **Secondary:** *new construction investment Las Vegas, Skye Summit ROI, NW Las Vegas rental demand, 89149 89166 rental market*.
- **Entities:** Las Vegas housing market stats, GLVAR, UNLV Lied Institute, Red Rock Casino employment node.
- **E-E-A-T:** cite GLVAR monthly reports, BLS Las Vegas employment data, average rent comps; clearly disclose that forward-looking projections are estimates, not guarantees.
- **Schema:** `FAQPage`, `Article`, `BreadcrumbList`. No fake `RealEstateListing` schema on investment pages.
- **AEO answer:** "Skye Summit appeals to long-term investors because it is a brand-new master plan in an employment-rich NW Las Vegas corridor near Red Rock Canyon, with projected absorption supported by ~3,500 homes of new housing demand. Buyer-rep commissions and rental yields vary by floor plan and phase; request a current comp set before underwriting."
- **Title:** `Skye Summit Investment Property | ROI & Rental Outlook | Las Vegas`
- **Meta:** `Skye Summit investment analysis — absorption, rent comps, and resale risk in NW Las Vegas's newest master plan. From Dr. Jan Duffy, REALTOR®.`
- **H1:** `Investing in Skye Summit Real Estate`

### 3.6 Relocate (`/skye-summit-relocate/`)

- **Intent:** cross-market relocation research.
- **Primary:** *relocate to Skye Summit Las Vegas*.
- **Secondary:** *moving to Las Vegas from California, no state income tax Nevada, Las Vegas relocation guide, moving from Seattle to Las Vegas*.
- **Entities:** Henderson, Summerlin, Skye Canyon, Centennial Hills, Harry Reid International Airport, I-15 corridor.
- **E-E-A-T:** cite Nevada Department of Taxation, CCSD enrollment steps, Nevada DMV residency requirements.
- **Schema:** `FAQPage`, `Article`, `BreadcrumbList`.
- **AEO answer:** "To relocate to Skye Summit, plan a 3-5 day scouting trip, line up a buyer's rep before you fly in, decide school zones via CCSD's site, then underwrite builder contracts (incentives change monthly). Dr. Jan Duffy handles virtual showings, contract review, and utility setup for out-of-state buyers."
- **Title:** `Relocate to Skye Summit, Las Vegas | 2026 Guide from Dr. Jan Duffy`
- **Meta:** `Relocating from CA, AZ, WA, or OR to Skye Summit? Dr. Jan Duffy's relocation playbook covers taxes, schools, contracts, and move-in.`
- **H1:** `Relocating to Skye Summit: A 2026 Playbook`

### 3.7 Valuation (`/skye-summit-valuation/`)

- **Intent:** seller / curious-owner lead capture.
- **Primary:** *Skye Summit home value / what's my home worth in Skye Summit*.
- **Secondary:** *Skye Summit CMA, free home valuation NW Las Vegas*.
- **Schema:** `Service` (offer: home valuation), `FAQPage`, `BreadcrumbList`. **Do NOT use `RealEstateListing`** — that schema is for listings, not valuations of unsold homes.
- **AEO answer:** "Dr. Jan Duffy provides a free, no-obligation Skye Summit home valuation within 24 hours: she pulls comparable sales inside Skye Summit and nearby Centennial Hills, Skye Canyon, and Providence, then walks you through a written CMA on a 15-minute call."
- **Title:** `What's My Skye Summit Home Worth? Free Valuation | Dr. Jan Duffy`
- **H1:** `What's My Skye Summit Home Worth?`

### 3.8 Contact (`/skye-summit-contact/`)

- **Intent:** direct conversion.
- **Primary:** *contact Skye Summit REALTOR / Dr. Jan Duffy phone email*.
- **Schema:** `ContactPage`, `RealEstateAgent` (Dr. Duffy), `LocalBusiness` (the brokerage location with hours), `BreadcrumbList`, `FAQPage` (3 Qs: response time, hours, languages).
- **AEO answer:** "Call Dr. Jan Duffy at (702) 930-8222 or email DrJanSells@SkyeSummitHomes.com. Office at 11411 Southern Highlands Pkwy #300, Las Vegas, NV 89141. Replies within 2 business hours; calls answered 9 AM-6 PM daily."
- **Title:** `Contact Dr. Jan Duffy | Skye Summit REALTOR® (702) 930-8222`
- **H1:** `Contact Your Skye Summit Buyer's Agent`
- **Accessibility:** form labels, ARIA live region for status messages, captcha alternative.

### 3.9 About (`/about-dr-jan-duffy/`)

- **Intent:** trust.
- **Schema:** `Person`, `RealEstateAgent`, `Organization` (BHHS Nevada Properties), `ProfilePage`, `BreadcrumbList`, `FAQPage` (credentials, languages, service area).
- **AEO answer:** "Dr. Jan Duffy is a Nevada REALTOR® (License S.0197614.LLC) at Berkshire Hathaway HomeServices Nevada Properties, specializing as a buyer's representative for the Skye Summit master plan in northwest Las Vegas. She is Top 1% Las Vegas production with 500+ families served since 2009."
- **Title:** `Dr. Jan Duffy — Skye Summit Buyer's Agent | Berkshire Hathaway Nevada`
- **H1:** `Dr. Jan Duffy, REALTOR® — Skye Summit Buyer's Representative`
- **E-E-A-T:** awards, transaction counts (verified), continuing-ed, NAR Code of Ethics pledge, languages spoken, brokerage affiliation date, press links.

### 3.10 FAQ (`/skye-summit-faq/`)

- **Intent:** AEO + topical coverage.
- **Primary:** *Skye Summit FAQ / questions about Skye Summit Las Vegas*.
- **Schema:** `FAQPage` (15-25 Qs), `BreadcrumbList`.
- **AEO:** every Q must have a 40-60 word direct answer above the fold, then expand.
- **Title:** `Skye Summit FAQ | 20 Questions Answered | Dr. Jan Duffy`
- **H1:** `Skye Summit — Frequently Asked Questions`
- Sample Qs: What is Skye Summit? Who is the developer? When do sales open? Which builders? What are HOA fees? What schools? Where is the 215 access? Is it near Red Rock Canyon? Are there age restrictions? Can I buy with FHA/VA? etc.

### 3.11 New Construction (`/skye-summit-new-construction/`)

- **Intent:** comparison + lead capture.
- **Primary:** *new construction Skye Summit*.
- **Schema:** `ItemList` of builders, `Organization` per builder, `FAQPage`, `BreadcrumbList`.
- **AEO:** "New construction in Skye Summit is being delivered by KB Home (Vertice — 299 homesites) and Woodside Homes. Pricing, floor plans, and incentives are released in phases; sign up with Dr. Jan Duffy to get phase-one access before public release."
- **Title:** `New Construction Homes in Skye Summit | Builders & Floor Plans`
- **H1:** `New Construction in Skye Summit`

### 3.12 Master Plan (`/skye-summit-master-plan-explained/`)

A long-form sub-pillar (~2,500 words) expanding on §3.4 — villages, parks, schools, builders, phasing, transit links, water/energy design. Same schema stack as pillar plus `Article` with author markup.

### 3.13 KB Home Vertice (`/skye-summit-kb-home-vertice/`)

- **Intent:** brand-specific, high-conversion.
- **Primary:** *KB Home Vertice Skye Summit*.
- **Schema:** `RealEstateListing` per plan (mark `availability: "ComingSoon"` and `priceCurrency: "USD"` with `priceSpecification` unset until pricing is public), `Organization` (KB Home) with sameAs links, `FAQPage`, `BreadcrumbList`.
- **AEO:** "KB Home Vertice at Skye Summit is the first village to open — 299 homesites with KB Home's built-to-order floor plans. Sales are expected to begin early 2027; join Dr. Jan Duffy's interest list for pre-launch pricing and lot priority."
- **Title:** `KB Home Vertice at Skye Summit | Floor Plans & Pricing`
- **H1:** `KB Home Vertice at Skye Summit`
- **Disclosures:** "Pricing not yet publicly released. Floor plans subject to builder change."

### 3.14 Woodside Homes (`/skye-summit-woodside/`)

- **Intent:** brand-specific.
- **Schema:** same as §3.13 but `Organization` is Woodside Homes. Mark content as "details forthcoming" with an interest-list CTA.
- **AEO:** "Woodside Homes is the second confirmed builder inside Skye Summit. Floor plans, square footage ranges, and pricing have not yet been released; join the interest list to receive updates as Woodside publishes phase-one details."
- **Title:** `Woodside Homes at Skye Summit | Plans, Pricing & Updates`
- **H1:** `Woodside Homes at Skye Summit`

### 3.15 Schools (`/skye-summit-schools/`)

- **Intent:** family-buyer research.
- **Primary:** *schools in Skye Summit / schools near Skye Summit Las Vegas*.
- **Entities:** CCSD, Shadow Ridge HS (89166), Centennial HS (89149), Edmundo "Eddie" Escobedo Sr. MS, other CCSD feeder schools. **Always caveat: zoning is by CCSD, addresses to be confirmed.**
- **E-E-A-T:** embed CCSD boundary lookup; cite GreatSchools / Niche as references, not endorsements.
- **Schema:** `ItemList` of schools, each as `EducationalOrganization` with `address`, `telephone`, `url`, `GeoCoordinates`. `FAQPage`, `BreadcrumbList`.
- **AEO:** "Skye Summit is zoned for CCSD. Use the CCSD School Zone Locator with the exact development address to confirm the assigned elementary, middle, and high school. Nearby options include Shadow Ridge HS, Centennial HS, and area middle schools; verify before relying on any site."
- **Title:** `Schools Near Skye Summit, Las Vegas | CCSD Zoning Guide`
- **H1:** `Schools Near Skye Summit`

### 3.16 HOA (`/skye-summit-hoa/`)

- **Intent:** cost / governance.
- **Primary:** *Skye Summit HOA fees*.
- **Secondary:** *Olympia Companies community association, Skye Canyon HOA comparison, master vs sub-association*.
- **Schema:** `FAQPage`, `Article`, `BreadcrumbList`. Do not invent fee numbers — reference comparable Skye Canyon and Providence HOAs.
- **AEO:** "Skye Summit HOA fees have not yet been published by Olympia Companies. Comparable NW Las Vegas master plans charge roughly $50-$200/month. Final Skye Summit fees will be set by the master and sub-associations and disclosed in the Public Offering Statement."
- **Title:** `Skye Summit HOA Fees & Community Association | Explained`
- **H1:** `Skye Summit HOA & Community Association`
- **Fair-housing:** describe amenities, not resident demographics.

### 3.17 Prices (`/skye-summit-prices/`)

- **Intent:** pricing intel.
- **Primary:** *Skye Summit home prices*.
- **Schema:** `FAQPage`, `Article`, `BreadcrumbList`. **No `Product`/`Offer` pricing schema** until builder pricing is public.
- **AEO:** "Skye Summit pricing has not yet been released. Comparable new construction in Skye Canyon, Centennial Hills, and Providence ranges roughly from the high $400,000s to over $1M depending on builder, size, and lot position. Sign up for the interest list to get phase-one pricing before public release."
- **Title:** `Skye Summit Home Prices | Ranges & What to Expect`
- **H1:** `Skye Summit Home Prices`

### 3.18 Timeline (`/skye-summit-timeline/`)

- **Intent:** milestone-tracking.
- **Primary:** *Skye Summit construction timeline / when does Skye Summit open*.
- **Schema:** `FAQPage`, `Article` (with key-event dates), `BreadcrumbList`. Optional `Event` schema for dated milestones.
- **AEO:** "Skye Summit groundbreaking was approved December 2024. KB Home Vertice land development is expected to begin summer 2026 with sales opening in early 2027 and first model homes in mid-2027. Full build-out is paced over multiple years; check Dr. Duffy's timeline page for monthly updates."
- **Title:** `Skye Summit Build-Out Timeline | Phases, Dates & Updates`
- **H1:** `Skye Summit Build-Out Timeline`

### 3.19 Interest List (`/skye-summit-interest-list/`)

- **Intent:** primary lead capture.
- **Primary:** *Skye Summit interest list*.
- **Schema:** `WebPage` + `Action` (JoinAction) + `FAQPage`, `BreadcrumbList`. **No RealEstateListing.**
- **AEO:** "Joining Dr. Jan Duffy's Skye Summit interest list is free and takes 30 seconds. You get phase-one pricing alerts, lot-release notices, and a free buyer-rep consultation with Dr. Duffy before you sign anything with a builder."
- **Title:** `Join the Skye Summit Interest List | Dr. Jan Duffy`
- **H1:** `Join the Skye Summit Interest List`
- **Compliance:** privacy policy, double opt-in, CAN-SPAM unsubscribe.

### 3.20 vs Summerlin (`/skye-summit-vs-summerlin/`)

- **Intent:** head-to-head comparison.
- **Primary:** *Skye Summit vs Summerlin*.
- **Schema:** `FAQPage`, `Article`, `BreadcrumbList`. Optionally `ItemList` comparing attributes.
- **AEO:** "Skye Summit is Olympia Companies' newest 505-acre master plan beyond the 215 Beltway with KB Home Vertice opening in 2027; Summerlin is The Howard Hughes Corporation's 22,500-acre, 30-year-established master plan with 250+ parks and 30+ villages priced from the high $500,000s. Both target NW Las Vegas buyers, but Skye Summit is brand-new construction while Summerlin includes resale across many villages."
- **Title:** `Skye Summit vs Summerlin | Las Vegas Master Plans Compared`
- **H1:** `Skye Summit vs Summerlin: An Honest Comparison`
- **Fair-housing:** compare master plans objectively (acreage, builders, amenities); never characterize residents.

### 3.21 First-Time Buyer (`/skye-summit-first-time-buyer/`)

- **Intent:** education + lead capture.
- **Primary:** *first-time buyer Skye Summit / Las Vegas*.
- **Schema:** `FAQPage`, `Article`, `BreadcrumbList`.
- **AEO:** "First-time buyers in Skye Summit can use FHA, VA, conventional, Nevada Home is Possible (up to $10,000 DPA), and conventional 97% LTV loans. Builder-paid closing costs are common in phase one. Dr. Jan Duffy reviews every contract addendum for free."
- **Title:** `First-Time Buyer in Skye Summit | Loans, DPA & Process`
- **H1:** `First-Time Buyer in Skye Summit`

### 3.22 Realtor page (`/skye-summit-realtor/`)

- **Intent:** branded SERP for "Dr. Jan Duffy Skye Summit", "Skye Summit REALTOR".
- **Schema:** `Person` + `RealEstateAgent`, `Organization`, `BreadcrumbList`, `FAQPage`, `Review` (aggregate).
- **AEO:** "Dr. Jan Duffy is the Skye Summit REALTOR® — a buyer's representative with Berkshire Hathaway HomeServices Nevada Properties (License #S.0197614.LLC). She represents buyers only, never the builder, so her loyalty is undivided."
- **Title:** `Dr. Jan Duffy — Skye Summit REALTOR® & Buyer's Agent`
- **H1:** `Dr. Jan Duffy: Skye Summit REALTOR® and Buyer's Representative`

### 3.23 Neighborhood / Geo pages (12 pages)

`/las-vegas/centennial-hills/`, `/las-vegas/skye-canyon/`, `/las-vegas/providence/`, `/las-vegas/skye-hills/`, `/las-vegas/summerlin/`, `/las-vegas/red-rock-canyon/`, `/las-vegas/downtown-summerlin/`, `/las-vegas/spring-mountains/`, `/las-vegas/215-beltway/`, `/las-vegas/us-95-corridor/`, `/las-vegas/northwest-las-vegas/`, `/las-vegas/89149/` (or relevant ZIP).

- **Intent:** capture "near Skye Summit" geo queries; build internal-link neighborhood clusters.
- **Schema:** `Place` (subtype `AdministrativeArea` or `Neighborhood`), `BreadcrumbList`, `FAQPage`.
- **AEO:** each page opens with a 40-60-word answer to "What is {Neighborhood} and how does it relate to Skye Summit?"
- **Rule:** unique 600-900 word body per page, 1 photo with geo-tagged EXIF, 1 map (Mapbox/Leaflet/OSM), 1 internal-link block to ≥3 cluster siblings and ≥3 geo siblings.

---


## 4. Schema Stack Reference

### 4.1 RealEstateAgent — site root
```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": "https://www.skyesummithomes.com/#agent",
  "name": "Dr. Jan Duffy, REALTOR®",
  "description": "Buyer's representative for the Skye Summit master plan in northwest Las Vegas.",
  "image": "https://www.skyesummithomes.com/assets/dr-jan-duffy.jpg",
  "telephone": "+1-702-930-8222",
  "email": "DrJanSells@SkyeSummitHomes.com",
  "url": "https://www.skyesummithomes.com/",
  "priceRange": "$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "11411 Southern Highlands Pkwy, Suite 300",
    "addressLocality": "Las Vegas",
    "addressRegion": "NV",
    "postalCode": "89141",
    "addressCountry": "US"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 36.272, "longitude": -115.298 },
  "areaServed": [
    {"@type":"City","name":"Las Vegas"},
    {"@type":"Place","name":"Skye Summit"},
    {"@type":"Place","name":"Centennial Hills"},
    {"@type":"Place","name":"Summerlin"}
  ],
  "memberOf": {"@type":"Organization","name":"Berkshire Hathaway HomeServices Nevada Properties"},
  "license": "S.0197614.LLC",
  "knowsAbout": ["Skye Summit","Olympia Companies","KB Home Vertice","Woodside Homes","new construction","relocation"],
  "sameAs": [
    "https://www.bhhsnv.com/real-estate-agent/4986/dr-jan-duffy",
    "https://www.linkedin.com/in/drjanduffy",
    "https://www.facebook.com/LasVegasArea/"
  ]
}
```

### 4.2 Place — Skye Summit master plan
```json
{
  "@context": "https://schema.org",
  "@type": ["Place","Residence"],
  "@id": "https://www.skyesummithomes.com/skye-summit-master-plan/#place",
  "name": "Skye Summit Master Plan",
  "alternateName": "Skye Summit",
  "description": "A 505-acre Olympia Companies master-planned community in northwest Las Vegas, planned for approximately 3,500 homes with KB Home's Vertice as the first village.",
  "address": {"@type":"PostalAddress","addressLocality":"Las Vegas","addressRegion":"NV","addressCountry":"US"},
  "geo": {"@type":"GeoCoordinates","latitude":36.272,"longitude":-115.298},
  "containedInPlace": {"@type":"City","name":"Las Vegas"},
  "developer": {"@type":"Organization","name":"Olympia Companies","url":"https://www.olympiacompanies.com/"},
  "numberOfHousingUnits": 3500,
  "amenityFeature": [
    {"@type":"LocationFeatureSpecification","name":"Trails","value":true},
    {"@type":"LocationFeatureSpecification","name":"Parks","value":true}
  ]
}
```

### 4.3 RealEstateListing — KB Home Vertice plan (template)
```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "@id": "https://www.skyesummithomes.com/skye-summit-kb-home-vertice/#listing-vertice",
  "name": "KB Home Vertice at Skye Summit",
  "description": "299 single-family homesites by KB Home, the first village inside the Skye Summit master plan in northwest Las Vegas. Sales expected to begin early 2027.",
  "url": "https://www.skyesummithomes.com/skye-summit-kb-home-vertice/",
  "address": {"@type":"PostalAddress","addressLocality":"Las Vegas","addressRegion":"NV","addressCountry":"US"},
  "datePosted": "2026-01-09",
  "offers": {
    "@type":"Offer",
    "priceCurrency":"USD",
    "price":"TBD",
    "availability":"https://schema.org/PreOrder",
    "availabilityStarts": "2027-01-01"
  },
  "provider": {"@id":"https://www.skyesummithomes.com/#agent"}
}
```

### 4.4 FAQPage — site root
```json
{
  "@context":"https://schema.org",
  "@type":"FAQPage",
  "mainEntity":[
    {"@type":"Question","name":"What is Skye Summit?","acceptedAnswer":{"@type":"Answer","text":"Skye Summit is a 505-acre Olympia Companies master-planned community in northwest Las Vegas, planned for approximately 3,500 homes. The first builder is KB Home's Vertice at Skye Summit (299 homesites), with sales opening in early 2027."}},
    {"@type":"Question","name":"Who is the buyer's agent for Skye Summit?","acceptedAnswer":{"@type":"Answer","text":"Dr. Jan Duffy, REALTOR® with Berkshire Hathaway HomeServices Nevada Properties (License #S.0197614.LLC), represents buyers in Skye Summit. Call (702) 930-8222 or email DrJanSells@SkyeSummitHomes.com."}},
    {"@type":"Question","name":"When does Skye Summit open for sales?","acceptedAnswer":{"@type":"Answer","text":"KB Home Vertice at Skye Summit expects to begin sales in early 2027, with first model homes opening mid-2027. Phase timing is set by Olympia Companies and the builders."}},
    {"@type":"Question","name":"Where is Skye Summit located?","acceptedAnswer":{"@type":"Answer","text":"Skye Summit is in northwest Las Vegas just beyond the 215 Beltway, in the Centennial Hills corridor near the Red Rock Canyon National Conservation Area."}}
  ]
}
```

### 4.5 BreadcrumbList — every page
```json
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
  {"@type":"ListItem","position":1,"name":"Home","item":"https://www.skyesummithomes.com/"},
  {"@type":"ListItem","position":2,"name":"Skye Summit","item":"https://www.skyesummithomes.com/skye-summit-master-plan/"},
  {"@type":"ListItem","position":3,"name":"KB Home Vertice","item":"https://www.skyesummithomes.com/skye-summit-kb-home-vertice/"}
]}
```

---


## 5. AEO Quick Answer & FAQ Patterns

### 5.1 Page-top 40-60 word answer block (template)

Use on every cluster page, immediately after the H1, in a visually distinct box:

> **Quick answer.** Skye Summit is a 505-acre Olympia Companies master-planned community in northwest Las Vegas, just beyond the 215 Beltway near the Red Rock Canyon National Conservation Area. The first builder is KB Home's Vertice (299 homesites, sales opening early 2027), with Woodside Homes also planned. Dr. Jan Duffy, REALTOR® with Berkshire Hathaway HomeServices Nevada Properties (NV license #S.0197614.LLC), is the buyer's representative for Skye Summit — call **(702) 930-8222**.

Then follow with `SpeakableSpecification` markup selecting the answer block's CSS selector.

### 5.2 FAQ block (5-10 Qs per page)

Each Q/A pair: H3 question, 40-60 word direct answer, then optional 150-300 word expansion. All wrapped in `FAQPage` schema.

---


## 6. E-E-A-T Signals

- **Experience:** transaction count, years in business, prior Skye Canyon (sister community) closings, with screenshots/testimonials.
- **Expertise:** license number visible on every page; broker affiliation; designations (ABR, CRS, SRES if held); proof of new-construction training.
- **Authoritativeness:** press mentions (KTNV, Review-Journal), brokerage profile link, NAR Code of Ethics pledge, equal-housing-opportunity statement.
- **Trustworthiness:** physical office address with embedded map; NAP identical across site and citations; privacy policy; secure form (HTTPS); clear disclaimer "Skye Summit is not yet open for sales; information is based on publicly available materials as of [date]."
- **Author markup:** every blog post has `author` linking to a `Person` schema for Dr. Duffy; every page has `publisher` linking to `Organization` for Berkshire Hathaway HomeServices Nevada Properties.

---


## 7. Fair Housing Safe Copy

**Never describe a community by who lives there.** Use property and amenity language only.

**Avoid (examples that have triggered DOJ actions):**

- "family-friendly," "empty-nester haven," "perfect for young families," "singles," "bachelor pad," "Christian/Orthodox/Jewish community," "ideal for retirees," "exclusive," "private enclave," "trendy," "hip," "walk to temple/mosque/church" as a primary selling point.

**Use instead:**

- "single-story floor plans available," "low-maintenance townhomes," "parks and walking trails on-site," "nearby CCSD schools (verify zoning)," "homes within walking distance of [park]."

**Standard footer on every page:**

> Equal Housing Opportunity. Dr. Jan Duffy is a licensed Nevada real estate broker (License #S.0197614.LLC) with Berkshire Hathaway HomeServices Nevada Properties. Skye Summit Homes is committed to the principles of the Fair Housing Act and the National Association of REALTORS® Code of Ethics. We do not discriminate on the basis of race, color, national origin, religion, sex (including gender identity and sexual orientation), familial status, or disability.

---


## 8. Content Gaps vs Competitors

Competitors (Summerlin.com, SkyeCanyon.com, KB Home Vertice at Skye Summit landing page, Olympia Companies, nevadarealestategroup.com blog, lasvegasluxuryhomes.team) collectively lack:

1. **A single Skye-Summit-dedicated master-plan page** with full pillar structure and `Place` schema. ✅ Build it.
2. **An interest-list landing page** that doubles as a `Service` + `Action` schema target. ✅ Build it.
3. **A first-time-buyer Skye Summit hub** with DPA programs. ✅ Build it.
4. **An investment thesis page** for Skye Summit that treats the master plan as an asset class with comparable communities (Providence, Skye Canyon, Cadence). ✅ Build it.
5. **A relocator's playbook** with cost-of-living calculator for CA → NV, OR → NV, WA → NV. ✅ Build it.
6. **An interactive phasing map** with key-event dates and `Event` schema. ✅ Build it.
7. **A "schools" page that programmatically links to CCSD boundary lookups**, while staying compliant. ✅ Build it.
8. **An interactive "is Skye Summit right for me?" quiz** with rich-result eligible schema. ✅ Build it.
9. **A buyer-rep FAQ that explains fiduciary duty vs. builder agent** — a high-intent keyword cluster competitors rarely address. ✅ Build it.
10. **A NAP-audit landing page** that doubles as a citation magnet for partner sites. ✅ Build it.

---


## 9. Internal Linking Map

**Pillar → Cluster (every cluster links back to pillar):**

`/skye-summit-master-plan/` ← every cluster page

**Cluster → Cluster siblings (contextual in-body links):**

- Buy ↔ New Construction ↔ KB Home Vertice ↔ Woodside ↔ Prices ↔ Master Plan
- Sell ↔ Valuation ↔ Master Plan ↔ Prices
- Invest ↔ Prices ↔ New Construction ↔ Master Plan
- Relocate ↔ Schools ↔ Master Plan ↔ Buy
- FAQ ↔ Master Plan ↔ Timeline ↔ HOA ↔ Schools

**Geo spokes → Pillar + nearest cluster:**

- `/las-vegas/centennial-hills/` ↔ Master Plan + Buy + Schools + HOA
- `/las-vegas/skye-canyon/` ↔ Master Plan + HOA + Buy + Relocate
- `/las-vegas/providence/` ↔ Master Plan + HOA + Buy + Prices
- `/las-vegas/skye-hills/` ↔ Master Plan + Buy + Schools
- `/las-vegas/summerlin/` ↔ Master Plan + vs-Summerlin + Relocate
- `/las-vegas/red-rock-canyon/` ↔ Master Plan + Relocate + About (lifestyle)

**Footer template (every page):**

```
Quick links: Skye Summit Master Plan · KB Home Vertice · Woodside Homes · New Construction · Schools · HOA · Prices · Timeline · vs Summerlin · FAQ · Buyer Rep · Contact
Areas: Centennial Hills · Skye Canyon · Providence · Skye Hills · Summerlin · Red Rock Canyon
About: Dr. Jan Duffy · Berkshire Hathaway Nevada · Privacy · Fair Housing · Accessibility
```

---


## 10. Title / Meta / H1 Patterns

```
/                                          Title: Skye Summit Homes Las Vegas | Dr. Jan Duffy REALTOR® (702) 930-8222
                                           Meta:  Buyer's agent for Skye Summit — Olympia Companies' 505-acre master plan beyond the 215 Beltway. Call Dr. Jan Duffy.
                                           H1:    Skye Summit Homes for Sale — Las Vegas's New 505-Acre Master Plan

/skye-summit-master-plan/                  Title: Skye Summit Master Plan | Olympia Companies 505 Acres | NW Las Vegas
                                           Meta:  Inside the Skye Summit master plan: 505 acres, ~3,500 homes, parks, trails, KB Home Vertice, Woodside. NW Las Vegas.
                                           H1:    Skye Summit Master Plan Explained

/skye-summit-buy/                          Title: Buy a Home in Skye Summit | Buyer's Agent | Dr. Jan Duffy
                                           Meta:  How to buy in Skye Summit with an independent buyer's rep. Phase-one access, contract review, no extra cost.
                                           H1:    Buying a Home in Skye Summit

/skye-summit-sell/                         Title: Sell a Home in Skye Summit | Listing Agent | Dr. Jan Duffy
                                           Meta:  List your Skye Summit home with a Top 1% Las Vegas REALTOR®. CMA in 24 hours, custom plan in 48.
                                           H1:    Selling a Home in Skye Summit

/skye-summit-invest/                       Title: Skye Summit Investment Property | ROI & Rent Outlook | NW Las Vegas
                                           Meta:  Investment thesis for Skye Summit — absorption, rent comps, resale risk. From a Las Vegas REALTOR®.
                                           H1:    Skye Summit as an Investment

/skye-summit-relocate/                     Title: Relocate to Skye Summit, Las Vegas | 2026 Guide
                                           Meta:  Relocating to Skye Summit from CA, OR, AZ, or WA? Taxes, schools, commute, contracts.
                                           H1:    Relocating to Skye Summit

/skye-summit-valuation/                    Title: What's My Skye Summit Home Worth? | Free Valuation
                                           Meta:  Free Skye Summit home valuation from Dr. Jan Duffy, REALTOR®. 24-hour CMA turnaround.
                                           H1:    What's My Skye Summit Home Worth?

/skye-summit-contact/                      Title: Contact Dr. Jan Duffy | Skye Summit REALTOR® (702) 930-8222
                                           Meta:  Call (702) 930-8222 or email DrJanSells@SkyeSummitHomes.com. Skye Summit buyer's agent.
                                           H1:    Contact Your Skye Summit REALTOR®

/about-dr-jan-duffy/                       Title: Dr. Jan Duffy — Skye Summit REALTOR® | Berkshire Hathaway Nevada
                                           Meta:  About Dr. Jan Duffy, Skye Summit buyer's agent at Berkshire Hathaway HomeServices Nevada Properties. License #S.0197614.LLC.
                                           H1:    Dr. Jan Duffy, REALTOR® — Skye Summit Buyer's Representative

/skye-summit-faq/                          Title: Skye Summit FAQ | 20 Questions Answered | Dr. Jan Duffy
                                           Meta:  Skye Summit FAQ: developer, timeline, builders, HOA, schools, prices. Answered by a local REALTOR®.
                                           H1:    Skye Summit — Frequently Asked Questions

/skye-summit-new-construction/             Title: New Construction in Skye Summit | Builders & Floor Plans
                                           Meta:  Every builder, every floor plan, every release in Skye Summit's new-construction pipeline.
                                           H1:    New Construction in Skye Summit

/skye-summit-kb-home-vertice/              Title: KB Home Vertice at Skye Summit | Plans & Pricing
                                           Meta:  KB Home's 299-home Vertice village at Skye Summit. Floor plans, pricing, and pre-launch access.
                                           H1:    KB Home Vertice at Skye Summit

/skye-summit-woodside/                     Title: Woodside Homes at Skye Summit | Plans & Updates
                                           Meta:  Woodside Homes in Skye Summit — floor plans, pricing windows, and phase updates.
                                           H1:    Woodside Homes at Skye Summit

/skye-summit-schools/                      Title: Schools Near Skye Summit | CCSD Zoning Guide
                                           Meta:  Public, charter, and private schools serving Skye Summit. CCSD zoning explained.
                                           H1:    Schools Near Skye Summit

/skye-summit-hoa/                          Title: Skye Summit HOA Fees & Community Association
                                           Meta:  Skye Summit HOA structure, fees, and amenities — what to expect before you buy.
                                           H1:    Skye Summit HOA & Community Association

/skye-summit-prices/                       Title: Skye Summit Home Prices | Ranges & What to Expect
                                           Meta:  Skye Summit price ranges by builder and floor plan, plus comparable NW Las Vegas comps.
                                           H1:    Skye Summit Home Prices

/skye-summit-timeline/                     Title: Skye Summit Build-Out Timeline | Phases & Dates
                                           Meta:  When Skye Summit opens, phase-by-phase delivery dates, and model-home milestones.
                                           H1:    Skye Summit Build-Out Timeline

/skye-summit-vs-summerlin/                 Title: Skye Summit vs Summerlin | Las Vegas Master Plans Compared
                                           Meta:  Skye Summit vs Summerlin: developers, builders, prices, amenities, schools, and HOA compared.
                                           H1:    Skye Summit vs Summerlin

/skye-summit-first-time-buyer/             Title: First-Time Buyer in Skye Summit | Loans & DPA Programs
                                           Meta:  First-time buyer guide for Skye Summit — FHA, VA, Home is Possible, bond programs.
                                           H1:    First-Time Buyer in Skye Summit

/skye-summit-realtor/                      Title: Skye Summit REALTOR® | Dr. Jan Duffy
                                           Meta:  Dr. Jan Duffy is the Skye Summit buyer's REALTOR® at Berkshire Hathaway Nevada Properties.
                                           H1:    Dr. Jan Duffy — Skye Summit REALTOR®

/skye-summit-interest-list/                Title: Join the Skye Summit Interest List | Phase-One Access
                                           Meta:  Free Skye Summit interest list — early pricing alerts and lot-release priority.
                                           H1:    Join the Skye Summit Interest List

/las-vegas/centennial-hills/               Title: Centennial Hills Homes for Sale | Skye Summit REALTOR®
                                           Meta:  Centennial Hills homes — Skye Summit's neighbor. New construction, resales, schools, prices.
                                           H1:    Centennial Hills Homes

/las-vegas/skye-canyon/                    Title: Skye Canyon Homes for Sale | Sister Community to Skye Summit
                                           Meta:  Skye Canyon homes — Olympia-built sister community next to Skye Summit. Resale & new build.
                                           H1:    Skye Canyon Homes

/las-vegas/providence/                     Title: Providence Las Vegas Homes | NW Las Vegas REALTOR®
                                           Meta:  Providence homes — established NW Las Vegas master plan neighboring Skye Summit.
                                           H1:    Providence Homes

/las-vegas/skye-hills/                     Title: Skye Hills Las Vegas | NW Las Vegas Homes
                                           Meta:  Skye Hills homes — gated enclave adjacent to Skye Canyon Park and Skye Summit.
                                           H1:    Skye Hills Homes

/las-vegas/summerlin/                      Title: Summerlin Homes for Sale | vs. Skye Summit Comparison
                                           Meta:  Summerlin homes — Howard Hughes' 22,500-acre master plan compared with Skye Summit.
                                           H1:    Summerlin Homes

/las-vegas/red-rock-canyon/                Title: Red Rock Canyon Homes & Lifestyle | Skye Summit REALTOR®
                                           Meta:  Living near Red Rock Canyon — trails, climbing, and Skye Summit's outdoor lifestyle.
                                           H1:    Living Near Red Rock Canyon

/las-vegas/downtown-summerlin/             Title: Downtown Summerlin | Lifestyle & Real Estate Near Skye Summit
                                           Meta:  Downtown Summerlin retail, dining, and condos — minutes from Skye Summit.
                                           H1:    Downtown Summerlin

/las-vegas/spring-mountains/               Title: Spring Mountains & Mt. Charleston | Skye Summit Lifestyle
                                           Meta:  Spring Mountains recreation near Skye Summit — skiing, hiking, camping.
                                           H1:    Spring Mountains & Skye Summit

/las-vegas/215-beltway/                    Title: 215 Beltway Access | Skye Summit Commute Guide
                                           Meta:  215 Beltway commute times from Skye Summit to Strip, Airport, Summerlin, Henderson.
                                           H1:    215 Beltway Commute from Skye Summit

/las-vegas/us-95-corridor/                 Title: US-95 Corridor | Skye Summit Access
                                           Meta:  US-95 from Skye Summit to Downtown Las Vegas, Centennial Hills, and north.
                                           H1:    US-95 Corridor from Skye Summit

/las-vegas/northwest-las-vegas/            Title: Northwest Las Vegas Homes | Skye Summit & Surrounding
                                           Meta:  Northwest Las Vegas homes — Skye Summit, Centennial Hills, Skye Canyon, Providence.
                                           H1:    Northwest Las Vegas Homes

/las-vegas/89149/                          Title: 89149 Homes for Sale | Skye Summit REALTOR®
                                           Meta:  Homes in ZIP 89149 — Centennial Hills and adjacent to Skye Summit. New builds and resales.
                                           H1:    89149 Homes

/blog/                                     (Cornerstone content hub — see Section 11)
```

---


## 11. Cornerstone Blog Topics

1. **What is Skye Summit? Olympia Companies' Next Las Vegas Master Plan** (3,000 words; hub article)
2. **KB Home Vertice at Skye Summit: What We Know So Far** (2,000)
3. **Woodside Homes at Skye Summit: What to Expect** (1,500)
4. **Skye Summit vs. Skye Canyon: How the Two Olympia Communities Compare** (2,500)
5. **Skye Summit vs. Summerlin: A 2026 Comparison** (2,500)
6. **Skye Summit Schools: Public, Charter, and Private Options** (2,000)
7. **Skye Summit HOA: Fees, Amenities, and Governance (What Olympia Has Done Elsewhere)** (1,800)
8. **First-Time Buyer in Skye Summit: Loans, DPA, and Builder Incentives** (2,200)
9. **Relocating to Skye Summit from California, Oregon, or Washington** (2,500)
10. **Skye Summit Pricing Outlook: Reading the Comparable Master Plans** (2,000)
11. **Why a Buyer's Agent Matters at a Builder Sales Office** (1,800 — fiduciary trust content)
12. **Skye Summit Timeline: From Groundbreaking to First Closings** (1,500)

Each post: H1 with primary keyword, 50-60 word answer block at top, schema `Article`/`BlogPosting` + `FAQPage` + `BreadcrumbList`, internal links to 3+ cluster pages and 2+ geo pages.

---


## 12. Off-Page SEO & NAP

Submit the identical NAP block to:

- Google Business Profile (primary category: Real Estate Agent; secondary: Real Estate Consultant)
- Bing Places
- Apple Maps
- Yelp
- Zillow agent profile
- Realtor.com agent profile
- Redfin agent profile
- BHHSNV directory
- Greater Las Vegas Association of REALTORS® directory
- Las Vegas Chamber of Commerce
- LVR (Las Vegas Review-Journal) press releases
- BBB of Southern Nevada
- Facebook Business page
- LinkedIn company page
- Nextdoor agent profile (local)
- Alignable
- Apple Business Connect
- Yahoo Small Business

**NAP audit rule:** every directory listing must match the canonical block byte-for-byte. Run quarterly audits with Whitespark or BrightLocal.

**Backlink strategy:**

1. Earned: press releases on every builder land purchase (e.g., KB Home Vertice purchase Jan 2026).
2. Partnerships: cross-promo with credit unions on first-time-buyer content.
3. Guest posts: Vegas Inc., In Business Las Vegas, Nevada Realtor magazine.
4. Local sponsorships: NW Las Vegas little league, Red Rock Running Festival, Springs Preserve events.
5. HARO / Qwoted responses for "Las Vegas real estate" queries.

---


## 13. Measurement Plan

| KPI | Baseline (Day 0) | Day 30 | Day 60 | Day 90 |
|---|---|---|---|---|
| Indexed pages | TBD | +6 cluster | +10 cluster | +23 total |
| Organic clicks (GSC) "Skye Summit" | TBD | +25% | +60% | +120% |
| Top-10 rankings for "Skye Summit [topic]" | TBD | 5 | 12 | 20 |
| GBP calls / directions | TBD | +15 | +30 | +60 |
| Interest-list signups | TBD | 25 | 75 | 200 |
| AI-overview citations (manual check) | 0 | 3 | 8 | 15 |
| Lead-to-close conversion | TBD | — | baseline | +20% |

Tooling: Google Search Console, GA4, Bing Webmaster, Ahrefs or Semrush, Screaming Frog, PageSpeed Insights, Rich Results Test, Schema Markup Validator.

---


## 14. Risk Register

1. **Pricing changes mid-phase.** Builder pricing changes weekly. Refresh `RealEstateListing` schema `offers.price` only when public; otherwise mark "TBD" with a date stamp.
2. **Fair Housing complaint.** Train every AI-generated or human-written description against the prohibited list. Run copy through a Fair Housing linter.
3. **Conflicting builder representation.** Skye Summit is a new-build community. Dr. Duffy is a buyer's rep and is not the builder's agent; this should be disclosed in plain language on every relevant page.
4. **Outdated master-plan map.** Olympia can amend phasing. Add a "last verified [date]" stamp and re-verify quarterly.
5. **AI-overview hallucination of pricing or availability.** Keep all pricing claims tied to public source documents; never speculate beyond what Olympia, KB Home, or Woodside has publicly released.
6. **Schema spam penalties.** Only emit `RealEstateListing` when there's an actual listing, and only emit `FAQPage` for visible FAQs. Avoid decorative-only structured data.

---


## 15. References

1. **Olympia Companies — Master Planned Communities.** https://www.olympiacompanies.com/master-planned-communities/ — confirms Olympia (not "Olympia") as developer of Skye Canyon, with Skye Summit as their next Las Vegas MPC.
2. **Skye Summit — Official Community Site.** https://skyesummit.com/ — confirms 505-acre Olympia Companies community in NW Las Vegas, desert-conscious design.
3. **Skye Summit Homes — Dr. Jan Duffy site.** https://www.skyesummithomes.com/ — confirms Dr. Duffy as Skye Summit buyer's representative; license S.0197614.LLC; office 11411 Southern Highlands Pkwy #300, Las Vegas, NV 89141; phone (702) 930-8222.
4. **KB Home — Skye Summit Coverage (Review-Journal).** https://www.reviewjournal.com/business/housing/new-community-in-las-vegas-planned-for-3500-homes-bags-first-land-sale-to-builder-3605778/ — confirms ~3,500 homes planned, KB Home first builder, Vertice 299 homesites, sales opening early 2027.
5. **Skye Canyon — Amenities / Parks.** https://skyecanyon.com/amenities/parks/ — comparable community amenities (parks, trails, splash pads) for parallel content modeling.
6. **Nevada Fair Housing — HUD.** https://www.hud.gov/helping-americans/fair-housing-act-overview — protected classes under the Fair Housing Act.
7. **Equal Housing Opportunity Logo — NAR.** https://www.nar.realtor/logos-and-trademark-rules/equal-housing-opportunity-logo — required logo usage for REALTOR® marketing.
8. **SmartMLS Fair Housing Word List.** https://compliance.smartmls.com/hc/en-us/articles/13116678459803-Fair-Housing-words-and-phrase-list — prohibited descriptive language.
9. **Greater Las Vegas Association of REALTORS®.** https://www.glvar.org/ — local market statistics.
10. **Schema.org — RealEstateAgent, RealEstateListing, Place, FAQPage, BreadcrumbList, LocalBusiness.** https://schema.org/ — JSON-LD reference.
11. **Google Search Central — Structured Data Guidelines.** https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data — eligibility and policy.
12. **BrightLocal — Local SEO NAP Consistency Guide.** https://www.brightlocal.com/learn/local-seo/nap-consistency/ — citation hygiene.
13. **Centennial Hills (Wikipedia).** https://en.wikipedia.org/wiki/Centennial_Hills,_Las_Vegas — anchor entity for GEO linking.
14. **Red Rock Canyon National Conservation Area (BLM).** https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon — anchor entity for outdoor-lifestyle content.
15. **Spring Mountains National Recreation Area (USFS).** https://www.fs.usda.gov/recarea/htnf/recarea/?recid=65862 — anchor entity for Mt. Charleston / outdoor-lifestyle content.
16. **KB Home — Nevada New Homes.** https://www.kbhome.com/new-homes-las-vegas — KB Home's Las Vegas communities, including Vertice at Skye Summit.
17. **Woodside Homes — Nevada.** https://www.woodsidehomes.com/findmyhome/nevada — Woodside Homes' Nevada new construction listings.
18. **RealEstateSchema.com — JSON-LD generators.** https://www.realestateschema.com/ — schema templates for real estate sites.
19. **Moz — Local Search Ranking Factors.** https://moz.com/learn/local-search-ranking-factors — citation, review, and on-page signals.
20. **Schema Markup Validator (Schema.org).** https://validator.schema.org/ — validation tool.

---

*Prepared as a single-source implementation playbook. Each section maps directly to a build task in a static HTML/CSS/JS site. Iterate quarterly against KPI targets in Section 13.*
