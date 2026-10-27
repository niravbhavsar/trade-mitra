# Market

This repository contains the Phase 0 starter for the Indian stock market research and paper-trading application.

## Live demo

Open the deployed prototype here:

https://market-nirav.niravbhavsar.workers.dev

## Current stack

- Frontend: Vite + vanilla JavaScript
- Styling: Tailwind CSS + daisyUI
- Hosting: Cloudflare Pages
- Database (later): Supabase PostgreSQL
- Automation (later): GitHub Actions
- Alerts (later): Telegram Bot API

## Purpose

This is a research and paper-trading prototype only. It is not a live trading system and does not guarantee profit or passive income.

## Local development

1. Install dependencies:
   npm install
2. Start the app:
   npm run dev -- --host
3. Open the URL shown in the terminal, typically:
   http://localhost:5173

## Build for production

npm run build

## Test

npm run test

## Deployment

This frontend is designed for free static hosting on Cloudflare Pages.

1. Push this repo to GitHub.
2. In Cloudflare Pages, create a project and connect this repository.
3. Set build command to:
   npm run build
4. Set output directory to:
   dist
5. Deploy the project.

## Security reminder

- Never commit real secrets or tokens.
- Use Supabase service-role keys only in secure server-side environments.
- Keep all real credentials in Cloudflare, GitHub Secrets, or Supabase project settings.
