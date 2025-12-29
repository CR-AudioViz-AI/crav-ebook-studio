# CRAV eBook Studio

AI-Powered Publishing Platform - Create professional, market-ready books with intelligent interviews, rich media integration, professional citations, and multi-format export.

## The Henderson Standard
Fortune 50 Quality. Zero Shortcuts.

## Features

### Core Capabilities
- **AI Qualification Interview** - Javari AI understands your vision before writing
- **Professional Citation System** - APA, MLA, Chicago, Harvard, IEEE, Vancouver
- **Rich Media Integration** - Stock images, AI illustrations, charts, audio
- **Multi-Format Export** - ePub, PDF, Audiobook, HTML, Print-on-Demand

### Quality Assurance
- Plagiarism Detection
- Grammar & Style Checking
- Readability Analysis
- Accessibility Compliance (WCAG 2.1 AA)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Editor**: TipTap (rich text)
- **Backend**: Next.js API Routes, Supabase
- **AI**: OpenAI, Anthropic Claude
- **Media**: Pixabay, Pexels, Unsplash, Stability AI, ElevenLabs

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Media APIs
PIXABAY_API_KEY=
PEXELS_API_KEY=
STABILITY_API_KEY=
ELEVENLABS_API_KEY=

# Research APIs
TAVILY_API_KEY=
```

## Project Structure

```
crav-ebook-studio/
├── app/
│   ├── api/           # API routes
│   ├── books/         # Book editor pages
│   ├── dashboard/     # User dashboard
│   ├── interview/     # AI interview flow
│   └── page.tsx       # Landing page
├── components/
│   ├── ui/            # Reusable UI components
│   ├── books/         # Book-specific components
│   ├── editor/        # TipTap editor components
│   └── layout/        # Layout components
├── lib/
│   ├── ai/            # AI integration
│   ├── api/           # API utilities
│   ├── db/            # Database utilities
│   └── utils/         # Helper functions
├── types/             # TypeScript types
└── docs/              # Documentation
```

## Part of CR AudioViz AI Ecosystem

CRAV eBook Studio is integrated with:
- Javari AI (intelligent assistant)
- Market Oracle (financial data)
- CravBarrels (spirits content)
- And 50+ other apps

## License

Proprietary - CR AudioViz AI, LLC

---

**"Your Story. Our Design. Everyone Connects. Everyone Wins."**

CR AudioViz AI, LLC | Fort Myers, Florida
