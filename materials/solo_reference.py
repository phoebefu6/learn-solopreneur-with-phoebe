#!/usr/bin/env python3
"""Independent Python reference for Marlow's capacity ledger (assets/solo-live.js).

Written from the booking rule, not translated line by line, and run against the node engine:
    python3 materials/solo_reference.py --json  >  py.json
    node materials/solo-node.js                 >  js.json
Every revenue, hour, rate (to the cent), weeks-over count, top-client share, hole and runway must
match. Marlow is constructed and the simulation is modelled. Illustrative, not financial or tax advice.
Hours are integer tenths and money whole dollars, so no float drift is possible except in the
final divisions, which both sides perform on the same two integers.
"""
import json
import math
import sys

M = 0xFFFFFFFF

D = dict(
    weeks=52, capacity=45, seed=20261009,
    adminBase=60, adminPerClient=5, autoShare=40, autoSetup=200,
    hourlyPrice=110, discountPrice=85, smallSales=5,
    projPrice=1350, projWeeks=4, projHours=90, projSales=50, projMaxActive=2,
    prodPrice=1800, prodHours=70, prodSales=10, prodBuildWeeks=8, prodBuildHours=80, prodFrom=9, prodMax=2,
    retPrice=700, retHours=50, retSales=80, retWeeks=[5, 14, 30],
    weeklyCost=2000, startCash=8000, breakWeek=27,
)

RUNGS = [
    (1, "All hourly", dict(proj=False, prod=False, ret=False, auto=False)),
    (2, "+ fixed-scope projects", dict(proj=True, prod=False, ret=False, auto=False)),
    (3, "+ a productized offer", dict(proj=True, prod=True, ret=False, auto=False)),
    (4, "+ retainers", dict(proj=True, prod=True, ret=True, auto=False)),
    (5, "+ automation on admin", dict(proj=True, prod=True, ret=True, auto=True)),
]


def jsround(x):
    return math.floor(x + 0.5)


class Mulberry32:
    def __init__(self, seed):
        self.a = seed & M

    def __call__(self):
        self.a = (self.a + 0x6D2B79F5) & M
        a = self.a
        t = ((a ^ (a >> 15)) * (a | 1)) & M
        t = ((t + (((t ^ (t >> 7)) * (t | 61)) & M)) & M) ^ t
        return ((t ^ (t >> 14)) & M) / 4294967296


def draw_demand(p):
    r = Mulberry32(p["seed"])
    ri = lambda n: math.floor(r() * n)
    weeks = []
    for _ in range(p["weeks"]):
        anchor = 140 + 10 * ri(9)
        small = []
        for _ in range(ri(4)):
            c = "S%d" % (1 + ri(6))
            small.append((c, 10 * (4 + ri(5))))
        disc = []
        for _ in range(ri(3)):
            c = "D%d" % (1 + ri(6))
            disc.append((c, 10 * (3 + ri(4))))
        proj = r() < 0.35
        prod = ri(3)
        weeks.append(dict(anchor=anchor, small=small, disc=disc, proj=proj, prod=prod))
    return weeks


def year(p, offers, anti, lost):
    dem = draw_demand(p)
    cap = p["capacity"] * 10
    keep = (100 - p["autoShare"]) / 100
    a_base = jsround(p["adminBase"] * keep) if offers["auto"] else p["adminBase"]
    a_per = jsround(p["adminPerClient"] * keep) if offers["auto"] else p["adminPerClient"]
    active_proj, retainers = [], []
    proj_count = prod_count = 0
    revenue_by_client = {}
    ledger = []
    totals = dict(rev=0, bill=0, sales=0, admin=0, build=0, over=0, turned=0)

    for w in range(1, p["weeks"] + 1):
        d = dem[w - 1]
        gone = lost if (lost and w >= p["breakWeek"]) else None
        bill_h = sales_h = build_h = 0
        rev = 0
        seen = []

        def load():
            return bill_h + sales_h + build_h + a_base + a_per * len(seen)

        def room_for(client, need):
            extra = 0 if client in seen else a_per
            return load() + need + extra <= cap

        def charge(client, hours, dollars):
            nonlocal bill_h, rev
            bill_h += hours
            rev += dollars
            revenue_by_client[client] = revenue_by_client.get(client, 0) + dollars
            if client not in seen:
                seen.append(client)

        if w == 1 and offers["auto"]:
            build_h += p["autoSetup"]
        if offers["prod"] and w <= p["prodBuildWeeks"]:
            build_h += p["prodBuildHours"]

        if offers["ret"]:
            for c in retainers:
                if c != gone:
                    charge(c, p["retHours"], p["retPrice"])
            if w in p["retWeeks"]:
                c = "R%d" % (p["retWeeks"].index(w) + 1)
                if c != gone:
                    sales_h += p["retSales"]
                    retainers.append(c)

        if offers["proj"]:
            active_proj = [x for x in active_proj if x[1] > 0]
            for x in active_proj:
                charge(x[0], p["projHours"], p["projPrice"])
                x[1] -= 1
            if d["proj"]:
                c = "P%d" % (proj_count + 1)
                if len(active_proj) < p["projMaxActive"] and room_for(c, p["projSales"] + p["projHours"]):
                    proj_count += 1
                    sales_h += p["projSales"]
                    charge(c, p["projHours"], p["projPrice"])
                    active_proj.append([c, p["projWeeks"] - 1])
                else:
                    totals["turned"] += 1

        if offers["prod"] and w >= p["prodFrom"]:
            for _ in range(min(d["prod"], p["prodMax"])):
                c = "Q%d" % (prod_count + 1)
                if room_for(c, p["prodHours"] + p["prodSales"]):
                    prod_count += 1
                    sales_h += p["prodSales"]
                    charge(c, p["prodHours"], p["prodPrice"])
                else:
                    totals["turned"] += 1

        if gone != "A":
            h = d["anchor"]
            if not anti:
                spare = cap - load() - (0 if "A" in seen else a_per)
                h = max(0, min(h, (spare // 10) * 10))
            if h > 0:
                charge("A", h, p["hourlyPrice"] * h // 10)

        for c, h in d["small"]:
            if c == gone:
                continue
            if anti or room_for(c, h + p["smallSales"]):
                sales_h += p["smallSales"]
                charge(c, h, p["hourlyPrice"] * h // 10)
            else:
                totals["turned"] += 1
        if anti:
            for c, h in d["disc"]:
                if c == gone:
                    continue
                sales_h += p["smallSales"]
                charge(c, h, p["discountPrice"] * h // 10)

        admin = a_base + a_per * len(seen)
        worked = bill_h + sales_h + build_h + admin
        totals["rev"] += rev
        totals["bill"] += bill_h
        totals["sales"] += sales_h
        totals["admin"] += admin
        totals["build"] += build_h
        if worked > cap:
            totals["over"] += 1
        ledger.append((w, rev))

    hours = totals["bill"] + totals["sales"] + totals["admin"] + totals["build"]
    top, top_rev = None, -1
    for c in sorted(revenue_by_client):
        if revenue_by_client[c] > top_rev:
            top, top_rev = c, revenue_by_client[c]
    return dict(revenue=totals["rev"], hours10=hours, rate_cents=jsround(totals["rev"] * 1000 / hours),
                bill_share=jsround(totals["bill"] * 1000 / hours), over=totals["over"], turned=totals["turned"],
                top=top, top_share=jsround(top_rev * 1000 / totals["rev"]), ledger=ledger)


def window(ledger, a, b):
    return sum(rev for w, rev in ledger if a <= w <= b)


def with_break(p, offers, anti):
    base = year(p, offers, anti, None)
    hit = year(p, offers, anti, base["top"])
    bw, n = p["breakWeek"], p["weeks"] - p["breakWeek"] + 1
    hole = window(base["ledger"], bw, p["weeks"]) - window(hit["ledger"], bw, p["weeks"])
    cash = p["startCash"] + window(hit["ledger"], 1, bw - 1) - p["weeklyCost"] * (bw - 1)
    after = window(hit["ledger"], bw, p["weeks"])
    net = after - p["weeklyCost"] * n
    runway = None if net >= 0 else math.floor(cash * n / -net)
    return base, dict(lost=base["top"], hole=hole, cash26=cash, weeklyAfter=jsround(after / n), runway=runway)


def num(x):
    return int(x) if float(x).is_integer() else x


def canon(p=D):
    out = {"rungs": []}
    for rid, label, offers in RUNGS:
        a, b = with_break(p, offers, False)
        out["rungs"].append(dict(rung=rid, label=label, revenue=a["revenue"], hours=num(a["hours10"] / 10),
                                 rate=num(a["rate_cents"] / 100), over=a["over"], topClient=a["top"],
                                 topShare=num(a["top_share"] / 10), billShare=num(a["bill_share"] / 10),
                                 turned=a["turned"], lost=b["lost"], hole=b["hole"], cash26=b["cash26"],
                                 weeklyAfter=b["weeklyAfter"], runway=b["runway"]))
    for k in (1, 5):
        a, b = with_break(p, RUNGS[k - 1][2], True)
        out["anti%d" % k] = dict(revenue=a["revenue"], hours=num(a["hours10"] / 10), rate=num(a["rate_cents"] / 100),
                                 over=a["over"], topClient=a["top"], topShare=num(a["top_share"] / 10),
                                 lost=b["lost"], hole=b["hole"], runway=b["runway"])
    return out


if __name__ == "__main__":
    c = canon()
    if "--json" in sys.argv:
        print(json.dumps(c, indent=1))
    else:
        for r in c["rungs"]:
            print(r)
        print("anti1", c["anti1"])
        print("anti5", c["anti5"])
