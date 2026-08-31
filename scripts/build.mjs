import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { siteContent } from "../site-content.mjs";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(projectDir, "dist");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const renderAuthorLine = (text) =>
  escapeHtml(text).replaceAll("Yuhan Zhang", "<strong>Yuhan Zhang</strong>");

const renderPage = () => {
  const { profile } = siteContent;
  const pageUrl = "https://yuhanzyh.github.io/";
  const description =
    "Academic homepage of Yuhan Zhang, featuring research on autonomous-driving testing, large language models for transportation, and sustainable urban mobility.";
  const linkedProfiles = siteContent.socialProfiles
    .filter((item) => item.url)
    .map((item) => item.url);
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: pageUrl,
    image: `${pageUrl}yuhan-zhang.jpg`,
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: profile.affiliation,
    },
    alumniOf: siteContent.education.map((item) => ({
      "@type": "CollegeOrUniversity",
      name: item.institution,
    })),
    knowsAbout: siteContent.researchAreas.map((item) => item.title),
    sameAs: linkedProfiles,
  }).replaceAll("<", "\\u003c");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Yuhan Zhang | Academic Homepage</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="author" content="Yuhan Zhang">
    <meta name="keywords" content="Yuhan Zhang, autonomous driving testing, transportation engineering, large language models, traffic simulation, sustainable urban mobility">
    <meta name="theme-color" content="#ffffff">
    <link rel="canonical" href="${pageUrl}">
    <link rel="icon" href="/yuhan-zhang.jpg">
    <link rel="stylesheet" href="/styles.css">
    <meta property="og:title" content="Yuhan Zhang | Academic Homepage">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:locale" content="en_US">
    <meta property="og:image" content="${pageUrl}og.jpg">
    <meta property="og:image:width" content="1792">
    <meta property="og:image:height" content="936">
    <meta property="og:image:alt" content="Yuhan Zhang — Academic Homepage">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Yuhan Zhang | Academic Homepage">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${pageUrl}og.jpg">
    <script type="application/ld+json">${structuredData}</script>
  </head>
  <body>
    <div class="site-shell" id="top">
      <main class="main-content">
        <nav class="top-nav" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#research">Research</a>
          <a href="#updates">Updates</a>
          <a href="#publications">Publications</a>
          <a href="#conferences">Conferences</a>
          <a href="#education">Education</a>
        </nav>

        <section class="content-section intro-section" id="about">
          <p class="eyebrow">Academic homepage</p>
          <h2 class="intro-title">Intelligent, safe, and sustainable mobility.</h2>
          <p>${escapeHtml(profile.about)}</p>
        </section>

        <section class="content-section" id="research">
          <h2 class="section-title">Research Interests</h2>
          <ul class="interest-list">
            ${siteContent.researchAreas
              .map(
                (area) =>
                  `<li><strong>${escapeHtml(area.title)}.</strong> ${escapeHtml(area.description)}</li>`,
              )
              .join("\n")}
          </ul>
        </section>

        <section class="content-section" id="updates">
          <h2 class="section-title">Latest Updates</h2>
          <div class="update-list">
            ${siteContent.latestUpdates
              .map(
                (update) => `<article${update.featured ? ' class="update-featured"' : ""}>
              <time>${escapeHtml(update.date)}</time>
              <div>
                ${update.kicker ? `<span class="update-kicker">${escapeHtml(update.kicker)}</span>` : ""}
                <h3><a href="${escapeHtml(update.url)}" target="_blank" rel="noreferrer">${escapeHtml(update.title)}</a></h3>
                <p>${escapeHtml(update.detail)}</p>
              </div>
            </article>`,
              )
              .join("\n")}
          </div>
        </section>

        <section class="content-section" id="publications">
          <h2 class="section-title">Selected Publications</h2>
          <div class="publication-list">
            ${siteContent.publications
              .map(
                (publication) => `<article>
              <a class="publication-figure" href="${escapeHtml(publication.url)}" target="_blank" rel="noreferrer" aria-label="Open ${escapeHtml(publication.title)}">
                <img loading="lazy" src="${escapeHtml(publication.image)}" alt="${escapeHtml(publication.imageAlt)}">
              </a>
              <div class="publication-copy">
                <p class="publication-meta"><span>${escapeHtml(publication.year)}</span><em>${escapeHtml(publication.venue)}</em></p>
                <h3><a href="${escapeHtml(publication.url)}" target="_blank" rel="noreferrer">${escapeHtml(publication.title)}</a></h3>
                <p class="author-line">${renderAuthorLine(publication.authors)}</p>
                <p class="venue-line">${escapeHtml(publication.note)}</p>
              </div>
            </article>`,
              )
              .join("\n")}
          </div>
        </section>

        <section class="content-section" id="conferences">
          <h2 class="section-title">Conference History</h2>
          <div class="conference-list">
            ${siteContent.conferences
              .map(
                (conference) => `<article>
              <time>${escapeHtml(conference.year)}</time>
              <span class="conference-mark" aria-hidden="true"></span>
              <div>
                <h3>${escapeHtml(conference.name)}</h3>
                <p>${escapeHtml(conference.date)} · ${escapeHtml(conference.location)}</p>
              </div>
            </article>`,
              )
              .join("\n")}
          </div>

          <div class="footprint-block">
            <div class="footprint-heading">
              <h3>Academic Footprint</h3>
            </div>
            <div class="map-stage" aria-label="Map of academic footprint locations">
              <img src="/world-map.jpg" alt="Blank world map">
              ${siteContent.footprints
                .map(
                  (point) =>
                    `<span class="map-point" tabindex="0" role="img" title="${escapeHtml(point.place)} — ${escapeHtml(point.detail)}" aria-label="${escapeHtml(point.place)}: ${escapeHtml(point.detail)}" style="--x: ${point.x}%; --y: ${point.y}%"><span class="map-point-dot" aria-hidden="true"></span><span class="map-point-label" aria-hidden="true">${escapeHtml(point.label)}</span></span>`,
                )
                .join("\n")}
            </div>
          </div>
        </section>

        <section class="content-section" id="education">
          <h2 class="section-title">Education</h2>
          <div class="education-list">
            ${siteContent.education
              .map(
                (item) => `<article>
              <time>${escapeHtml(item.period)}</time>
              <div>
                <h3>${escapeHtml(item.institution)}</h3>
                <p>${escapeHtml(item.detail)}</p>
              </div>
            </article>`,
              )
              .join("\n")}
          </div>
        </section>

        <footer class="site-footer">
          <span>© 2026 Yuhan Zhang · Last updated August 2026</span>
          <a href="#top">Back to top</a>
        </footer>
      </main>

      <aside class="profile-sidebar">
        <img class="profile-photo" src="/yuhan-zhang.jpg" alt="Yuhan Zhang" fetchpriority="high">
        <h1>${escapeHtml(profile.name)}</h1>
        <p class="profile-affiliation">${escapeHtml(profile.affiliation)}</p>
        <p class="profile-summary">Autonomous Driving · Large Language Models · Urban Mobility</p>
        <div class="profile-links" aria-label="Academic profiles">
          ${siteContent.socialProfiles
            .map((item) =>
              item.url
                ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.name)}</a>`
                : `<span>${escapeHtml(item.name)} <small>link pending</small></span>`,
            )
            .join("\n")}
        </div>
      </aside>
    </div>
  </body>
</html>
`;
};

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(path.join(projectDir, "public"), outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "styles.css"),
  await readFile(path.join(projectDir, "styles.css"), "utf8"),
);
await writeFile(path.join(outputDir, "index.html"), renderPage());

console.log(`Built static academic homepage in ${outputDir}`);
