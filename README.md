
# Weather Watcher

Weather Watcher is a modern web application for tracking current weather, air quality, and forecasts for any location. Built with React, Vite, and Tailwind CSS, it provides a clean, responsive interface and integrates with weather APIs for real-time data.

## Features

- Search for weather by city or location
- View current weather conditions
- 7-day weather forecast
- Air quality index display
- Responsive and mobile-friendly UI
- Powered by Vite, React, and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm, yarn, or bun (choose your preferred package manager)

### Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd weather-watcher-main
# Using npm
npm install
# Or using yarn
yarn install
# Or using bun
bun install
```

### Running the App

```bash
# Using npm
npm run dev
# Or using yarn
yarn dev
# Or using bun
bun run dev
```

The app will be available at `http://localhost:5173` by default.

## Project Structure

- `src/` — Main source code
	- `components/` — UI components
	- `pages/` — Page components
	- `hooks/` — Custom React hooks
	- `integrations/` — API and service integrations
	- `lib/` — Utility functions
- `public/` — Static assets (including logo.svg)

## Customization

- Update the logo in `public/logo.svg` as needed.
- Configure API keys and endpoints in `.env` or relevant integration files.

## Deployment

You can deploy this app to any static hosting service (Vercel, Netlify, GitHub Pages, etc.) after building:

```bash
npm run build
# or
yarn build
# or
bun run build
```

## License

This project is open source and available under the MIT License.

---

*Feel free to contribute or open issues for improvements!*
