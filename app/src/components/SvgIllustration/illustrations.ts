type SvgRenderer = () => string;

// ─── Helper fragments ───

const eyes = (cx1: number, cy: number, cx2: number, r = 4) =>
  `<circle cx="${cx1}" cy="${cy}" r="${r}" fill="#fff" stroke="#2d1b4e" stroke-width="1.5"/>` +
  `<circle cx="${cx1 + 1}" cy="${cy}" r="${r * 0.45}" fill="#2d1b4e"/>` +
  `<circle cx="${cx1 + 2}" cy="${cy - 1}" r="${r * 0.18}" fill="#fff"/>` +
  `<circle cx="${cx2}" cy="${cy}" r="${r}" fill="#fff" stroke="#2d1b4e" stroke-width="1.5"/>` +
  `<circle cx="${cx2 + 1}" cy="${cy}" r="${r * 0.45}" fill="#2d1b4e"/>` +
  `<circle cx="${cx2 + 2}" cy="${cy - 1}" r="${r * 0.18}" fill="#fff"/>`;

const smile = (cx: number, cy: number, w = 6) =>
  `<path d="M${cx - w} ${cy} Q${cx} ${cy + w * 0.8} ${cx + w} ${cy}" fill="none" stroke="#2d1b4e" stroke-width="1.5" stroke-linecap="round"/>`;

const nose = (cx: number, cy: number) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="2.5" ry="2" fill="#2d1b4e" opacity="0.6"/>`;

const blush = (cx1: number, cy: number, cx2: number) =>
  `<circle cx="${cx1}" cy="${cy}" r="3" fill="#ffaaaa" opacity="0.4"/>` +
  `<circle cx="${cx2}" cy="${cy}" r="3" fill="#ffaaaa" opacity="0.4"/>`;

// ─── Animals ───

const animals: Record<string, SvgRenderer> = {
  dog: () =>
    `<defs><radialGradient id="dg"><stop offset="0%" stop-color="#f5c97a"/><stop offset="100%" stop-color="#d4a04a"/></radialGradient></defs>` +
    `<ellipse cx="32" cy="38" rx="18" ry="16" fill="url(#dg)" stroke="#8b6914" stroke-width="2"/>` +
    `<circle cx="32" cy="28" r="14" fill="url(#dg)" stroke="#8b6914" stroke-width="2"/>` +
    `<path d="M19 18 Q16 8 22 16" fill="#c48b2a" stroke="#8b6914" stroke-width="1.5"/>` +
    `<path d="M45 18 Q48 8 42 16" fill="#c48b2a" stroke="#8b6914" stroke-width="1.5"/>` +
    eyes(26, 26, 36) +
    `<ellipse cx="32" cy="32" rx="3" ry="2.5" fill="#2d1b4e"/>` +
    smile(32, 35) +
    `<path d="M32 37 Q32 42 35 40" fill="none" stroke="#c48b2a" stroke-width="1" stroke-linecap="round"/>` +
    blush(22, 31, 42),

  cat: () =>
    `<defs><radialGradient id="ct"><stop offset="0%" stop-color="#aaa"/><stop offset="100%" stop-color="#777"/></radialGradient></defs>` +
    `<ellipse cx="32" cy="40" rx="16" ry="14" fill="url(#ct)" stroke="#444" stroke-width="2"/>` +
    `<circle cx="32" cy="28" r="14" fill="url(#ct)" stroke="#444" stroke-width="2"/>` +
    `<polygon points="20,18 18,6 26,16" fill="#aaa" stroke="#444" stroke-width="1.5" stroke-linejoin="round"/>` +
    `<polygon points="44,18 46,6 38,16" fill="#aaa" stroke="#444" stroke-width="1.5" stroke-linejoin="round"/>` +
    `<polygon points="20,7 18,6 22,9" fill="#ffb6c1"/>` +
    `<polygon points="44,7 46,6 42,9" fill="#ffb6c1"/>` +
    eyes(26, 26, 36) +
    `<ellipse cx="32" cy="31" rx="2" ry="1.5" fill="#ffb6c1"/>` +
    `<line x1="10" y1="28" x2="22" y2="30" stroke="#666" stroke-width="0.8"/>` +
    `<line x1="10" y1="32" x2="22" y2="31" stroke="#666" stroke-width="0.8"/>` +
    `<line x1="54" y1="28" x2="42" y2="30" stroke="#666" stroke-width="0.8"/>` +
    `<line x1="54" y1="32" x2="42" y2="31" stroke="#666" stroke-width="0.8"/>` +
    smile(32, 34, 5) +
    blush(22, 31, 42),

  fish: () =>
    `<defs><linearGradient id="fsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#64b5f6"/><stop offset="100%" stop-color="#1e88e5"/></linearGradient></defs>` +
    `<ellipse cx="32" cy="32" rx="20" ry="12" fill="url(#fsh)" stroke="#0d47a1" stroke-width="2"/>` +
    `<polygon points="52,32 62,22 62,42" fill="#42a5f5" stroke="#0d47a1" stroke-width="1.5" stroke-linejoin="round"/>` +
    `<path d="M28 25 Q32 20 36 25" fill="#90caf9" stroke="#0d47a1" stroke-width="1"/>` +
    eyes(24, 30, 34, 3) +
    smile(29, 36, 4) +
    `<path d="M16 32 Q20 28 16 24" fill="none" stroke="#0d47a1" stroke-width="1" opacity="0.4"/>`,

  bird: () =>
    `<defs><radialGradient id="brd"><stop offset="0%" stop-color="#ef5350"/><stop offset="100%" stop-color="#c62828"/></radialGradient></defs>` +
    `<ellipse cx="32" cy="36" rx="14" ry="12" fill="url(#brd)" stroke="#8b1a1a" stroke-width="2"/>` +
    `<circle cx="32" cy="26" r="11" fill="url(#brd)" stroke="#8b1a1a" stroke-width="2"/>` +
    `<path d="M30 24 L26 20 L32 22 L38 20 L34 24" fill="#ff8a80" stroke="#8b1a1a" stroke-width="1"/>` +
    eyes(27, 25, 36, 3) +
    `<polygon points="32,29 28,31 32,32 36,31" fill="#ffa726" stroke="#e65100" stroke-width="1"/>` +
    `<path d="M18 38 Q10 32 14 44" fill="#ff7043" stroke="#8b1a1a" stroke-width="1.5"/>` +
    `<path d="M46 38 Q54 32 50 44" fill="#ff7043" stroke="#8b1a1a" stroke-width="1.5"/>`,

  horse: () =>
    `<defs><radialGradient id="hrs"><stop offset="0%" stop-color="#a1887f"/><stop offset="100%" stop-color="#6d4c41"/></radialGradient></defs>` +
    `<ellipse cx="32" cy="40" rx="18" ry="13" fill="url(#hrs)" stroke="#3e2723" stroke-width="2"/>` +
    `<ellipse cx="28" cy="26" rx="12" ry="14" fill="url(#hrs)" stroke="#3e2723" stroke-width="2"/>` +
    `<path d="M20 14 Q18 6 22 12" fill="#6d4c41" stroke="#3e2723" stroke-width="1.2"/>` +
    `<path d="M36 14 Q38 6 34 12" fill="#6d4c41" stroke="#3e2723" stroke-width="1.2"/>` +
    `<path d="M34 12 Q40 8 38 16 Q36 20 34 16" fill="#5d4037" stroke="none"/>` +
    eyes(22, 22, 32, 3) +
    `<ellipse cx="28" cy="32" rx="6" ry="4" fill="#8d6e63" stroke="#3e2723" stroke-width="1"/>` +
    `<circle cx="26" cy="31" r="1" fill="#3e2723"/>` +
    `<circle cx="30" cy="31" r="1" fill="#3e2723"/>`,

  cow: () =>
    `<defs><radialGradient id="cw"><stop offset="0%" stop-color="#fafafa"/><stop offset="100%" stop-color="#e0e0e0"/></radialGradient></defs>` +
    `<ellipse cx="32" cy="38" rx="18" ry="14" fill="url(#cw)" stroke="#555" stroke-width="2"/>` +
    `<circle cx="32" cy="26" r="13" fill="url(#cw)" stroke="#555" stroke-width="2"/>` +
    `<ellipse cx="24" cy="16" rx="4" ry="6" fill="#fafafa" stroke="#555" stroke-width="1.5" transform="rotate(-20,24,16)"/>` +
    `<ellipse cx="40" cy="16" rx="4" ry="6" fill="#fafafa" stroke="#555" stroke-width="1.5" transform="rotate(20,40,16)"/>` +
    `<ellipse cx="22" cy="34" rx="5" ry="4" fill="#333" opacity="0.7"/>` +
    `<ellipse cx="42" cy="36" rx="4" ry="3" fill="#333" opacity="0.7"/>` +
    eyes(26, 24, 36, 3.5) +
    `<ellipse cx="32" cy="32" rx="7" ry="4.5" fill="#ffcc80" stroke="#bf8c40" stroke-width="1.2"/>` +
    `<circle cx="29" cy="32" r="1.2" fill="#6d4c41"/>` +
    `<circle cx="35" cy="32" r="1.2" fill="#6d4c41"/>`,

  pig: () =>
    `<defs><radialGradient id="pg"><stop offset="0%" stop-color="#f8bbd0"/><stop offset="100%" stop-color="#e91e90"/></radialGradient></defs>` +
    `<ellipse cx="32" cy="38" rx="18" ry="14" fill="url(#pg)" stroke="#ad1457" stroke-width="2"/>` +
    `<circle cx="32" cy="26" r="14" fill="url(#pg)" stroke="#ad1457" stroke-width="2"/>` +
    `<path d="M20 18 Q16 12 22 18" fill="#f48fb1" stroke="#ad1457" stroke-width="1.2"/>` +
    `<path d="M44 18 Q48 12 42 18" fill="#f48fb1" stroke="#ad1457" stroke-width="1.2"/>` +
    eyes(25, 24, 37, 3.5) +
    `<ellipse cx="32" cy="31" rx="6" ry="4.5" fill="#f48fb1" stroke="#ad1457" stroke-width="1.5"/>` +
    `<circle cx="29" cy="31" r="1.5" fill="#ad1457"/>` +
    `<circle cx="35" cy="31" r="1.5" fill="#ad1457"/>` +
    smile(32, 37, 5) + blush(21, 29, 43),

  sheep: () =>
    `<defs><radialGradient id="shp"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#ddd"/></radialGradient></defs>` +
    `<circle cx="26" cy="38" r="8" fill="url(#shp)" stroke="#999" stroke-width="1"/>` +
    `<circle cx="38" cy="38" r="8" fill="url(#shp)" stroke="#999" stroke-width="1"/>` +
    `<circle cx="32" cy="34" r="10" fill="url(#shp)" stroke="#999" stroke-width="1"/>` +
    `<circle cx="24" cy="30" r="7" fill="url(#shp)" stroke="#999" stroke-width="1"/>` +
    `<circle cx="40" cy="30" r="7" fill="url(#shp)" stroke="#999" stroke-width="1"/>` +
    `<circle cx="32" cy="26" r="10" fill="#555" stroke="#333" stroke-width="1.5"/>` +
    eyes(27, 24, 36, 3) +
    smile(32, 30, 4) +
    `<line x1="26" y1="50" x2="26" y2="56" stroke="#555" stroke-width="2.5" stroke-linecap="round"/>` +
    `<line x1="38" y1="50" x2="38" y2="56" stroke="#555" stroke-width="2.5" stroke-linecap="round"/>`,

  frog: () =>
    `<defs><radialGradient id="frg"><stop offset="0%" stop-color="#81c784"/><stop offset="100%" stop-color="#388e3c"/></radialGradient></defs>` +
    `<ellipse cx="32" cy="40" rx="20" ry="12" fill="url(#frg)" stroke="#1b5e20" stroke-width="2"/>` +
    `<circle cx="22" cy="24" r="8" fill="url(#frg)" stroke="#1b5e20" stroke-width="2"/>` +
    `<circle cx="42" cy="24" r="8" fill="url(#frg)" stroke="#1b5e20" stroke-width="2"/>` +
    `<circle cx="22" cy="22" r="5" fill="#fff" stroke="#1b5e20" stroke-width="1.5"/>` +
    `<circle cx="23" cy="22" r="2.5" fill="#2d1b4e"/>` +
    `<circle cx="24" cy="21" r="0.8" fill="#fff"/>` +
    `<circle cx="42" cy="22" r="5" fill="#fff" stroke="#1b5e20" stroke-width="1.5"/>` +
    `<circle cx="43" cy="22" r="2.5" fill="#2d1b4e"/>` +
    `<circle cx="44" cy="21" r="0.8" fill="#fff"/>` +
    `<path d="M22 42 Q32 50 42 42" fill="none" stroke="#1b5e20" stroke-width="2" stroke-linecap="round"/>` +
    blush(18, 38, 46),

  butterfly: () =>
    `<defs>` +
    `<radialGradient id="bfw1"><stop offset="0%" stop-color="#ce93d8"/><stop offset="100%" stop-color="#7b1fa2"/></radialGradient>` +
    `<radialGradient id="bfw2"><stop offset="0%" stop-color="#f48fb1"/><stop offset="100%" stop-color="#c2185b"/></radialGradient>` +
    `</defs>` +
    `<ellipse cx="20" cy="24" rx="12" ry="10" fill="url(#bfw1)" stroke="#4a148c" stroke-width="1.5"/>` +
    `<ellipse cx="44" cy="24" rx="12" ry="10" fill="url(#bfw1)" stroke="#4a148c" stroke-width="1.5"/>` +
    `<ellipse cx="20" cy="40" rx="9" ry="8" fill="url(#bfw2)" stroke="#880e4f" stroke-width="1.5"/>` +
    `<ellipse cx="44" cy="40" rx="9" ry="8" fill="url(#bfw2)" stroke="#880e4f" stroke-width="1.5"/>` +
    `<circle cx="20" cy="24" r="3" fill="#fff" opacity="0.5"/>` +
    `<circle cx="44" cy="24" r="3" fill="#fff" opacity="0.5"/>` +
    `<ellipse cx="32" cy="34" rx="3" ry="12" fill="#5d4037" stroke="#3e2723" stroke-width="1.5"/>` +
    `<circle cx="32" cy="20" r="4" fill="#5d4037" stroke="#3e2723" stroke-width="1.5"/>` +
    `<circle cx="31" cy="19" r="1.8" fill="#fff"/>` +
    `<circle cx="31.5" cy="19" r="0.9" fill="#2d1b4e"/>` +
    `<circle cx="34" cy="19" r="1.8" fill="#fff"/>` +
    `<circle cx="34.5" cy="19" r="0.9" fill="#2d1b4e"/>` +
    `<path d="M30 16 Q26 8 28 12" stroke="#5d4037" stroke-width="1.2" fill="none"/>` +
    `<path d="M34 16 Q38 8 36 12" stroke="#5d4037" stroke-width="1.2" fill="none"/>` +
    `<circle cx="26" cy="9" r="1.5" fill="#ce93d8"/>` +
    `<circle cx="38" cy="9" r="1.5" fill="#f48fb1"/>`,

  lion: () =>
    `<defs><radialGradient id="ln"><stop offset="0%" stop-color="#ffcc02"/><stop offset="100%" stop-color="#e6a800"/></radialGradient></defs>` +
    `<circle cx="32" cy="32" r="20" fill="#e65100" stroke="#bf360c" stroke-width="1"/>` +
    `<path d="M12 32 Q8 24 16 20 Q12 14 20 14 Q20 8 28 12 Q30 6 36 12 Q42 8 44 14 Q50 14 52 20 Q56 24 52 32 Q56 40 52 44 Q50 50 44 50 Q42 56 36 52 Q30 58 28 52 Q20 56 20 50 Q12 50 12 44 Q8 40 12 32Z" fill="#e65100"/>` +
    `<circle cx="32" cy="34" r="14" fill="url(#ln)" stroke="#bf8f00" stroke-width="1.5"/>` +
    eyes(26, 30, 36, 3.5) +
    `<ellipse cx="32" cy="36" rx="3" ry="2" fill="#2d1b4e"/>` +
    smile(32, 39, 5) +
    blush(22, 35, 42),

  elephant: () =>
    `<defs><radialGradient id="elt"><stop offset="0%" stop-color="#b0bec5"/><stop offset="100%" stop-color="#78909c"/></radialGradient></defs>` +
    `<ellipse cx="32" cy="38" rx="20" ry="14" fill="url(#elt)" stroke="#37474f" stroke-width="2"/>` +
    `<circle cx="32" cy="26" r="16" fill="url(#elt)" stroke="#37474f" stroke-width="2"/>` +
    `<ellipse cx="14" cy="28" rx="8" ry="10" fill="#90a4ae" stroke="#37474f" stroke-width="1.5"/>` +
    `<ellipse cx="14" cy="28" rx="5" ry="7" fill="#cfd8dc" opacity="0.5"/>` +
    `<ellipse cx="50" cy="28" rx="8" ry="10" fill="#90a4ae" stroke="#37474f" stroke-width="1.5"/>` +
    `<ellipse cx="50" cy="28" rx="5" ry="7" fill="#cfd8dc" opacity="0.5"/>` +
    eyes(26, 24, 38, 3.5) +
    `<path d="M32 32 Q32 42 28 50 Q26 54 30 54 Q34 54 34 50 Q34 42 32 32Z" fill="#90a4ae" stroke="#37474f" stroke-width="1.5"/>`,
};

// ─── Food ───

const food: Record<string, SvgRenderer> = {
  apple: () =>
    `<defs><radialGradient id="apl" cx="40%" cy="30%"><stop offset="0%" stop-color="#ff5252"/><stop offset="100%" stop-color="#b71c1c"/></radialGradient></defs>` +
    `<path d="M32 14 Q28 8 32 6" fill="none" stroke="#5d4037" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="M34 12 Q38 10 36 8" fill="#4caf50" stroke="#2e7d32" stroke-width="1"/>` +
    `<ellipse cx="32" cy="34" rx="16" ry="18" fill="url(#apl)" stroke="#8b0000" stroke-width="2"/>` +
    `<path d="M32 16 Q28 20 32 20 Q36 20 32 16" fill="#b71c1c"/>` +
    `<ellipse cx="26" cy="30" rx="3" ry="2" fill="#fff" opacity="0.3"/>` +
    eyes(26, 32, 38, 2.5) + smile(32, 38, 4),

  banana: () =>
    `<defs><linearGradient id="bna" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fff176"/><stop offset="100%" stop-color="#f9a825"/></linearGradient></defs>` +
    `<path d="M20 48 Q14 36 18 24 Q22 12 32 10 Q36 10 38 14 Q34 16 30 26 Q26 38 30 48 Z" fill="url(#bna)" stroke="#f57f17" stroke-width="2"/>` +
    `<path d="M32 10 Q34 8 36 10" fill="#8d6e63" stroke="#5d4037" stroke-width="1.5"/>` +
    eyes(24, 28, 30, 2) + smile(27, 33, 3),

  orange: () =>
    `<defs><radialGradient id="orn" cx="35%" cy="35%"><stop offset="0%" stop-color="#ffb74d"/><stop offset="100%" stop-color="#e65100"/></radialGradient></defs>` +
    `<circle cx="32" cy="34" r="17" fill="url(#orn)" stroke="#bf360c" stroke-width="2"/>` +
    `<path d="M32 17 Q30 12 32 10" fill="none" stroke="#33691e" stroke-width="2" stroke-linecap="round"/>` +
    `<ellipse cx="32" cy="14" rx="4" ry="2.5" fill="#66bb6a" stroke="#2e7d32" stroke-width="1"/>` +
    eyes(26, 32, 38, 2.5) + smile(32, 38, 4),

  grape: () =>
    `<defs><radialGradient id="grp"><stop offset="0%" stop-color="#ce93d8"/><stop offset="100%" stop-color="#6a1b9a"/></radialGradient></defs>` +
    `<path d="M32 10 Q30 6 32 4" fill="none" stroke="#33691e" stroke-width="1.5" stroke-linecap="round"/>` +
    `<circle cx="26" cy="22" r="7" fill="url(#grp)" stroke="#4a148c" stroke-width="1.2"/>` +
    `<circle cx="38" cy="22" r="7" fill="url(#grp)" stroke="#4a148c" stroke-width="1.2"/>` +
    `<circle cx="32" cy="20" r="7" fill="url(#grp)" stroke="#4a148c" stroke-width="1.2"/>` +
    `<circle cx="24" cy="33" r="7" fill="url(#grp)" stroke="#4a148c" stroke-width="1.2"/>` +
    `<circle cx="40" cy="33" r="7" fill="url(#grp)" stroke="#4a148c" stroke-width="1.2"/>` +
    `<circle cx="32" cy="31" r="7" fill="url(#grp)" stroke="#4a148c" stroke-width="1.2"/>` +
    `<circle cx="32" cy="42" r="7" fill="url(#grp)" stroke="#4a148c" stroke-width="1.2"/>` +
    `<circle cx="28" cy="20" r="1.5" fill="#fff" opacity="0.4"/>` +
    `<circle cx="34" cy="18" r="1.5" fill="#fff" opacity="0.4"/>`,

  carrot: () =>
    `<defs><linearGradient id="crt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff9800"/><stop offset="100%" stop-color="#e65100"/></linearGradient></defs>` +
    `<path d="M28 18 Q30 12 26 6" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="M32 18 Q32 10 34 4" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="M36 18 Q36 12 40 8" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="M20 20 Q32 22 44 20 Q36 56 32 58 Q28 56 20 20Z" fill="url(#crt)" stroke="#bf360c" stroke-width="2"/>` +
    `<line x1="28" y1="30" x2="36" y2="29" stroke="#e65100" stroke-width="0.8" opacity="0.5"/>` +
    `<line x1="26" y1="38" x2="36" y2="37" stroke="#e65100" stroke-width="0.8" opacity="0.5"/>` +
    eyes(28, 28, 36, 2) + smile(32, 34, 3),

  tomato: () =>
    `<defs><radialGradient id="tmt" cx="35%" cy="35%"><stop offset="0%" stop-color="#ef5350"/><stop offset="100%" stop-color="#b71c1c"/></radialGradient></defs>` +
    `<circle cx="32" cy="34" r="17" fill="url(#tmt)" stroke="#8b0000" stroke-width="2"/>` +
    `<path d="M24 18 Q28 14 32 18 Q36 14 40 18" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5"/>` +
    `<ellipse cx="26" cy="30" rx="2.5" ry="1.5" fill="#fff" opacity="0.25"/>` +
    eyes(26, 32, 38, 2.5) + smile(32, 38, 4),

  milk: () =>
    `<rect x="18" y="14" width="28" height="38" rx="4" fill="#fff" stroke="#90a4ae" stroke-width="2"/>` +
    `<rect x="22" y="8" width="20" height="10" rx="2" fill="#e3f2fd" stroke="#90a4ae" stroke-width="1.5"/>` +
    `<rect x="22" y="28" width="20" height="14" rx="2" fill="#42a5f5"/>` +
    `<text x="32" y="38" font-size="8" font-weight="700" fill="#fff" text-anchor="middle" font-family="sans-serif">MILK</text>` +
    `<path d="M28 12 Q32 10 36 12" fill="none" stroke="#90a4ae" stroke-width="1.5" stroke-linecap="round"/>`,

  bread: () =>
    `<defs><radialGradient id="brd2" cx="40%" cy="30%"><stop offset="0%" stop-color="#ffe0b2"/><stop offset="100%" stop-color="#e6a04a"/></radialGradient></defs>` +
    `<path d="M12 38 Q12 20 32 16 Q52 20 52 38 L52 48 Q52 52 48 52 L16 52 Q12 52 12 48 Z" fill="url(#brd2)" stroke="#bf8a30" stroke-width="2"/>` +
    `<path d="M14 38 Q14 22 32 18 Q50 22 50 38" fill="none" stroke="#d4a04a" stroke-width="1" opacity="0.5"/>` +
    `<ellipse cx="24" cy="26" rx="2" ry="1" fill="#d4a04a" opacity="0.4"/>` +
    `<ellipse cx="36" cy="24" rx="1.5" ry="1" fill="#d4a04a" opacity="0.4"/>` +
    `<ellipse cx="40" cy="30" rx="2" ry="1" fill="#d4a04a" opacity="0.4"/>`,

  cheese: () =>
    `<defs><linearGradient id="chs"><stop offset="0%" stop-color="#fff176"/><stop offset="100%" stop-color="#fbc02d"/></linearGradient></defs>` +
    `<polygon points="8,50 56,50 56,30 32,16" fill="url(#chs)" stroke="#f57f17" stroke-width="2" stroke-linejoin="round"/>` +
    `<circle cx="28" cy="38" r="4" fill="#f57f17" opacity="0.5"/>` +
    `<circle cx="42" cy="42" r="3" fill="#f57f17" opacity="0.5"/>` +
    `<circle cx="36" cy="34" r="2" fill="#f57f17" opacity="0.5"/>` +
    `<circle cx="46" cy="36" r="2.5" fill="#f57f17" opacity="0.4"/>`,

  egg: () =>
    `<defs><radialGradient id="eg" cx="45%" cy="40%"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#ede7d9"/></radialGradient></defs>` +
    `<ellipse cx="32" cy="34" rx="16" ry="20" fill="url(#eg)" stroke="#bcaaa4" stroke-width="2"/>` +
    `<ellipse cx="28" cy="28" rx="4" ry="2" fill="#fff" opacity="0.5"/>` +
    eyes(27, 32, 37, 2) + smile(32, 38, 3) + blush(23, 36, 41),

  rice: () =>
    `<path d="M14 30 Q14 24 24 22 L40 22 Q50 24 50 30 L48 50 Q48 54 44 54 L20 54 Q16 54 16 50 Z" fill="#fff" stroke="#bdbdbd" stroke-width="2"/>` +
    `<ellipse cx="28" cy="18" rx="4" ry="2" fill="#fff" stroke="#ccc" stroke-width="0.8"/>` +
    `<ellipse cx="36" cy="16" rx="4" ry="2" fill="#fff" stroke="#ccc" stroke-width="0.8"/>` +
    `<ellipse cx="32" cy="14" rx="4" ry="2" fill="#fff" stroke="#ccc" stroke-width="0.8"/>` +
    `<ellipse cx="24" cy="14" rx="3" ry="2" fill="#fff" stroke="#ccc" stroke-width="0.8"/>` +
    `<ellipse cx="40" cy="14" rx="3" ry="2" fill="#fff" stroke="#ccc" stroke-width="0.8"/>` +
    `<rect x="22" y="36" width="20" height="2" rx="1" fill="#e0e0e0"/>` +
    `<text x="32" y="47" font-size="7" font-weight="700" fill="#9e9e9e" text-anchor="middle" font-family="sans-serif">RICE</text>`,

  water: () =>
    `<defs><linearGradient id="wtr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e3f2fd"/><stop offset="100%" stop-color="#42a5f5"/></linearGradient></defs>` +
    `<path d="M20 12 L16 48 Q16 54 22 54 L42 54 Q48 54 48 48 L44 12 Z" fill="url(#wtr)" stroke="#1565c0" stroke-width="2"/>` +
    `<path d="M18 30 Q24 26 32 30 Q40 34 46 30" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.5"/>` +
    `<rect x="20" y="12" width="24" height="4" rx="2" fill="#90caf9" stroke="#1565c0" stroke-width="1.5"/>` +
    `<ellipse cx="28" cy="24" rx="2" ry="1" fill="#fff" opacity="0.4"/>`,
};

// ─── Instruments ───

const instruments: Record<string, SvgRenderer> = {
  piano: () =>
    `<rect x="8" y="16" width="48" height="36" rx="4" fill="#1a1a2e" stroke="#333" stroke-width="2"/>` +
    `<rect x="12" y="20" width="6" height="26" rx="1" fill="#fff" stroke="#bbb" stroke-width="0.5"/>` +
    `<rect x="19" y="20" width="6" height="26" rx="1" fill="#fff" stroke="#bbb" stroke-width="0.5"/>` +
    `<rect x="26" y="20" width="6" height="26" rx="1" fill="#fff" stroke="#bbb" stroke-width="0.5"/>` +
    `<rect x="33" y="20" width="6" height="26" rx="1" fill="#fff" stroke="#bbb" stroke-width="0.5"/>` +
    `<rect x="40" y="20" width="6" height="26" rx="1" fill="#fff" stroke="#bbb" stroke-width="0.5"/>` +
    `<rect x="47" y="20" width="5" height="26" rx="1" fill="#fff" stroke="#bbb" stroke-width="0.5"/>` +
    `<rect x="16" y="20" width="4" height="16" rx="1" fill="#1a1a2e"/>` +
    `<rect x="23" y="20" width="4" height="16" rx="1" fill="#1a1a2e"/>` +
    `<rect x="37" y="20" width="4" height="16" rx="1" fill="#1a1a2e"/>` +
    `<rect x="44" y="20" width="4" height="16" rx="1" fill="#1a1a2e"/>`,

  guitar: () =>
    `<defs><linearGradient id="gtr"><stop offset="0%" stop-color="#e6a04a"/><stop offset="100%" stop-color="#8d6e63"/></linearGradient></defs>` +
    `<rect x="30" y="4" width="4" height="28" rx="2" fill="#5d4037" stroke="#3e2723" stroke-width="1"/>` +
    `<rect x="26" y="4" width="12" height="6" rx="2" fill="#3e2723"/>` +
    `<circle cx="28" cy="7" r="1" fill="#fbc02d"/>` +
    `<circle cx="36" cy="7" r="1" fill="#fbc02d"/>` +
    `<ellipse cx="32" cy="42" rx="16" ry="14" fill="url(#gtr)" stroke="#5d4037" stroke-width="2"/>` +
    `<ellipse cx="32" cy="34" rx="8" ry="6" fill="url(#gtr)" stroke="#5d4037" stroke-width="1.5"/>` +
    `<circle cx="32" cy="42" r="5" fill="#3e2723" stroke="#2d1b07" stroke-width="1"/>` +
    `<line x1="30" y1="10" x2="30" y2="42" stroke="#bdbdbd" stroke-width="0.5"/>` +
    `<line x1="32" y1="10" x2="32" y2="42" stroke="#bdbdbd" stroke-width="0.5"/>` +
    `<line x1="34" y1="10" x2="34" y2="42" stroke="#bdbdbd" stroke-width="0.5"/>`,

  violin: () =>
    `<defs><linearGradient id="vln"><stop offset="0%" stop-color="#d4a04a"/><stop offset="100%" stop-color="#8d5524"/></linearGradient></defs>` +
    `<rect x="31" y="2" width="2" height="30" fill="#5d4037"/>` +
    `<rect x="28" y="2" width="8" height="4" rx="1" fill="#3e2723"/>` +
    `<ellipse cx="32" cy="40" rx="14" ry="12" fill="url(#vln)" stroke="#5d4037" stroke-width="2"/>` +
    `<ellipse cx="32" cy="32" rx="8" ry="5" fill="url(#vln)" stroke="#5d4037" stroke-width="1.5"/>` +
    `<rect x="29" y="38" width="2" height="4" rx="0.5" fill="#3e2723"/>` +
    `<rect x="33" y="38" width="2" height="4" rx="0.5" fill="#3e2723"/>` +
    `<line x1="31" y1="8" x2="31" y2="40" stroke="#bdbdbd" stroke-width="0.4"/>` +
    `<line x1="33" y1="8" x2="33" y2="40" stroke="#bdbdbd" stroke-width="0.4"/>`,

  drum: () =>
    `<defs><linearGradient id="drm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ef5350"/><stop offset="100%" stop-color="#b71c1c"/></linearGradient></defs>` +
    `<ellipse cx="32" cy="46" rx="20" ry="8" fill="#c62828" stroke="#8b0000" stroke-width="1.5"/>` +
    `<rect x="12" y="22" width="40" height="24" fill="url(#drm)" stroke="#8b0000" stroke-width="2"/>` +
    `<ellipse cx="32" cy="22" rx="20" ry="8" fill="#ffcdd2" stroke="#8b0000" stroke-width="2"/>` +
    `<line x1="16" y1="26" x2="24" y2="44" stroke="#ffd54f" stroke-width="1.5"/>` +
    `<line x1="48" y1="26" x2="40" y2="44" stroke="#ffd54f" stroke-width="1.5"/>` +
    `<line x1="24" y1="26" x2="32" y2="44" stroke="#ffd54f" stroke-width="1.5"/>` +
    `<line x1="40" y1="26" x2="32" y2="44" stroke="#ffd54f" stroke-width="1.5"/>`,

  flute: () =>
    `<defs><linearGradient id="flt"><stop offset="0%" stop-color="#e0e0e0"/><stop offset="100%" stop-color="#9e9e9e"/></linearGradient></defs>` +
    `<rect x="6" y="28" width="52" height="8" rx="4" fill="url(#flt)" stroke="#616161" stroke-width="1.5"/>` +
    `<circle cx="18" cy="32" r="2" fill="#424242"/>` +
    `<circle cx="26" cy="32" r="2" fill="#424242"/>` +
    `<circle cx="34" cy="32" r="2" fill="#424242"/>` +
    `<circle cx="42" cy="32" r="2" fill="#424242"/>` +
    `<circle cx="50" cy="32" r="2" fill="#424242"/>` +
    `<ellipse cx="8" cy="32" rx="3" ry="5" fill="#bdbdbd" stroke="#616161" stroke-width="1"/>`,

  trumpet: () =>
    `<defs><linearGradient id="trp"><stop offset="0%" stop-color="#ffd54f"/><stop offset="100%" stop-color="#f9a825"/></linearGradient></defs>` +
    `<rect x="10" y="28" width="30" height="8" rx="4" fill="url(#trp)" stroke="#f57f17" stroke-width="1.5"/>` +
    `<ellipse cx="52" cy="32" rx="10" ry="14" fill="url(#trp)" stroke="#f57f17" stroke-width="2"/>` +
    `<ellipse cx="52" cy="32" rx="7" ry="10" fill="#f57f17" opacity="0.3"/>` +
    `<rect x="20" y="20" width="3" height="10" rx="1.5" fill="#f9a825" stroke="#f57f17" stroke-width="1"/>` +
    `<rect x="27" y="18" width="3" height="12" rx="1.5" fill="#f9a825" stroke="#f57f17" stroke-width="1"/>` +
    `<rect x="34" y="20" width="3" height="10" rx="1.5" fill="#f9a825" stroke="#f57f17" stroke-width="1"/>`,

  harp: () =>
    `<defs><linearGradient id="hrp"><stop offset="0%" stop-color="#ffd54f"/><stop offset="100%" stop-color="#c49000"/></linearGradient></defs>` +
    `<path d="M16 52 L16 16 Q16 4 32 4 Q48 4 48 16" fill="none" stroke="url(#hrp)" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M16 52 L48 36" fill="none" stroke="url(#hrp)" stroke-width="3" stroke-linecap="round"/>` +
    `<line x1="18" y1="18" x2="22" y2="48" stroke="#bdbdbd" stroke-width="0.6"/>` +
    `<line x1="22" y1="12" x2="28" y2="46" stroke="#bdbdbd" stroke-width="0.6"/>` +
    `<line x1="28" y1="8" x2="34" y2="44" stroke="#bdbdbd" stroke-width="0.6"/>` +
    `<line x1="34" y1="6" x2="38" y2="42" stroke="#bdbdbd" stroke-width="0.6"/>` +
    `<line x1="40" y1="8" x2="42" y2="40" stroke="#bdbdbd" stroke-width="0.6"/>` +
    `<line x1="46" y1="14" x2="46" y2="38" stroke="#bdbdbd" stroke-width="0.6"/>`,

  xylophone: () =>
    `<rect x="8" y="20" width="8" height="36" rx="2" fill="#ef5350" stroke="#b71c1c" stroke-width="1"/>` +
    `<rect x="17" y="22" width="8" height="32" rx="2" fill="#ff9800" stroke="#e65100" stroke-width="1"/>` +
    `<rect x="26" y="24" width="8" height="28" rx="2" fill="#fdd835" stroke="#f9a825" stroke-width="1"/>` +
    `<rect x="35" y="26" width="8" height="24" rx="2" fill="#66bb6a" stroke="#2e7d32" stroke-width="1"/>` +
    `<rect x="44" y="28" width="8" height="20" rx="2" fill="#42a5f5" stroke="#1565c0" stroke-width="1"/>` +
    `<line x1="6" y1="56" x2="54" y2="56" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/>` +
    `<line x1="6" y1="20" x2="54" y2="28" stroke="#8d6e63" stroke-width="2" stroke-linecap="round"/>`,

  maracas: () =>
    `<defs><radialGradient id="mrc"><stop offset="0%" stop-color="#66bb6a"/><stop offset="100%" stop-color="#2e7d32"/></radialGradient></defs>` +
    `<ellipse cx="22" cy="20" rx="10" ry="12" fill="url(#mrc)" stroke="#1b5e20" stroke-width="2"/>` +
    `<line x1="22" y1="32" x2="22" y2="56" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/>` +
    `<circle cx="18" cy="18" r="1.5" fill="#a5d6a7"/>` +
    `<circle cx="26" cy="16" r="1.5" fill="#fdd835"/>` +
    `<circle cx="22" cy="22" r="1.5" fill="#ef5350"/>` +
    `<ellipse cx="44" cy="22" rx="10" ry="12" fill="#ef5350" stroke="#b71c1c" stroke-width="2"/>` +
    `<line x1="44" y1="34" x2="44" y2="56" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/>` +
    `<circle cx="40" cy="20" r="1.5" fill="#66bb6a"/>` +
    `<circle cx="48" cy="18" r="1.5" fill="#fdd835"/>` +
    `<circle cx="44" cy="24" r="1.5" fill="#42a5f5"/>`,

  tambourine: () =>
    `<defs><radialGradient id="tmb"><stop offset="0%" stop-color="#ffe0b2"/><stop offset="100%" stop-color="#e6a04a"/></radialGradient></defs>` +
    `<circle cx="32" cy="32" r="20" fill="url(#tmb)" stroke="#bf8a30" stroke-width="3"/>` +
    `<circle cx="32" cy="32" r="14" fill="#d4a04a" opacity="0.3"/>` +
    `<circle cx="16" cy="22" r="3" fill="#ffd54f" stroke="#f9a825" stroke-width="1"/>` +
    `<circle cx="48" cy="22" r="3" fill="#ffd54f" stroke="#f9a825" stroke-width="1"/>` +
    `<circle cx="16" cy="42" r="3" fill="#ffd54f" stroke="#f9a825" stroke-width="1"/>` +
    `<circle cx="48" cy="42" r="3" fill="#ffd54f" stroke="#f9a825" stroke-width="1"/>` +
    `<circle cx="12" cy="32" r="3" fill="#ffd54f" stroke="#f9a825" stroke-width="1"/>` +
    `<circle cx="52" cy="32" r="3" fill="#ffd54f" stroke="#f9a825" stroke-width="1"/>`,
};

// ─── Colors (expressive circles) ───

const colorDefs: Record<string, { fill: string; stroke: string }> = {
  red: { fill: '#ef5350', stroke: '#b71c1c' },
  blue: { fill: '#42a5f5', stroke: '#1565c0' },
  green: { fill: '#66bb6a', stroke: '#2e7d32' },
  yellow: { fill: '#fdd835', stroke: '#f9a825' },
  orange: { fill: '#ffa726', stroke: '#e65100' },
  purple: { fill: '#ab47bc', stroke: '#6a1b9a' },
  pink: { fill: '#f48fb1', stroke: '#c2185b' },
  brown: { fill: '#8d6e63', stroke: '#4e342e' },
  white: { fill: '#fafafa', stroke: '#bdbdbd' },
  black: { fill: '#424242', stroke: '#212121' },
};

function colorBlob(name: string): string {
  const c = colorDefs[name];
  if (!c) return '';
  const eyeFill = name === 'black' || name === 'brown' ? '#fff' : '#2d1b4e';
  const pupilFill = name === 'white' ? '#2d1b4e' : '#fff';
  return (
    `<circle cx="32" cy="32" r="22" fill="${c.fill}" stroke="${c.stroke}" stroke-width="2.5"/>` +
    `<circle cx="26" cy="28" r="4" fill="#fff" stroke="${c.stroke}" stroke-width="1"/>` +
    `<circle cx="27" cy="28" r="2" fill="${eyeFill}"/>` +
    `<circle cx="28" cy="27" r="0.7" fill="${pupilFill}"/>` +
    `<circle cx="38" cy="28" r="4" fill="#fff" stroke="${c.stroke}" stroke-width="1"/>` +
    `<circle cx="39" cy="28" r="2" fill="${eyeFill}"/>` +
    `<circle cx="40" cy="27" r="0.7" fill="${pupilFill}"/>` +
    `<path d="M26 38 Q32 44 38 38" fill="none" stroke="${c.stroke}" stroke-width="2" stroke-linecap="round"/>` +
    `<circle cx="22" cy="36" r="3" fill="${c.stroke}" opacity="0.15"/>`+
    `<circle cx="42" cy="36" r="3" fill="${c.stroke}" opacity="0.15"/>`
  );
}

// ─── Letters & Numbers (bubble style) ───

const LETTER_COLORS = [
  '#ef5350','#ff7043','#ffa726','#fdd835','#66bb6a','#26a69a',
  '#42a5f5','#5c6bc0','#ab47bc','#ec407a','#8d6e63','#78909c',
  '#f06292',
];

function bubbleLetter(ch: string, palette: string[]): string {
  const idx = ch.charCodeAt(0) % palette.length;
  const bg = palette[idx];
  return (
    `<circle cx="32" cy="32" r="26" fill="${bg}" opacity="0.9"/>` +
    `<circle cx="32" cy="32" r="22" fill="${bg}"/>` +
    `<circle cx="24" cy="22" r="6" fill="#fff" opacity="0.15"/>` +
    `<text x="32" y="42" font-size="30" font-weight="800" fill="#fff" text-anchor="middle" font-family="'Fredoka',system-ui,sans-serif" paint-order="stroke" stroke="#0003" stroke-width="1">${ch}</text>`
  );
}

const NUM_COLORS = [
  '#42a5f5','#66bb6a','#ffa726','#ef5350','#ab47bc',
  '#26a69a','#ec407a','#fdd835','#5c6bc0','#8d6e63',
];

// ─── Public lookup ───

export const ILLUSTRATIONS: Record<string, SvgRenderer> = {};

for (const [k, v] of Object.entries(animals)) ILLUSTRATIONS[k] = v;
for (const [k, v] of Object.entries(food)) ILLUSTRATIONS[k] = v;
for (const [k, v] of Object.entries(instruments)) ILLUSTRATIONS[k] = v;

for (const name of Object.keys(colorDefs)) {
  ILLUSTRATIONS[name] = () => colorBlob(name);
}

for (let c = 65; c <= 90; c++) {
  const ch = String.fromCharCode(c);
  ILLUSTRATIONS[ch] = () => bubbleLetter(ch, LETTER_COLORS);
  ILLUSTRATIONS[ch.toLowerCase()] = () => bubbleLetter(ch.toLowerCase(), LETTER_COLORS);
}

for (let n = 0; n <= 20; n++) {
  const s = String(n);
  ILLUSTRATIONS[s] = () => bubbleLetter(s, NUM_COLORS);
}
