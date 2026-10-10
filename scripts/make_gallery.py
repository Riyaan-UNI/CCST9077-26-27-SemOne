"""Generate the gallery plates as self-contained SVG art.

The site's gallery expects files in public/gallery. These are drawn
procedurally so the repository stays light, the art matches the retro-terminal
palette exactly, and nothing has to be licensed from a third party.

Run:  python scripts/make_gallery.py
"""

from __future__ import annotations

import math
import pathlib
import random

OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "gallery"
OUT.mkdir(parents=True, exist_ok=True)

BG = "#070b09"
NEON = "#39ff14"
CYAN = "#5be3ff"
CREAM = "#f6f1e4"
HKU = "#0f402e"
GRID = "rgba(57,255,20,0.10)"
DIM = "rgba(57,255,20,0.35)"


def header(w: int, h: int, seed: int, title: str) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{title}">
<defs>
  <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
    <path d="M48 0H0V48" fill="none" stroke="{GRID}" stroke-width="1"/>
  </pattern>
  <radialGradient id="vign" cx="50%" cy="45%" r="72%">
    <stop offset="0%" stop-color="{NEON}" stop-opacity="0.10"/>
    <stop offset="100%" stop-color="{BG}" stop-opacity="0"/>
  </radialGradient>
  <filter id="glow" x="-70%" y="-70%" width="240%" height="240%">
    <feGaussianBlur stdDeviation="7" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="2.2" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="{NEON}" stop-opacity="0"/>
    <stop offset="50%" stop-color="{CYAN}" stop-opacity="0.75"/>
    <stop offset="100%" stop-color="{NEON}" stop-opacity="0"/>
  </linearGradient>
</defs>
<rect width="{w}" height="{h}" fill="{BG}"/>
<rect width="{w}" height="{h}" fill="url(#grid)"/>
<rect width="{w}" height="{h}" fill="url(#vign)"/>
"""


def footer(scan: bool = True) -> str:
    lines = ""
    if scan:
        lines = (
            '<g opacity="0.30">'
            '<pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">'
            '<rect width="4" height="1.2" fill="#ffffff" opacity="0.05"/></pattern>'
            '<rect width="100%" height="100%" fill="url(#scan)"/></g>'
        )
    return lines + "</svg>\n"


def bloch(w: int = 1000, h: int = 1000) -> str:
    cx, cy, r = w / 2, h / 2 + 10, 330
    s = header(w, h, 1, "The Bloch sphere")
    s += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{NEON}" stroke-width="2.5" opacity="0.85" filter="url(#soft)"/>\n'
    # latitude / longitude wireframe
    for i in range(1, 5):
        ry = r * math.cos(i * math.pi / 6)
        s += f'<ellipse cx="{cx}" cy="{cy - r * math.sin(i * math.pi / 6):.1f}" rx="{abs(ry):.1f}" ry="{abs(ry) * 0.16:.1f}" fill="none" stroke="{DIM}" stroke-width="1.1"/>\n'
        s += f'<ellipse cx="{cx}" cy="{cy + r * math.sin(i * math.pi / 6):.1f}" rx="{abs(ry):.1f}" ry="{abs(ry) * 0.16:.1f}" fill="none" stroke="{DIM}" stroke-width="1.1"/>\n'
    for i in range(1, 6):
        rx = r * abs(math.cos(i * math.pi / 12))
        s += f'<ellipse cx="{cx}" cy="{cy}" rx="{rx:.1f}" ry="{r}" fill="none" stroke="{DIM}" stroke-width="1.1"/>\n'
    # axis
    s += f'<line x1="{cx}" y1="{cy - r - 40}" x2="{cx}" y2="{cy + r + 40}" stroke="{DIM}" stroke-width="1.4" stroke-dasharray="7 7"/>\n'
    s += f'<circle cx="{cx}" cy="{cy - r}" r="12" fill="{NEON}" filter="url(#glow)"/>\n'
    s += f'<circle cx="{cx}" cy="{cy + r}" r="12" fill="{CYAN}" filter="url(#glow)"/>\n'
    s += f'<text x="{cx + 26}" y="{cy - r - 6}" fill="{NEON}" font-family="monospace" font-size="30">|0&#10217;</text>\n'
    s += f'<text x="{cx + 26}" y="{cy + r + 30}" fill="{CYAN}" font-family="monospace" font-size="30">|1&#10217;</text>\n'
    # state vector
    vx, vy = cx + r * 0.62, cy - r * 0.58
    s += f'<line x1="{cx}" y1="{cy}" x2="{vx:.1f}" y2="{vy:.1f}" stroke="{CREAM}" stroke-width="4" stroke-linecap="round" filter="url(#glow)"/>\n'
    s += f'<circle cx="{vx:.1f}" cy="{vy:.1f}" r="13" fill="{CREAM}" filter="url(#glow)"/>\n'
    s += f'<text x="{vx + 26:.1f}" y="{vy - 14:.1f}" fill="{CREAM}" font-family="monospace" font-size="34">|&#968;&#10217;</text>\n'
    # measurement arc
    s += f'<path d="M {cx + 120} {cy} A 120 120 0 0 0 {cx + 120 * math.cos(-0.75):.1f} {cy + 120 * math.sin(-0.75):.1f}" fill="none" stroke="{CYAN}" stroke-width="1.6" opacity="0.7"/>\n'
    s += f'<text x="{cx + 78}" y="{cy + 82}" fill="{CYAN}" font-family="monospace" font-size="26">&#952;</text>\n'
    return s + footer()


def entangled(w: int = 1200, h: int = 800) -> str:
    s = header(w, h, 2, "An entangled pair")
    ax, ay = 260, h / 2
    bx, by = w - 260, h / 2
    # entanglement link
    pts = []
    for i in range(0, 121):
        t = i / 120
        x = ax + (bx - ax) * t
        y = ay + math.sin(t * math.pi * 5) * 34
        pts.append(f"{x:.1f},{y:.1f}")
    s += f'<polyline points="{" ".join(pts)}" fill="none" stroke="{NEON}" stroke-width="3" opacity="0.9" filter="url(#glow)"/>\n'
    for (x, y, color, label) in ((ax, ay, NEON, "|0&#10217;"), (bx, by, CYAN, "|1&#10217;")):
        for k in range(1, 5):
            s += f'<circle cx="{x}" cy="{y}" r="{44 * k}" fill="none" stroke="{color}" stroke-width="1.2" opacity="{0.34 / k:.2f}"/>\n'
        s += f'<circle cx="{x}" cy="{y}" r="46" fill="none" stroke="{color}" stroke-width="3" filter="url(#glow)"/>\n'
        s += f'<circle cx="{x}" cy="{y}" r="20" fill="{color}" filter="url(#glow)"/>\n'
        s += f'<text x="{x - 30}" y="{y + 100}" fill="{color}" font-family="monospace" font-size="32">{label}</text>\n'
    rnd = random.Random(2)
    for _ in range(70):
        x = rnd.uniform(0, w)
        y = rnd.uniform(0, h)
        s += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{rnd.uniform(1, 2.6):.1f}" fill="{CREAM}" opacity="{rnd.uniform(0.15, 0.6):.2f}"/>\n'
    s += f'<text x="{w / 2}" y="{h - 70}" text-anchor="middle" fill="{CREAM}" font-family="monospace" font-size="34" opacity="0.9">(|00&#10217; + |11&#10217;) / &#8730;2</text>\n'
    return s + footer()


def qubi_crt(w: int = 900, h: int = 1100) -> str:
    s = header(w, h, 3, "Qubi, the qubit terminal")
    cx, cy = w / 2, h / 2 - 40
    # antenna
    s += f'<line x1="{cx}" y1="{cy - 300}" x2="{cx}" y2="{cy - 400}" stroke="{CREAM}" stroke-width="7" stroke-linecap="round"/>\n'
    s += f'<circle cx="{cx}" cy="{cy - 412}" r="18" fill="{NEON}" filter="url(#glow)"/>\n'
    s += f'<circle cx="{cx}" cy="{cy - 412}" r="40" fill="none" stroke="{NEON}" stroke-width="2.5" opacity="0.5"/>\n'
    # shell
    s += f'<rect x="{cx - 280}" y="{cy - 300}" width="560" height="470" rx="64" fill="{HKU}" stroke="{CREAM}" stroke-width="14"/>\n'
    # screen
    s += f'<rect x="{cx - 220}" y="{cy - 240}" width="440" height="340" rx="36" fill="{BG}" stroke="{CREAM}" stroke-width="10"/>\n'
    s += f'<rect x="{cx - 220}" y="{cy - 240}" width="440" height="340" rx="36" fill="{NEON}" opacity="0.06"/>\n'
    # face
    for ex in (cx - 88, cx + 88):
        s += f'<rect x="{ex - 34}" y="{cy - 150}" width="68" height="68" rx="16" fill="{NEON}" filter="url(#glow)"/>\n'
    s += f'<path d="M {cx - 92} {cy - 20} q 92 84 184 0" fill="none" stroke="{NEON}" stroke-width="18" stroke-linecap="round" filter="url(#glow)"/>\n'
    # scanlines over the screen
    for y in range(int(cy - 240), int(cy + 100), 7):
        s += f'<line x1="{cx - 220}" y1="{y}" x2="{cx + 220}" y2="{y}" stroke="#ffffff" opacity="0.035" stroke-width="2"/>\n'
    # badge
    s += f'<rect x="{cx + 90}" y="{cy + 96}" width="120" height="52" rx="14" fill="{CREAM}"/>\n'
    s += f'<text x="{cx + 150}" y="{cy + 132}" text-anchor="middle" fill="{HKU}" font-family="sans-serif" font-weight="700" font-size="34">HKU</text>\n'
    # feet
    s += f'<rect x="{cx - 180}" y="{cy + 170}" width="120" height="54" rx="26" fill="{CREAM}"/>\n'
    s += f'<rect x="{cx + 60}" y="{cy + 170}" width="120" height="54" rx="26" fill="{CREAM}"/>\n'
    s += f'<text x="{cx}" y="{h - 60}" text-anchor="middle" fill="{NEON}" font-family="monospace" font-size="34" opacity="0.85">HI</text>\n'
    return s + footer()


def interference(w: int = 1100, h: int = 1100) -> str:
    s = header(w, h, 4, "Interference")
    a = (w * 0.34, h * 0.5)
    b = (w * 0.66, h * 0.5)
    for i in range(1, 30):
        s += f'<circle cx="{a[0]}" cy="{a[1]}" r="{i * 22}" fill="none" stroke="{NEON}" stroke-width="1.5" opacity="{max(0.03, 0.30 - i * 0.009):.3f}"/>\n'
        s += f'<circle cx="{b[0]}" cy="{b[1]}" r="{i * 22}" fill="none" stroke="{CYAN}" stroke-width="1.5" opacity="{max(0.03, 0.30 - i * 0.009):.3f}"/>\n'
    s += f'<circle cx="{a[0]}" cy="{a[1]}" r="16" fill="{NEON}" filter="url(#glow)"/>\n'
    s += f'<circle cx="{b[0]}" cy="{b[1]}" r="16" fill="{CYAN}" filter="url(#glow)"/>\n'
    # interference fringes
    for i in range(-11, 12):
        x = w / 2 + i * 30
        op = 0.45 * (1 - abs(i) / 13)
        s += f'<ellipse cx="{x:.0f}" cy="{h / 2}" rx="9" ry="{h * 0.42:.0f}" fill="{NEON}" opacity="{max(op, 0):.3f}"/>\n'
    s += f'<text x="{w / 2}" y="{h - 66}" text-anchor="middle" fill="{CREAM}" font-family="monospace" font-size="32" opacity="0.9">amplitudes add, amplitudes cancel</text>\n'
    return s + footer()


def error_correction(w: int = 1200, h: int = 800) -> str:
    s = header(w, h, 5, "The surface code")
    cols, rows = 11, 7
    x0, y0 = 130, 150
    step = 92
    rnd = random.Random(5)
    errors = {(2, 1), (5, 3), (8, 2), (4, 5), (9, 4), (1, 4)}
    for r in range(rows):
        for c in range(cols):
            x = x0 + c * step
            y = y0 + r * step
            if (c + r) % 2 == 0:
                # data qubit
                is_err = (c, r) in errors
                fill = "#ff6b6b" if is_err else NEON
                s += f'<rect x="{x - 17}" y="{y - 17}" width="34" height="34" rx="7" fill="{fill}" opacity="{1 if is_err else 0.85}" filter="url(#glow)"/>\n'
            else:
                s += f'<circle cx="{x}" cy="{y}" r="15" fill="none" stroke="{CYAN}" stroke-width="3"/>\n'
    # links
    for r in range(rows):
        for c in range(cols):
            if (c + r) % 2 != 0:
                continue
            x = x0 + c * step
            y = y0 + r * step
            for dc, dr in ((1, 1), (1, -1), (-1, 1), (-1, -1)):
                nc, nr = c + dc, r + dr
                if 0 <= nc < cols and 0 <= nr < rows and (nc + nr) % 2 == 1:
                    s += f'<line x1="{x}" y1="{y}" x2="{x0 + nc * step}" y2="{y0 + nr * step}" stroke="{DIM}" stroke-width="1.4" opacity="0.7"/>\n'
    for _ in range(40):
        s += f'<circle cx="{rnd.uniform(0, w):.0f}" cy="{rnd.uniform(0, h):.0f}" r="{rnd.uniform(1, 2.2):.1f}" fill="{CREAM}" opacity="{rnd.uniform(0.1, 0.5):.2f}"/>\n'
    s += f'<text x="{x0}" y="{h - 70}" fill="{NEON}" font-family="monospace" font-size="30">&#9633; data qubit</text>\n'
    s += f'<text x="{x0 + 400}" y="{h - 70}" fill="{CYAN}" font-family="monospace" font-size="30">&#9675; measure qubit</text>\n'
    s += f'<text x="{x0 + 840}" y="{h - 70}" fill="#ff6b6b" font-family="monospace" font-size="30">&#9632; error</text>\n'
    return s + footer()


def photon_key(w: int = 900, h: int = 1100) -> str:
    s = header(w, h, 6, "Photons carrying a key")
    # beam
    s += f'<path d="M 80 {h * 0.2} L {w - 80} {h * 0.8}" stroke="url(#beam)" stroke-width="90" stroke-linecap="round" opacity="0.5"/>\n'
    s += f'<path d="M 80 {h * 0.2} L {w - 80} {h * 0.8}" stroke="{CYAN}" stroke-width="3" stroke-linecap="round" opacity="0.8"/>\n'
    angles = [0, 45, 90, 135, 0, 90, 45, 135]
    for i, deg in enumerate(angles):
        t = (i + 1) / (len(angles) + 1)
        x = 80 + (w - 160) * t
        y = h * 0.2 + (h * 0.6) * t
        rad = math.radians(deg)
        dx, dy = math.cos(rad) * 40, math.sin(rad) * 40
        s += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="30" fill="{BG}" stroke="{NEON}" stroke-width="3" filter="url(#glow)"/>\n'
        s += f'<line x1="{x - dx:.0f}" y1="{y - dy:.0f}" x2="{x + dx:.0f}" y2="{y + dy:.0f}" stroke="{CREAM}" stroke-width="4" stroke-linecap="round"/>\n'
        s += f'<text x="{x + 46:.0f}" y="{y + 8:.0f}" fill="{NEON}" font-family="monospace" font-size="24">{deg}&#176;</text>\n'
    s += f'<text x="80" y="{h * 0.2 - 40}" fill="{CYAN}" font-family="monospace" font-size="30">ALICE</text>\n'
    s += f'<text x="{w - 200}" y="{h * 0.8 + 70}" fill="{CYAN}" font-family="monospace" font-size="30">BOB</text>\n'
    s += f'<text x="{w / 2}" y="{h - 60}" text-anchor="middle" fill="{CREAM}" font-family="monospace" font-size="28" opacity="0.9">BB84 &#183; randomly chosen bases</text>\n'
    return s + footer()


PLATES = {
    "bloch-sphere.svg": bloch(),
    "entangled-pair.svg": entangled(),
    "qubi-crt.svg": qubi_crt(),
    "interference.svg": interference(),
    "error-correction.svg": error_correction(),
    "photon-key.svg": photon_key(),
}

for name, svg in PLATES.items():
    (OUT / name).write_text(svg, encoding="utf-8")
    print(f"wrote {OUT / name}  ({len(svg):,} bytes)")
