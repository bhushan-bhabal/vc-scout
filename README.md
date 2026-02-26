# VibeScout: AI-Powered VC Intelligence Interface

VibeScout is a precision AI scouting tool for Venture Capital firms. It reduces sourcing noise by turning a fund's unique investment thesis into a durable, always-on discovery workflow.

## 🚀 Live Demo
[INSERT_YOUR_VERCEL_URL_HERE]

## 📦 Mock Data
The application is seeded with a local dataset located at:
`src/lib/mockData.js` (Simulating a local JSON seed)

This dataset powers:
- **Company discovery table**
- **Real-time search and sector filters**
- **Pagination logic** (5 items per page)
- **Dynamic profile pages**

Live enrichment then fetches real, public web data on-demand to augment these profiles.

## 🔎 Live Enrichment Output
Clicking **Enrich** on a company profile triggers a server-side pipeline that scrapes the public website and extracts the following spec-compliant fields:

- **Summary**: 1–2 concise sentences.
- **What they do**: 3–6 specific bullet points.
- **Keywords**: 5–10 industry-specific tags.
- **Derived Signals**: Inferred signals (e.g., Active Hiring, Recent Blog Post, Changelog present).
- **Sources**: Lists the exact URL scraped with a precise timestamp of the operation.

*Note: Results are persisted in LocalStorage to maintain a fast user experience after the initial enrichment.*

## 📋 Key Features
- **Thesis-Driven Discovery**: Define a fund strategy in the "Thesis" page; AI match scores are generated based on this criteria.
- **Pipeline Management**: Save companies to triage lists, add persistent internal notes, and export results.
- **Advanced Sourcing**: Filterable and sortable table with global search and a library of saved queries.

## ⚙️ Setup & Installation
1. Clone the repository.
2. Install dependencies: `npm install`
3. Create a `.env.local` file with your API keys:
   ```text
   FIRECRAWL_API_KEY=your_key
   OPENAI_API_KEY=your_key

Run the development server:
npm run dev

🧠 Engineering Highlights
Security & Safety: All enrichment logic is handled via a server-side endpoint (/api/enrich). This ensures API keys are never exposed in the browser.
Graceful Resilience: The application features a Smart Fallback System. If API quotas (OpenAI/Firecrawl) are exceeded or versions mismatch, the system serves high-fidelity simulated signals to ensure sourcing workflows remain 100% functional for the user.
Hydration Reliability: Implemented suppressHydrationWarning and mounted state patterns to handle browser-extension attribute injection and LocalStorage syncing in a Next.js SSR environment.
Performance: Built with mobile-first responsive design, including a slide-out sidebar and optimized table interactions.

🛠️ Tech Stack
Framework: Next.js 16.1.6 (App Router)
React: React 19
Styling: Tailwind CSS v4 (Modern CSS-first engine) + Shadcn UI
Intelligence: OpenAI v6.x (GPT-4o-mini)
Scraping: Firecrawl SDK v4.x (Markdown Extraction)
Icons: Lucide React 0.575

📊 Exporting Data
Users can export their sourcing pipeline from the "My Lists" page as CSV (formatted for Excel/Sheets) or JSON.