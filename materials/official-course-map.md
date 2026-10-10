# Official course map - learn-solopreneur-with-phoebe ("The One-Person Company")

Internal build document (never linked from an audience page). Built 2026-10-09. Bucket `biz`, d2,
audience everyone, single-track 6 x 45 min. Running case: **Marlow**, a constructed solo data
consultant. Never Phoebe, her employers or clients. Every page that names money carries
"Illustrative, not financial or tax advice".

## Evidence tiers

- **read** - the primary page was fetched and the sentence or number was read on it (date read 2026-10-09).
- **derived** - arithmetic on read numbers, done here, and labelled as our arithmetic on the page.
- **reported** - from a review, catalogue, summary or secondary page; the primary was not read.
- **vendor** - read at source, but published by a company that sells to the people it surveys. Never quoted as fact; used only to teach the disagreement.
- **constructed / modelled** - Marlow and every bench number.

## Verified facts

| # | Fact | Tier | Source |
|---|---|---|---|
| F1 | There were 29.8 million US nonemployer businesses with $1.7 trillion in receipts in 2022 | read | US Census Bureau, "Census Bureau Releases Demographic Characteristics of Nonemployer Business Owners" (NES-D 2022), bulletin, May 2025 |
| F2 | A nonemployer business has no paid employees, is subject to federal income tax and has receipts of $1,000 or more ($1 or more in construction); the data come from IRS records; dollar values are current dollars; 2022 methodology changes limit comparison with earlier years | read | US Census Bureau, 2022 Nonemployer Statistics tip sheet CB24-TPS.119, 12 Dec 2024 |
| F3 | $1.7 trillion / 29.8 million = about $57,000 of receipts per nonemployer business, a mean of receipts, not profit, not take-home pay, and pulled up by a few large ones | derived | F1 |
| F4 | UK, start of 2024: 5.5 million private sector businesses; 4.1 million (74%) employed nobody aside from the owner(s); 3.1 million were sole proprietorships (56%) | read | UK Department for Business and Trade, Business population estimates for the UK and regions 2024, statistical release |
| F5 | Same release, Table C: businesses with no employees had turnover of £366,012 million of £5,272,607 million for all businesses, about 6.9% (turnover excludes SIC Section K, finance and insurance) | derived | F4 table values |
| F6 | MBO Partners' 2026 State of Independence page: "A record 74.9M Americans now earn income independently"; "Almost 6M of them now earn more than $100K per year". Method for the independent-workforce survey is not on the page | vendor | mbopartners.com/state-of-independence, read 2026-10-09 |
| F7 | Naval Ravikant's "How to Get Rich (without getting lucky)": "You are not going to get rich renting out your time."; labour is "the oldest form of leverage"; capital is the second; "products with no marginal cost of replication" (code and media) are the newest; the new forms "are permissionless" | read (as a tweet thread + podcast transcript, opinion, not research) | nav.al/rich, transcript page dated 28 Dec 2019. The original tweetstorm's 2018 date is reported, not read |
| F8 | Paul Jarvis, Company of One: Why Staying Small Is the Next Big Thing for Business, Houghton Mifflin Harcourt, 2019. Argues against growth for its own sake; reviewers list four traits (resilience, autonomy, speed, simplicity) | reported | Kirkus review; library catalogue records; Twin Cities Business review. Publisher excerpt not read |
| F9 | David Maister, Managing the Professional Service Firm (1993): leverage as the ratio of junior to senior professionals; the finders, minders, grinders labels | reported | getAbstract summary; thinkinsights.net. Book not read |
| F10 | US public companies must describe "any dependence on revenue-generating activities, key products, services, product families or customers" (Reg S-K Item 101(c)(1)(i)), and smaller reporting companies "Dependence on one or a few major customers" (Item 101(h)(4)(vi)) | read | 17 CFR 229.101, via Cornell LII |
| F11 | A separate US accounting rule (ASC 280) requires disclosure of revenue from any single customer at 10% or more of revenue | reported | not read at source (FASB codification is login-walled); say "reported" on the page |

**Corrections to the course block:** (1) Maister's book is titled *Managing the Professional Service
Firm* (1993), not "The Professional Service Firm". (2) UK self-employment business counts come from
the Department for Business and Trade's Business Population Estimates, not ONS (ONS publishes the
Labour Force Survey self-employment series, not read here). (3) No primary research on client
concentration in small firms was read; concentration is taught as a principle with Marlow's
constructed numbers, plus the disclosure rule F10 as evidence that investors treat it as a risk.
(4) Naval's thread is quoted from the nav.al transcript page; its 2018 date is reported.

## The disagreement to teach (session 1, revisited in 6)

"How much do solo businesses earn?" has no single answer because the sources count different things:
Census counts tax filers with no employees (any business with $1,000+ receipts, many part-time,
receipts not profit, mean about $57,000 derived); DBT counts UK businesses with no employees (74%
of businesses, about 6.9% of turnover derived); MBO Partners counts "independents" by its own
survey definition and headlines the 6 million above $100K. A vendor survey is not wrong because it
is a vendor's, but it is not a fact about solo businesses in general. Never resolve; teach "what
was counted, by whom, and what is left out".

## Bench canon (session 4) - Marlow's capacity ledger, 52 weeks, MODELLED

Engine `assets/solo-live.js`; reference `materials/solo_reference.py`; runner `materials/solo-node.js`.
Python and node agree on all 93 canon values (revenue to the dollar, rate to the cent).
Seed 20261009. Defaults: capacity 45 h/week; hourly $110; small hourly requests 4-8 h, 0.5 h sales
each; anchor client 14-22 h/week; fixed-scope project $5,400 (4 weeks x 9 h at $1,350/week),
5 h sales, max 2 active; productized $1,800 for 7 h + 1 h sales, built over weeks 1-8 at 8 h/week,
sold from week 9, max 2/week; retainers $700/week for 5 h, 8 h to win, won weeks 5, 14, 30; admin
6 h/week + 0.5 h per client billed; automation cuts admin 40% for 20 h set-up in week 1; weekly
costs $2,000; start cash $8,000; break week 27.

| Rung | Revenue | Hours | Effective rate | Over cap | Top client share | Break: hole | Break: runway |
|---|---|---|---|---|---|---|---|
| 1 All hourly | $144,430 | 1,717 | $84.12 | 0 | 69.5% (anchor) | $48,290 | 26 weeks |
| 2 + fixed-scope | $206,940 | 2,148.5 | $96.32 | 0 | 46.9% | $36,850 | covered |
| 3 + productized | $250,530 | 2,258.5 | $110.93 | 0 | 30.8% | $24,640 | covered |
| 4 + retainers | $251,920 | 2,315.5 | $108.80 | 0 | 18.2% | $11,550 | covered |
| 5 + automation | $265,320 | 2,278.7 | $116.43 | 0 | 18.9% | $9,130 | covered |

Hour breakdown (billable / sales / admin / building): rung 1 1,313 / 34 / 370 / 0 (billable 76.5%);
rung 4 1,689 / 128 / 434.5 / 64; rung 5 1,794 / 137 / 263.7 / 84 (billable 78.7%).
Rung 1 average 33.0 h/week worked; average weekly revenue $2,777.50. Rung 1 break: cash at week
26 $27,830, weekly revenue after the loss $935.
Rung 1 ceiling, arithmetic: 45 h x 52 weeks = 2,340 h; x $110 = $257,400 if every hour were billed.

**Anti-lever, "say yes to every hourly client"** (all hourly requests taken whatever the week
holds, plus discount requests at $85/h): on rung 1, revenue $144,430 -> $171,420 (+$26,990),
hours 1,717 -> 2,089.5, effective rate $84.12 -> $82.04, weeks over capacity 0 -> 15, top client
share 69.5% -> 58.5%, busiest week 64.5 h. On rung 5: revenue $265,320 -> $385,370, hours
2,278.7 -> 3,536.4 (68.0 h/week average), rate $116.43 -> $108.97, weeks over capacity 0 -> 50.
Honest nuance: on rung 5 revenue rises a lot, not a little, because the model lets Marlow work
68 hours a week for a year; the rate falls and the week becomes unliveable. The model prints both.

**Rung 4 is the two-number rung:** revenue +$1,390 over rung 3 but the effective rate falls
$110.93 -> $108.80; what retainers buy here is concentration (30.8% -> 18.2%) and a smaller hole
($24,640 -> $11,550). Teach the trade, not "retainers always win".

**Break button:** the anchor (hourly) client is the biggest client on every rung. Losing it in
week 27 leaves rung 1 with $935 a week against $2,000 costs: 26 weeks of runway. From rung 2 on,
what is left covers costs. Note the model partly refills the hole with small requests it had been
turning away, which is realistic and is said on the page.

Sensitivity (rung 1, for prose only if printed by the widget): capacity 35 h $126,060 / $82.61;
40 h $138,930; 50 h $146,850; 55 h $147,620 (more hours barely help: demand is the limit). Hourly
price $90 $118,170 / $68.82; $150 $196,950 / $114.71.

## Seams (said out loud on the pages that touch them, absolute links)

- Reputation, niche, proof, platforms: https://phoebefu6.github.io/learn-personal-branding-with-phoebe/
- Positioning, channels, funnel, customer value: https://phoebefu6.github.io/learn-marketing-with-phoebe/
- Statements, cash vs profit, funding: https://phoebefu6.github.io/learn-finance-with-phoebe/
- Building automations: https://phoebefu6.github.io/learn-automation-with-phoebe/ ; personal ops triage: https://phoebefu6.github.io/learn-ai-productivity-with-phoebe/ . Here automation and AI appear only as hours moved on the ledger.
- Elasticity and pricing from data: https://phoebefu6.github.io/learn-economics-with-phoebe/

## Per-session coverage

1. **Your hours are the ceiling** - the solo business as an operating model; counting what exists (F1-F5) and the income disagreement (F3, F5, F6); the hours that are not billable (bench rung 1 breakdown); the ceiling arithmetic; build-along: Marlow's (and your) hour ledger for one week.
2. **The offer ladder (from hourly to productized)** - five offer types: hourly, fixed-scope, productized, retainer, asset; what each sells (time, outcome, package, access, a thing); the scope line; Maister's people leverage reported (F9); build-along: write one offer one rung up.
3. **Leverage that does not need permission** - Naval's four forms (F7, opinion tier), Maister's people leverage (F9) as the one a solo firm lacks; code, content, media, capital, people; Jarvis "stay small" (F8, reported) and the counter-view; automation/AI as hours moved only (seam); build-along: a leverage audit, hours in vs hours repeated.
4. **The capacity bench** - the bench canon above; ladder, two-number rung, anti-lever, break.
5. **When one client is half the business** - concentration as a principle; top-client share; F10 (read), F11 (reported); the break button; the runway; build-along: concentration table and a 26-week runway check.
6. **The weekly operating rhythm** - a weekly review: hours by kind, pipeline, cash, concentration, one lever; the solo-vs-hire line (Maister's people leverage revisited, reported); build-along: a one-page weekly rhythm.

## Not covered (honest list)

Tax, legal structure, insurance, contracts (seek local professional advice); bookkeeping and
statements (Finance); brand, niche and content strategy (Personal Branding); marketing funnels
(Marketing); building automations (Automation); price elasticity (Economics); hiring law and
payroll; any real solopreneur income distribution beyond F1-F6; any study of client concentration
in small firms (none read).

## Citation appendix

- U.S. Census Bureau (2025). Census Bureau Releases Demographic Characteristics of Nonemployer Business Owners (NES-D, reference year 2022). content.govdelivery.com/accounts/USCENSUS/bulletins/3df376d
- U.S. Census Bureau (2024). 2022 Nonemployer Statistics, tip sheet CB24-TPS.119, 12 December 2024. census.gov/newsroom/press-releases/2024/2022-nonemployer-statistics.html
- Department for Business and Trade (2024). Business population estimates for the UK and regions 2024: statistical release. gov.uk
- MBO Partners (2026). State of Independence. mbopartners.com/state-of-independence (vendor)
- Ravikant, N. How to Get Rich (without getting lucky), tweet thread and podcast transcript. nav.al/rich
- Jarvis, P. (2019). Company of One. Houghton Mifflin Harcourt. (reported)
- Maister, D. H. (1993). Managing the Professional Service Firm. Free Press. (reported)
- 17 CFR 229.101, Regulation S-K Item 101. law.cornell.edu/cfr/text/17/229.101
