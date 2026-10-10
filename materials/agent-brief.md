# Agent brief - shared by every fan-out page of learn-solopreneur-with-phoebe

Filled from course-builder/references/agent-brief.template.md on 2026-10-09. Internal build
document: never link it from an audience page.

You are writing ONE static HTML session page. No servers, no npm. **If your target file already
exists on disk, do not write it; report that and stop.** Write the file, return its path and one
line of coverage. No HTML in your reply.

## Read first, in this order

1. The template page. Copy its structure, classes, SVG grammar and quiz markup EXACTLY, including
   how many options each question has (FOUR, "A · ..." to "D · ..."):
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-solopreneur-with-phoebe/courses/01-hours-are-the-ceiling.html`
   For rhythm you may also skim the bench page
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-solopreneur-with-phoebe/courses/04-the-capacity-bench.html`
2. The source map: every verified number, its evidence tier, per-session coverage, the seams, the
   bench canon. Use ONLY its numbers; never invent a statistic; if a fact is missing, teach the
   uncertainty.
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-solopreneur-with-phoebe/materials/official-course-map.md`
3. The stylesheet `:root` block (first 27 lines) for the palette tokens:
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-solopreneur-with-phoebe/assets/style.css`

## Page skeleton (keep every component)

toolbar (crumb EXACTLY `<a href="../index.html">learn-solopreneur-with-phoebe</a> / Session N of 6`,
#toggle-all, #zoom-toggle) · masthead (eyebrow "Learn Solopreneur with Phoebe · Session N of 6", h1
with one `<span class="accent">`, .sub, .chip-row with the level chip (🟡 Core for sessions 2 and 3,
🟠 Deeper for 5 and 6), two .chip.audience chips and .chip.time "45 min", .agenda a1-a4 with flex
weights as in the template) · main.wrap · section#intro (Part 0 "Where we start": kicker, .lede,
.legend pills copied from the template, .callout.win "★ What you walk out with tonight.") · 3 Parts,
each `section.section#part-N` with section-kicker (klabel "Part N · covers ...", h2,
`.tag.concept "5 min live"`), a `.lede`, ONE figure, `details.card` accordions (summary:
`.mode.live` or `.mode.self`, title, `.mini`, `.caret ▶`), at least one `.callout.example` with
`span.ex-pill` "Real world" on the page · section#demo-1 Build-along (kicker klabel "Build-along",
h2, `.tag.demo "★ 22 min · everyone builds"`, .lede, ONE figure, `.steps > .step`, each step a `p`
then a `.prompt-box.good` carrying a `span.label` "★ Step N · ..."; 5 or 6 steps of a worked
artefact the learner writes for their own business, with Marlow's version as the example and
"your numbers will differ" wherever numbers appear) · section#exercise Homework (ol, 4 items, tag
"30 min") · section#quiz (3 x `.quiz-q data-answer="0-based"`, `p.qtext`, FOUR `button.qopt`
"A · ..." to "D · ...", `p.qwhy`; one `p.quiz-score` after the last; vary the correct letter) ·
section#official, h2 EXACTLY "What this session teaches, and where it came from",
`.covered > .covered-row` (pill solid ✓ / light ◐ + name + note), then the `.mono` line EXACTLY
"Every fact on this page, and its verification tier, is recorded in the course's source map." ·
section.cheat#cheatsheet (h3 "Session N cheat sheet <span>· pin this</span>", .grid-2 of six
.cheat-item) · `.callout.next` with `.nx-pill` "Next session" (session 6: "Where next" pointing to
the course home and the hub) · footer.pagefoot · `<script src="../assets/app.js?v=1"></script>`.

Head: the template's social meta block with this page's own title/description/url (og:image stays
`https://phoebefu6.github.io/learn-solopreneur-with-phoebe/assets/og-cover.png`);
`<title>Session N · <Title> - learn solopreneur with phoebe</title>`;
`<link rel="stylesheet" href="../assets/style.css?v=1">`. Nothing else external.

First `details.card` in the FIRST Part is `open`; no other. Sentence case headings. Warm
practitioner voice, concrete, never dry. Inside prompt-boxes escape `&` `<` `>`. 450 to 650 lines
is guidance about depth, never a target: never collapse whitespace, dissolve a list into a
paragraph, or drop a component to fit.

## Hard rules (a violation is rework)

- NEVER an em dash or en dash, anywhere (prose, code, aria-labels, comments). Hyphen only.
- No meta text: never "this course", "in this course", "the course teaches", "banned here". State
  the professional norm directly with its reason. The two exact estate phrases above are the only
  self-references; "session 4" cross-references are fine.
- Attribution "by Phoebe Fu". Never "built with" a tool.
- Every number comes from the map or is labelled constructed. For constructed data print "your
  numbers will differ", never invented outputs as if run. Bench numbers are quoted only from the
  map's canon table and are always called "modelled".
- Contested or missing evidence: teach the disagreement; never resolve what the literature has not.
- Citations in the exact form of the map's appendix; anything marked reported is "reported" on the
  page; anything vendor is "a vendor's claim".
- NEVER "lottery" or "lotteries"; say the mechanism.
- Default to the English word. No Chinese terms are needed.
- Money anywhere on the page: the sentence "Illustrative, not financial or tax advice." appears at
  least once (Part 0 lede is a good place).
- Titles, widget ids and class names must not collide with siblings. Banned titles: "A system you
  keep", "The one-page marketing plan", "Is it worth the time?", "Where your week actually goes".
  Do not add new CSS classes or ids beyond those in the template; figure classes use your prefix.
- Seams, said out loud with absolute links where the page touches them:
  reputation/niche/proof/platforms -> https://phoebefu6.github.io/learn-personal-branding-with-phoebe/ ;
  positioning/channels/funnel/customer value -> https://phoebefu6.github.io/learn-marketing-with-phoebe/ ;
  statements/cash vs profit/funding -> https://phoebefu6.github.io/learn-finance-with-phoebe/ ;
  building automations -> https://phoebefu6.github.io/learn-automation-with-phoebe/ ; personal ops
  triage -> https://phoebefu6.github.io/learn-ai-productivity-with-phoebe/ ; elasticity and pricing
  from data -> https://phoebefu6.github.io/learn-economics-with-phoebe/ . Automation and AI appear
  here ONLY as hours moved on the ledger. Link format: `<a href="URL">Name ↗</a>`.
- Tax, legal structure, contracts, hiring law: say "take local professional advice" and do not teach.

## Figure grammar (hand-drawn, every figure)

Palette, ONLY these hexes (no invented greys): ink `#2B1D1A` · muted `#6B5A55` · brick primary
`#8E3A2B` · brick deep `#5E2419` · brick mid `#7A3123` · brick soft `#EBCFC6` · brick 50 `#FBF1ED`
· faint `#D9CBC6` · hairline `#EEE4E0` · sage contrast `#4E7A5C` · sage ink `#2F4F3A` · sage 50
`#E8F1EA` · `#FFFFFF` · universal reds `#991B1B` `#FEF2F2` `#FCA5A5` only for a wrong-way panel.

- `<figure class="zoomable">` > `<svg viewBox="0 0 880 H" xmlns="http://www.w3.org/2000/svg"
  role="img" aria-label="the data, not the shape">` > `<defs>` + `<style>` + content, then
  `<figcaption>🔍 Click to zoom - takeaway</figcaption>`. Grow H, never W.
- Prefix unique per figure, used for every class and id: `s<session><letter>`, e.g. s2a, s2b, s2c,
  s2d (build-along figure is d). Never reuse s1* or s4*.
- `<defs>` holds with prefix P: a wobble filter `id="PSk"` (`feTurbulence type="fractalNoise"
  baseFrequency="0.02" numOctaves="2" seed="<int>"` + `feDisplacementMap scale="2.4"
  xChannelSelector="R" yChannelSelector="G"`, `x="-3%" y="-3%" width="106%" height="106%"`), a
  hachure pattern `id="PHc"` (7x7 userSpaceOnUse, rotate(-38), one `#8E3A2B` line, opacity .5), an
  open arrowhead `id="PAr"` (path `M1 1 L9 5 L1 9`, fill none, stroke `#2B1D1A` 1.6). ALL shapes sit
  inside ONE `<g filter="url(#PSk)" fill="none" stroke="#2B1D1A" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round">`; rects carry a tiny rotation (-4 to 4 degrees for
  hand-placed items, under 1 for panels). Fills: white, `#FBF1ED`, the hachure for "the pile" or
  "the data", and sage (`#E8F1EA` fill, `#4E7A5C` stroke) ONLY for the one thing the figure is
  about. One doodle anchor per figure, simple strokes, never a mascot.
- Text classes, copy the template's `<style>` block: `.PH` 800 12px ink heading · `.PL` 600 12px
  ink label · `.PS` 400 11px muted · `.PB` 800 11px `#2F4F3A` · `.PV` 800 13-18px `#5E2419` value ·
  `.PA` 700 11px `#8E3A2B` axis caption · `.PN` 400 12px muted note. White text only on `#8E3A2B`
  or darker, via `style="fill:#FFFFFF"`.
- ALL `<text>` outside the filtered group, sans stack, never below 10.5px.
- Fit: max chars ≈ (box width - 20) / 7 at 12px, 6.4px/char at 11px; full-width note under 110
  chars; 40px between neighbouring point labels; bottom note 22px below the last row, H clears it by
  8px. No line, arrow or curve may cross a label (the gate flags line-through-text and
  text-out-of-box); hand-stacked rects must not overlap as painted rects. When in doubt, shorten.
- Floor: one figure per Part plus one in the build-along (4 figures). Draw the MECHANISM (what the
  outline names for each figure), never a metaphor literally, never decoration.

## Voice and honesty

Every Part gets a story; the "Real world" callout is a generic, recognisable pattern ("a familiar
pattern: a solo designer..."), never a named real person's private case and never Phoebe. Marlow is
constructed and modelled: say so on the page. Naval Ravikant is quoted only from the map's F7 and
tiered "a tweet thread and podcast, opinion not research". Jarvis and Maister are "reported". MBO
Partners is "a vendor's claim".

## Footer chain and session titles

Footer left: `Session N of 6 · learn-solopreneur-with-phoebe · by Phoebe Fu &nbsp;·&nbsp; 📚 <a href="https://phoebefu6.github.io/learn-with-phoebe/">Learn with Phoebe ↗</a>`
Footer right: `<a href="PREV">← Prev: <title></a> &nbsp;·&nbsp; <a href="NEXT">Next: <title> →</a>` (session 6: `← Prev` and `<a href="../index.html">Course home →</a>`).

Session titles (exact, sentence case, one accent span in h1) and files:
1 `01-hours-are-the-ceiling.html` Your hours are the ceiling ·
2 `02-the-offer-ladder.html` The offer ladder ·
3 `03-leverage-without-permission.html` Leverage that does not need permission ·
4 `04-the-capacity-bench.html` The capacity bench ·
5 `05-one-client-half-the-business.html` When one client is half the business ·
6 `06-the-weekly-operating-rhythm.html` The weekly operating rhythm
