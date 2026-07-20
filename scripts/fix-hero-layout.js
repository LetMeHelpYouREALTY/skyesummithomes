#!/usr/bin/env node
/**
 * Fixes overcrowded homepage hero for desktop + mobile:
 * brand + portrait + one headline + one line + CTAs in first viewport.
 * Moves service cards / secondary links / stats below the hero.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const cssPath = path.join(root, 'styles.css');

let html = fs.readFileSync(indexPath, 'utf8');

const leanHeroInner = `            <div class="hero-content">
                <!-- HERO_AGENT_PORTRAIT_BEGIN -->
                <figure class="hero-agent">
                    <img class="hero-agent__img" src="/images/brand/dr-jan-hero-portrait.png" alt="Dr. Jan Duffy, REALTOR® — Skye Summit Homes Buyer's Representative, Las Vegas, NV" width="120" height="120" decoding="async" loading="eager" fetchpriority="high">
                    <figcaption class="hero-agent__caption">Dr. Jan Duffy, REALTOR®</figcaption>
                </figure>
                <!-- HERO_AGENT_PORTRAIT_END -->
                <p class="hero-brand">Skye Summit Homes</p>
                <p class="hero-kicker"><i class="fas fa-mountain" aria-hidden="true"></i> Master Plan · Fall 2027 · Northwest Las Vegas</p>
                <h1 id="hero-title"><span class="hero-title-main">Skye Summit Homes</span> <span class="hero-title-sub">Buyer representation for the master plan</span></h1>
                <p class="hero-subtitle">Dr. Jan Duffy, REALTOR<sup>&reg;</sup> — early access, builder coordination, and new-construction guidance near Red Rock Canyon.</p>
                <div class="hero-cta hero-cta-primary">
                    <a href="/contact" class="btn btn-primary btn-large">Book a free appointment</a>
                    <a href="tel:+17029308222" class="btn btn-secondary btn-large">Call (702) 930-8222</a>
                </div>
            </div>`;

const servicesBelow = `
        <section class="home-quick-links" aria-labelledby="home-quick-links-title">
            <div class="container">
                <h2 id="home-quick-links-title" class="home-quick-links__title">How can I help?</h2>
                <p class="home-quick-links__lead">Choose a path — or browse homes below.</p>
                <div class="hero-service-links">
                    <a href="/buy" class="service-card">
                        <i class="fas fa-key" aria-hidden="true"></i>
                        <h3 class="service-card-title">Buying in Skye Summit?</h3>
                        <p>Find the right home at the right price</p>
                    </a>
                    <a href="/sell" class="service-card">
                        <i class="fas fa-home" aria-hidden="true"></i>
                        <h3 class="service-card-title">Selling Your Home?</h3>
                        <p>Expert pricing and marketing</p>
                    </a>
                    <a href="/valuation" class="service-card">
                        <i class="fas fa-calculator" aria-hidden="true"></i>
                        <h3 class="service-card-title">Free valuation</h3>
                        <p>Professional estimate in 24 hours</p>
                    </a>
                    <a href="/las-vegas-zip-code-map" class="service-card service-card--map">
                        <i class="fas fa-map-marked-alt" aria-hidden="true"></i>
                        <h3 class="service-card-title">Las Vegas zip map</h3>
                        <p>Search by zip and neighborhood</p>
                    </a>
                    <a href="/skye-summit-realtor" class="service-card">
                        <i class="fas fa-user-tie" aria-hidden="true"></i>
                        <h3 class="service-card-title">Skye Summit REALTOR®</h3>
                        <p>Buyer and seller services with Dr. Jan</p>
                    </a>
                </div>
                <div class="hero-service-links-secondary">
                    <a href="/invest" class="service-card-small">
                        <i class="fas fa-chart-line" aria-hidden="true"></i>
                        <span>Investment</span>
                    </a>
                    <a href="/relocate" class="service-card-small">
                        <i class="fas fa-plane" aria-hidden="true"></i>
                        <span>Relocation</span>
                    </a>
                    <a href="#realscout-listings" class="service-card-small">
                        <i class="fas fa-images" aria-hidden="true"></i>
                        <span>Browse homes</span>
                    </a>
                </div>
                <div class="hero-stats" role="list">
                    <div class="stat" role="listitem">
                        <span class="stat-number">15+</span>
                        <span class="stat-label">Years experience</span>
                    </div>
                    <div class="stat" role="listitem">
                        <span class="stat-number">Fall 2027</span>
                        <span class="stat-label">Master plan launch</span>
                    </div>
                    <div class="stat stat--license" role="listitem">
                        <span class="stat-number">S.0197614.LLC</span>
                        <span class="stat-label">Nevada license</span>
                    </div>
                </div>
            </div>
        </section>
`;

// Replace hero-content block inside #home
const homeSectionRe =
  /(<section id="home"[^>]*>[\s\S]*?<!-- PAGE_HERO_MEDIA_END -->)\s*<div class="hero-content">[\s\S]*?<\/div>\s*(<\/section>)/i;

if (!homeSectionRe.test(html)) {
  console.error('fix-hero-layout: could not find homepage hero content block');
  process.exit(1);
}

html = html.replace(homeSectionRe, `$1\n${leanHeroInner}\n        $2`);

// Remove prior quick-links section if re-running
html = html.replace(
  /\s*<section class="home-quick-links"[\s\S]*?<\/section>\s*/i,
  '\n'
);

// Insert services section after home hero
html = html.replace(
  /(<\/section>\s*)(<!-- REALSCOUT_WIDGET_BEGIN -->|<section id="realscout)/i,
  `$1${servicesBelow}\n        $2`
);

fs.writeFileSync(indexPath, html);

const layoutCss = `
/* HERO_LAYOUT_FIX */
/* Constrain photo heroes to site width — not ultra-wide edge-to-edge */
.hero.hero--photo,
.service-hero.hero--photo,
.loc-hero.hero--photo,
.zip-map-hero.hero--photo,
.search-hub-hero.hero--photo{
  width:100%;
  max-width:1120px;
  margin-left:auto;
  margin-right:auto;
  box-sizing:border-box;
}
.hero.hero--home.hero--photo{
  min-height:min(70vh,560px);
  display:flex;
  align-items:center;
  justify-content:center;
  padding:5.75rem 1.5rem 2.5rem;
  margin-top:80px;
  overflow:hidden;
  border-radius:0 0 12px 12px;
}
.hero.hero--home .hero-content{
  max-width:36rem;
  width:100%;
  margin:0 auto;
  padding:1rem .75rem 1.25rem;
  text-align:center;
  z-index:2;
}
.hero-brand{
  font-size:clamp(1.6rem,4.5vw,2.4rem);
  font-weight:800;
  letter-spacing:-.02em;
  color:#fff;
  margin:0 0 .35rem;
  line-height:1.1;
  text-shadow:0 2px 16px rgba(0,0,0,.45);
}
.hero.hero--home #hero-title{
  font-size:clamp(1rem,2.2vw,1.25rem);
  font-weight:600;
  margin:.35rem 0 .75rem;
}
.hero.hero--home .hero-title-main{display:none}
.hero.hero--home .hero-title-sub{
  display:block;
  font-size:1em;
  font-weight:600;
  color:rgba(255,255,255,.95);
  margin:0;
}
.hero.hero--home .hero-kicker{margin-bottom:.5rem;color:rgba(255,255,255,.85)}
.hero.hero--home .hero-subtitle{
  font-size:clamp(.92rem,1.9vw,1.05rem);
  max-width:32rem;
  margin:0 auto 1.15rem;
  color:rgba(255,255,255,.95);
  text-shadow:0 1px 10px rgba(0,0,0,.4);
}
.hero.hero--home .hero-cta-primary{
  display:flex;
  flex-wrap:wrap;
  gap:.75rem;
  justify-content:center;
}
.hero.hero--home .hero-cta-primary .btn-large{
  width:auto;
  max-width:none;
  min-width:11rem;
}
.hero.hero--home .hero-agent{margin:0 auto .75rem}
.hero.hero--home .hero-agent__img{
  width:5rem;
  height:5rem;
  border:3px solid rgba(255,255,255,.85);
}
.hero.hero--home .hero-agent__caption{font-size:.75rem}
.hero.hero--photo .hero-media__shade,
.service-hero .hero-media__shade,
.loc-hero .hero-media__shade,
.zip-map-hero .hero-media__shade,
.search-hub-hero .hero-media__shade{
  background:linear-gradient(180deg,rgba(4,21,38,.55) 0%,rgba(10,37,64,.35) 40%,rgba(10,37,64,.62) 100%);
}
.home-quick-links{
  padding:2.5rem 0 2.75rem;
  background:#fff;
  border-bottom:1px solid #e2e8f0;
}
.home-quick-links .container{max-width:1120px}
.home-quick-links__title{
  text-align:center;
  color:#0a2540;
  font-size:clamp(1.35rem,3vw,1.75rem);
  margin:0 0 .35rem;
}
.home-quick-links__lead{
  text-align:center;
  color:#64748b;
  margin:0 auto 1.5rem;
  max-width:28rem;
}
.home-quick-links .hero-service-links{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
  gap:1rem;
  margin:0 auto 1.25rem;
  max-width:1000px;
}
.home-quick-links .service-card{
  padding:1.25rem 1rem;
  background:#f8fafc;
  border:1px solid #e2e8f0;
  box-shadow:none;
  border-radius:10px;
}
.home-quick-links .service-card:hover{
  transform:translateY(-2px);
  box-shadow:0 6px 16px rgba(10,37,64,.08);
  background:#fff;
}
.home-quick-links .service-card i{font-size:1.75rem;margin-bottom:.5rem}
.home-quick-links .service-card-title{font-size:1rem;margin-bottom:.35rem}
.home-quick-links .service-card p{font-size:.85rem}
.home-quick-links .hero-service-links-secondary{
  display:flex;
  flex-wrap:wrap;
  gap:.65rem;
  justify-content:center;
  margin:0 0 1.5rem;
}
.home-quick-links .service-card-small{
  background:#f1f5f9;
  color:#0a2540;
  border:1px solid #e2e8f0;
}
.home-quick-links .hero-stats{
  border-top:1px solid #e2e8f0;
  padding-top:1.25rem;
  margin-top:.5rem;
  gap:1.25rem 2rem;
}
.home-quick-links .hero-stats .stat-number{color:#0a2540;font-size:1.25rem}
.home-quick-links .hero-stats .stat-label{color:#64748b}
.service-hero.hero--photo,
.loc-hero.hero--photo,
.zip-map-hero.hero--photo,
.search-hub-hero.hero--photo{
  min-height:min(42vh,360px);
  display:flex;
  align-items:center;
  justify-content:center;
  padding:5.5rem 1.5rem 2.25rem;
  position:relative;
  overflow:hidden;
  margin-top:80px;
  border-radius:0 0 12px 12px;
}
.service-hero.hero--photo .container,
.loc-hero.hero--photo .container,
.zip-map-hero.hero--photo .container,
.search-hub-hero.hero--photo .container,
.zip-map-hero.hero--photo .zip-map-hero-inner{
  position:relative;
  z-index:2;
  max-width:36rem;
  width:100%;
  margin:0 auto;
  text-align:center;
}
.service-hero.hero--photo h1,
.loc-hero.hero--photo h1,
.zip-map-hero.hero--photo h1,
.search-hub-hero.hero--photo h1{
  font-size:clamp(1.4rem,3.5vw,2rem);
  text-shadow:0 2px 14px rgba(0,0,0,.45);
}
.service-hero .hero-agent,
.loc-hero .hero-agent,
.zip-map-hero .hero-agent,
.search-hub-hero .hero-agent{margin:0 auto .75rem}
.service-hero .hero-agent__img,
.loc-hero .hero-agent__img,
.zip-map-hero .hero-agent__img,
.search-hub-hero .hero-agent__img{
  width:4.5rem;
  height:4.5rem;
  border:2px solid rgba(255,255,255,.85);
}
@media (max-width:1200px){
  .hero.hero--photo,
  .service-hero.hero--photo,
  .loc-hero.hero--photo,
  .zip-map-hero.hero--photo,
  .search-hub-hero.hero--photo{
    max-width:calc(100% - 2rem);
  }
}
@media (max-width:768px){
  .hero.hero--photo,
  .service-hero.hero--photo,
  .loc-hero.hero--photo,
  .zip-map-hero.hero--photo,
  .search-hub-hero.hero--photo{
    max-width:100%;
    border-radius:0;
  }
  .hero.hero--home.hero--photo{
    min-height:auto;
    padding:5.25rem .9rem 2rem;
    margin-top:72px;
  }
  .hero.hero--home .hero-content{padding:.5rem 0 0}
  .hero.hero--home .hero-cta-primary{
    flex-direction:column;
    align-items:stretch;
  }
  .hero.hero--home .hero-cta-primary .btn-large{
    width:100%;
    max-width:100%;
    min-width:0;
    box-sizing:border-box;
  }
  .home-quick-links{padding:1.75rem 0 2rem}
  .home-quick-links .hero-service-links{
    grid-template-columns:1fr;
    gap:.75rem;
  }
  .service-hero.hero--photo,
  .loc-hero.hero--photo,
  .zip-map-hero.hero--photo,
  .search-hub-hero.hero--photo{
    min-height:auto;
    padding:5rem 1rem 1.75rem;
  }
}
/* HERO_LAYOUT_FIX_END */
`;

let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(
  new RegExp(
    '/\\* HERO_LAYOUT_FIX \\*/[\\s\\S]*?/\\* HERO_LAYOUT_FIX_END \\*/',
    'g'
  ),
  ''
);
const orphan = css.indexOf(
  '.hero.hero--home.hero--photo{min-height:min(88vh'
);
if (orphan !== -1) css = css.slice(0, orphan);
css = css.trimEnd() + '\n' + layoutCss;
fs.writeFileSync(cssPath, css);

console.log(
  'fix-hero-layout: lean homepage hero + quick-links section + responsive CSS'
);
