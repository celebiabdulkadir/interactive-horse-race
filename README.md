# 🐎 Interactive Horse Racing Game

A fun and interactive horse racing game built with **Typescript**, **Vue 3**, **Vite**, and **Vuex**.  
Manage horses, schedule races, and watch the action unfold with real-time animations and results!

---

## Features

- Generate a stable of unique horses with random stats and colors
- Schedule and run a series of races with varying distances
- Animated race track with live horse movement
- Audio effects for countdown, start, and finish
- View race results, winners, and statistics
- Responsive UI with a modern dashboard layout
- End-to-end and unit tests with Cypress and Vitest

---

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

**Against the Vite development server (faster for local dev):**

```sh
npm run test:e2e:dev
```

**Recommended: Test the production build before deploying (e.g. in CI):**

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

---

## Audio Files in Production

To ensure audio works in your built app, place your audio files (`beep.mp3`, `start.mp3`, `end.mp3`) in the `/public` directory and reference them as `/beep.mp3`, etc.

---

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)
- For `.vue` type support in TypeScript, use [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

---

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

---

Enjoy racing! 🏁
