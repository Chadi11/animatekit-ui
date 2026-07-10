# AnimateKit UI — Lightweight Open-Source React & Tailwind CSS Animated UI Components

**80+ free, open-source animated React UI components — built with Pure React + Tailwind CSS.**

No Framer Motion. No GSAP. No heavy animation libraries. Just clean CSS animations and vanilla React hooks.

🔗 **Live Demo & Docs:** [animate.xyz](https://animate.xyz)

---

## Why Pure React + Tailwind?

Most animation libraries ship large runtime bundles (Framer Motion ≈ 30 KB+ gzipped, GSAP ≈ 25 KB+). AnimateKit UI takes a different approach:

- **Zero animation dependencies** — every component uses only CSS `@keyframes`, transitions, and `requestAnimationFrame`
- **Lightweight** — no extra bundle size; components are as light as the markup they render
- **No lock-in** — copy a component into your project and it just works, no provider wrappers or global config
- **Full control** — read and modify every line; no abstraction layers hiding the animation logic

---

## ✨ Features

- **70+ Components** — Buttons, text animations, preloaders, cards, backgrounds, interactive elements
- **100% Free & Open Source** — MIT license, use in personal and commercial projects
- **Copy & Paste** — Every component is self-contained and ready to drop into your project
- **React + TypeScript** — Fully typed, modern React components
- **Tailwind CSS** — Styled with utility classes, easy to customize
- **Pure CSS & Vanilla JS Animations** — No external animation libraries

---

## 📦 Categories

| Category | Examples |
|----------|---------|
| **Text Animations** | Decrypted Text, Blur Text, Morphing Text, Typing Text, Sparkles Text, Video Text, Gradient Text, Highlight Text, Rolling Text, Rotating Text, Circular Text, Scroll Text |
| **Backgrounds** | Ripple Effect, Aurora Background, Aurora Flow, Particles Float, Venom Lines, Liquid Venom, Curved Loop |
| **Cards** | Glare Card, Flash Sweep Card, Tooltip Card, Card Stack, Tilt Hover Card, Image Follow Card |
| **Preloaders** | 8 unique loading screen animations with smooth transitions |
| **Buttons** | Magnetic, Neon Flicker, Particle Burst, Laser Trace, Rainbow Orbit, Bounce Pop, Breathing Glow, Flip, Ripple Wave, Ripple Flip, Shockwave Ripple, Slice Reveal, Text Flip, Typewriter Border, Orbital Spinner, Neon Wave, Magnetic Fill |
| **Interactive** | Motion Trail Image, Hover Reveal List, Scroll Snap List, Circle Draw, Underline Draw, Counting Number, Animated Circular Progress |

---

## 🛠 Tech Stack

| Dependency | Purpose | Required? |
|-----------|---------|-----------|
| [React 18](https://react.dev/) | UI framework | ✅ Yes |
| [TypeScript](https://www.typescriptlang.org/) | Type safety | ✅ Yes |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling | ✅ Yes |
| [lucide-react](https://lucide.dev/) | Icons (used in 7 button components) | ⚠️ Only if you use: MagneticButton, RippleWaveButton, FlipButton, BouncePopButton, SliceRevealButton, NeonWaveButton, ParticleBurstButton2 |

> **Note:** The documentation site uses [shadcn/ui](https://ui.shadcn.com/) for settings panels (sliders, inputs, labels), but the animation components themselves do **not** depend on shadcn/ui. You don't need it in your project.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Chadi11/animatekit-ui.git

# Navigate to the project
cd animatekit-ui

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Using a component in your project

1. Browse components at [animate.xyz](https://animate.xyz)
2. Click the **Code** tab on any component page
3. Copy the full source code
4. Paste it into your project (e.g., `src/components/DecryptedText.tsx`)
5. Import and use it — no extra setup needed

```tsx
import DecryptedText from "./components/DecryptedText";

function App() {
  return <DecryptedText text="Hello World" speed={80} />;
}
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-animation`)
3. Commit your changes (`git commit -m 'Add new animation component'`)
4. Push to the branch (`git push origin feature/new-animation`)
5. Open a Pull Request

---

## 📄 License

MIT — free for personal and commercial use.

---

## 🙌 Credits

Created by [Chadi Baraou](https://x.com/chaditech)
