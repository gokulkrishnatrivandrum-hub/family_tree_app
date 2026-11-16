# Kinship (കുടുംബം) - Family Tree Social Network

A modern, privacy-first family tree and social networking web platform built with **Next.js 14**, **React 18**, **TypeScript**, and **Tailwind CSS**. Designed for interconnected families to explore lineage, preserve generational memories, connect with relatives across the globe, and engage through relationship-aware social feeds.

---

## 🌟 Key Features

### 1. Interactive Radial Constellation Family Tree
- **Dynamic Radial Graph:** High-performance SVG-based constellation layout centered around the user ("ME") with multi-generation lineage orbits.
- **Smart Zero-Overlap Physics:** 2D collision relaxation solver ensuring zero overlapping of profile circles, cards, and labels regardless of tree density.
- **Relationship-Aware Color & Bond Edges:** Generation-coded connecting lines (Marriage, Generational, Siblings, Cousins, In-Laws) running smoothly beneath profile photos.
- **Interactive Badges:** Inline relationship symbols (💍, 🤝, 🌱, 👥) and rock-solid new member tags.
- **Smooth Mouse Wheel / Trackpad Zoom:** Effortlessly zoom in/out and drag to pan across vast family trees.

### 2. Generational Roots Matrix (Stair-Step Lineage)
- View your family through generational tiers ($+2$ Grandparents/Ancestors, $+1$ Parents/Uncles/Aunts, $0$ Self/Spouse/Siblings/Cousins, $-1$ Children/Nieces/Nephews).
- Formal kinship tracking and generational offset calculations.

### 3. World Map Lineage & Diaspora View
- Interactive world map showcasing where family members reside (Kochi, Thrissur, Bengaluru, Chennai, Dubai, London, Singapore, etc.).
- Glowing flight & lineage arcs connecting your central home hub to family members across continents.

### 4. Lineage Bridge (Pathway Finder)
- Breadcrumb-style shortest path finder showing step-by-step connections from "You" to any distant relative.
- One-click "Highlight Connection on Tree" to light up the exact path and dim unrelated nodes.

### 5. Family Discovery & Connection Requests
- **Discover Relatives:** Compact, uniform discovery cards for suggested and unlinked family members.
- Propose new connections, simulate admin/member verification, and merge branches seamlessly.
- Highlight newly added members with special **`★ NEW MEMBER`** badges.

### 6. Privacy-First Family Social Feed
- Share posts, life events, milestones, and family memories.
- Relationship-aware visibility settings (Private, Immediate Family, Specific Branch, Entire Tree).
- Multi-lingual post creation with support for Malayalam and English.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Lucide Icons
- **Interactive Canvas:** SVG with custom collision-resolution layout engine
- **Effects:** Canvas-Confetti
- **Backend / Auth Ready:** Firebase Client SDK (Firestore + Google Authentication)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gokulkrishnatrivandrum-hub/family_tree_app.git
   cd family_tree_app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file from `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Add your Firebase configuration keys if integrating live Google Authentication and Cloud Firestore.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📦 Production Build

```bash
npm run build
npm run start
```

---

## 📄 License
This project is private and intended for family network management. All rights reserved.
