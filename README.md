<!-- learn-with-phoebe hub banner -->
> ### 📚 Part of [**Learn with Phoebe**](https://phoebefu6.github.io/learn-with-phoebe/)
> The shelf of 155 free, hands-on courses on AI, data, and the craft around them. **[Browse every course ↗](https://phoebefu6.github.io/learn-with-phoebe/)**
<!-- /learn-with-phoebe hub banner -->

# Learn Solopreneur with Phoebe

The One-Person Company: six 45-minute sessions on the operating model of a business of one. What
you sell, how it scales past your own hours, and what breaks first: the hours that never reach an
invoice and the effective rate, the offer ladder (hourly, fixed-scope, productized, retainer,
asset), leverage that needs no permission, a capacity bench, client concentration and runway, and a
weekly operating rhythm. The running case is constructed: Marlow, an invented solo data consultant.

Illustrative, not financial or tax advice.

**Live site:** https://phoebefu6.github.io/learn-solopreneur-with-phoebe/

| # | Session | Signature thing |
|---|---|---|
| 1 | Your hours are the ceiling | Three counts of solo businesses and why income surveys disagree; four kinds of hours; effective rate and ceiling |
| 2 | The offer ladder | Five offer types, the scope line, and one offer moved one rung up |
| 3 | Leverage that does not need permission | Labour, capital, code and media, each idea tiered by where it came from; a leverage audit |
| 4 | The capacity bench | Marlow's 52-week year modelled in the browser: five rungs, an anti-lever and a break button |
| 5 | When one client is half the business | Top-client share, the disclosure rule, and runway counted in weeks |
| 6 | The weekly operating rhythm | A fifteen-minute weekly review, one lever a week, and the solo-vs-hire line |

The bench in session 4 (`assets/solo-live.js`) is a seeded weekly simulation, modelled and labelled
so on the widget. Inputs per offer: price, hours per unit, sales hours to win one, admin hours and
seeded weekly demand, inside a 45-hour week. At the defaults the all-hourly year earns $144,430 for
1,717 hours, an effective $84.12 an hour, with one client paying 69.5 percent; with every rung up to
automation it earns $265,320 at $116.43 an hour with the top client at 18.9 percent. The anti-lever,
"say yes to every hourly client", lifts all-hourly revenue to $171,420 while the rate falls to
$82.04 and 15 weeks go over capacity. The break button removes the biggest client in week 27: the
all-hourly year loses $48,290 and has about 26 weeks of runway. The Python reference
(`python3 materials/solo_reference.py --json`) and the browser engine (`node materials/solo-node.js`)
print identical numbers, 93 values to the cent.

Facts quoted from the US Census Bureau (Nonemployer Statistics 2022), the UK Department for Business
and Trade (Business population estimates 2024) and 17 CFR 229.101 were read at source; framings from
Naval Ravikant, Paul Jarvis and David Maister are tiered on each page.

By Phoebe Fu.
