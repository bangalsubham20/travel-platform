# 🏔️ SundaySoul — Elevated Travel & Expedition Web Platform

![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-4.5-purple.svg?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-cyan.svg?style=for-the-badge&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10-pink.svg?style=for-the-badge&logo=framer)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg?style=for-the-badge&logo=docker)

> **SundaySoul Frontend** is an immersive social travel and expedition booking web application built with React, Vite, Tailwind CSS, and Framer Motion spring physics.

---

## 🎨 Design Read & Highlights

- **✨ Dark Glassmorphic Aesthetic**: Sleek glass panels, ambient glow overlays, and curated typography using **Outfit** (Display), **Inter** (Body), and **JetBrains Mono** (Metrics).
- **🏔️ Trekking & Camping Experience**: Pixel-perfect fluid S-curved mountain mask hero showcase with dynamic trail pins and carousels.
- **🔍 Multi-Parameter SearchBar**: Instant filtering by Destination, Departure Date, and Traveler count with floating popover menus.
- **📊 Real-Time Expeditions Catalog**: Connected to Spring Boot REST APIs for dynamic trip filtering and database category counts.
- **📱 Fully Responsive**: Custom mobile navigation drawer, fluid typography scaling, and smooth touch gestures.

---

## 🛠️ Tech Stack

```text
├── UI Library        : React 18
├── Build Tool        : Vite 4.5
├── Styling           : Tailwind CSS 3.3
├── Motion Physics    : Framer Motion 10
├── Icons             : React Icons (Feather / FontAwesome)
└── Routing           : React Router DOM 6
```

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js** (v18 or v20)
- SundaySoul Backend API service running on `http://localhost:8080`

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/bangalsubham20/SundaySoul.git
cd SundaySoul

# Install dependencies
npm install

# Start Vite local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🐳 Docker Deployment

```bash
# Build production Docker image
docker build -t sundaysoul-frontend .

# Run container on port 80
docker run -d -p 80:80 --name sundaysoul-ui sundaysoul-frontend
```

---

<div align="center">
  <sub>Crafted with passion for design and exploration by <b>Subham</b> • 🇮🇳 India</sub>
</div>
