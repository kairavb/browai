# BROW AI — Mobile

> An Android-first, AI-native **market intelligence terminal** — a faithful mobile adaptation of the BROW AI web product. Built as a recruitment assignment by **Kairav Bhatia**.

BROW AI decodes Indian equities, F&O, crypto and global markets into AI-scored, decision-ready intelligence: conversational analysis, multi-factor rankings, impact-ranked news, macro catalysts and transparent trade setups — all in a polished, offline-capable React Native app.

---

## ✨ Highlights

- **18+ fully-functional screens** — nothing is a dead stub.
- **100% offline** — realistic mock data for instruments, candles, news, macro events, factor models, options chains and mutual funds. No backend, no API keys.
- **Custom SVG charts** — candlesticks, multi-series intraday lines, area charts and sparklines drawn with `react-native-svg` + `d3-shape` (zero native chart config).
- **Premium dark fintech design system** — one token source, reused components, light status bar, full safe-area handling.
- **State that persists** — onboarding prefs and watchlist survive restarts via Zustand + AsyncStorage.
- **EAS-ready** — a `preview` profile produces an installable APK; no Android Studio or emulator required.

## 📱 Features

| Area | Screen | What it does |
|---|---|---|
| Onboarding | 4-step flow | Welcome → markets traded → risk tolerance → tour (persisted) |
| Workspace | **Home** | Greeting, live tickers, intraday multi-index chart, session movers, macro strip, explore grid, world markets |
| Workspace | **Watchlist** | Intelligence radar, market filters, live sort/search, AI-scored cards, add/remove instruments |
| AI | **Ask BROW** | Conversational chat with grounded mock responses + autonomous quantitative engine cards |
| Analysis | **Stock Detail** | Candlestick chart w/ timeframes, AI verdict & conviction, technical signals, key levels, stats, related news |
| News & Macro | **News Intelligence** | Impact-ranked, sentiment-tagged news with affected tickers; category filters |
| News & Macro | **Economic Calendar** | Macro catalysts by region / impact / category with BROW cross-asset impact |
| News & Macro | **Notifications** | Breaking / Filings / Alerts / Market / Tasks feed with unread state |
| Markets | **AI Screener** | Segment tabs, quick filters, natural-language query, conversational refine |
| Markets | **Liquidity Radar** | Accumulation / breakout / volume-spike signals with min-score threshold |
| Markets | **Factor Ranking** | Multi-factor equity rankings, factor weights, model-integrity grade |
| Markets | **Tracked Setups** | AI trade setups with entry / SL / targets / thesis — Live / Active / Booked |
| Markets | **Options Intelligence** | PCR, Max Pain, ATM expected move & an OI-wall option chain |
| Markets | **MF Analyser** | Explore funds, compare two side-by-side, SIP goal projection |
| Markets | **Portfolio** | Holdings, blended P&L, allocation breakdown |
| Markets | **Scheduled Tasks** | 24/7 monitors with a create flow |
| System | **Settings** | Edit markets, risk, notifications, replay onboarding |

> The web product gates several tools behind paid tiers. For this assignment every feature is fully functional with mock data; a subtle non-blocking `PRO` tag marks the tools the web app locks.

## 🧱 Tech stack

- **React Native** + **Expo SDK 58** (New Architecture)
- **TypeScript** (strict)
- **Expo Router** (file-based navigation)
- **Zustand** + **AsyncStorage** (state & persistence)
- **react-native-svg** + **d3-shape** (charts)
- **lucide-react-native** (icons) · **expo-linear-gradient** · **expo-haptics**

## 🗂 Project structure

```
app/                       # Expo Router routes (thin screens)
  _layout.tsx              # root stack, providers, splash gate
  index.tsx                # onboarding vs app redirect
  onboarding/              # 4-step onboarding
  (tabs)/                  # Home · Watchlist · Ask · News · Markets
  stock/[symbol].tsx       # stock analysis screen
  screener / radar / factor-ranking / tracked-setups
  options / mutual-funds / portfolio / scheduled-tasks
  economic-calendar / notifications / settings
src/
  components/              # shared + feature components
    ui/                    # design-system primitives (Text, Card, Badge…)
    charts/                # Sparkline, AreaChart, MultiLineChart, CandleChart
  data/                    # mock datasets (kept separate from UI)
  store/                   # zustand stores (prefs, watchlist, chat, notifications)
  theme/                   # colors, spacing, radii, typography tokens
  types/                   # shared TypeScript types
  utils/                   # formatters & deterministic series generation
```

## 🚀 Getting started

```bash
# install (Node 18+ recommended)
npm install

# start the dev server (scan the QR with Expo Go, or press 'a' for Android)
npx expo start
```

### Type-check

```bash
npx tsc --noEmit
```

## 📦 Build an APK with EAS

No Android Studio or emulator needed — builds run in Expo's cloud.

```bash
npm install -g eas-cli
eas login
eas build:configure          # once, if prompted

# installable APK (internal distribution)
eas build --profile preview --platform android
```

When the build finishes, download the APK from the EAS link and install it on your Android phone. The `preview` profile in `eas.json` is pre-configured to output `buildType: apk`.

## 🎨 Design system

A single token source in `src/theme`:

- **Surfaces** — deep navy-black (`#070B12`) with elevated cards and hairline borders
- **Brand** — cyan→blue gradient (`#22D3EE` → `#3B82F6`)
- **Semantic** — green bullish, red bearish, amber impact
- **Type** — system font, tracked uppercase labels, tabular numerals for prices

All financial figures are right-aligned and use tabular numbers to prevent layout shift; every list has loading / empty / error states.

## 🧪 Data

All market data is **simulated** and generated deterministically (seeded) so charts and figures are stable across renders. There is no network dependency.

---

## ⚠️ Copyright & Usage Restrictions

**Copyright © 2026 Kairav Bhatia. All Rights Reserved.**

This repository is publicly accessible solely for recruitment evaluation and code review purposes.

No licence is granted to copy, reproduce, modify, distribute, sublicense, commercially exploit, or incorporate this project's original source code or implementation into any other product or service without prior written permission from the author.

Access to this repository does not constitute a transfer or assignment of intellectual property rights.

**This project is NOT open-source software.** All rights reserved, subject to applicable third-party licences and rights.

> BROW AI is a financial intelligence tool, not investment advice. The BROW AI product and brand referenced here belong to their respective owners; this mobile app is an independent adaptation built for evaluation.
