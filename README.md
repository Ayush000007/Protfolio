# Liquid Chrome — Ayush Pratap Singh Portfolio

A bespoke, hand-crafted personal portfolio website built with semantic HTML5, modern CSS3, vanilla JavaScript, and a custom 3D liquid-chrome centerpiece powered by Three.js.

Designed with an editorial, asymmetrical aesthetic: obsidian surfaces, molten chrome reflections, inflated 3D pills, and subtle Laser Crimson accents.

---

## 📁 Project Structure

```text
portfolio-ayush/
├── index.html              # Main HTML markup & real content
├── contact.php             # Secure PHP mail handler
├── README.md               # Customization guide & instructions
├── assets/
│   ├── favicon.svg         # Inflated chrome monogram favicon
│   └── noise.svg           # Tactile film grain overlay texture
├── css/
│   ├── base.css            # Strict color tokens, reset, typography & grain
│   ├── layout.css          # Editorial asymmetrical grid & navigation
│   ├── components.css      # Inflated chrome buttons, pills, cards, timeline & cursor
│   └── animations.css      # Motion keyframes, reveals & reduced-motion support
└── js/
    ├── main.js             # Orchestrator, mobile nav, live clock & form fallback
    ├── scene.js            # Three.js 3D inflated liquid-chrome engine & studio lighting
    ├── cursor.js           # Custom crimson dot + chrome ring & magnetic physics
    └── reveal.js           # IntersectionObserver scroll reveals & active section spy
```

---

## ⚡ How to Run Locally

### Option 1: Using PHP (Recommended for testing the contact form)
Open PowerShell or your terminal inside this folder:
```bash
php -S localhost:8000
```
Then visit `http://localhost:8000` in your browser.

### Option 2: Using Python
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

### Option 3: VS Code / IDE Live Server
Right-click `index.html` and select **"Open with Live Server"**. (Note: the contact form will automatically fall back to opening your email client when PHP is not present).

---

## 🛠️ How to Customize

### 1. Updating Projects & Links
Open `index.html` and search for the `<section id="projects">` block:
- Replace the placeholder `href="#"` inside each project item:
  ```html
  <!-- Replace href="#" with your live project link -->
  <a href="https://your-live-demo.com" target="_blank" rel="noopener noreferrer" class="btn btn-chrome btn-sm">
    <span>Live Demo</span>
  </a>

  <!-- Replace href="#" with your GitHub repository link -->
  <a href="https://github.com/Ayush000007/your-repo-name" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm">
    <span>GitHub</span>
  </a>
  ```

### 2. Updating Bio, Experience & Education
All content is written in clear, semantic HTML inside `index.html`:
- **About & Bio**: Found inside `<section id="about">`.
- **Experience Timeline**: Found inside `<div class="timeline">` in `<section id="experience">`. The active role has class `timeline-item active-role` which triggers the pulsing crimson indicator.
- **Academic Credentials**: In the second timeline column in `<section id="experience">`.

### 3. Customizing the Color Palette
Open `css/base.css` and locate the `:root` block at the top:
```css
:root {
  /* Obsidian Black Spectrum */
  --bg-primary: #0A0A0C;           /* Main background */
  --bg-surface: #121216;           /* Cards & raised panels */

  /* Chrome Silver Spectrum */
  --chrome-base: #C9CDD3;          /* Neutral chrome tone */
  --chrome-highlight: #F2F4F7;     /* Bright specular highlights */
  --chrome-shadow: #6B7078;        /* Shadow bevels */

  /* Laser Crimson Accent */
  --accent-crimson: #FF1A3C;       /* Accent color for buttons, cursor, active lights */
}
```

### 4. Contact Form Setup
- In `contact.php`, the `$recipient` variable is already set to `ayushpratapsinghgzp@gmail.com`.
- When deployed to a standard web host supporting PHP (cPanel, Apache, Nginx), form submissions will send directly to your inbox.
- If deployed to a static-only host (such as GitHub Pages), `js/main.js` will smoothly launch the visitor's email client (`mailto:`) with pre-filled inputs.

---

## 🚀 Deployment Recommendations

- **Full-stack (with PHP form)**: Deploy to any standard PHP host (e.g. Hostinger, cPanel, InfinityFree, or Heroku/Render with PHP runtime).
- **Static Host**: Push to **GitHub Pages**, **Vercel**, or **Netlify**. The site will run flawlessly with its built-in mailto fallback.
