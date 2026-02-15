# Resume Easy UI

A modern, interactive resume builder that lets you create a master resume and generate multiple tailored versions for different job applications. Built with React, TypeScript, and Tailwind CSS.

**Live Demo:** [resume-easy-ui.vercel.app](https://resume-easy-ui.vercel.app)

## Features

- **Master Resume** - Maintain a single source-of-truth resume with all your experience, projects, skills, and education
- **Tailored Configs** - Create multiple tailored versions by toggling sections, entries, and bullet points on/off without duplicating data
- **Drag-and-Drop Reordering** - Reorder sections and entries within sections using intuitive drag-and-drop
- **Inline Editing** - Edit entries, bullet points, and entry data directly in the UI
- **LaTeX Preview** - Real-time LaTeX preview of your resume with syntax highlighting
- **Job Description Matching** - Paste a job description to help tailor your resume (AI-powered with OpenAI)
- **Import/Export** - Export your resume data as JSON and import it back anytime
- **Persistent Storage** - All tailored configs are automatically saved to localStorage

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** - Build tooling
- **Tailwind CSS v4** - Styling
- **Zustand** - State management with localStorage persistence
- **@dnd-kit** - Drag-and-drop functionality
- **Lucide React** - Icons
- **PrismJS** - LaTeX syntax highlighting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/Priya8975/Resume_Easy_UI.git
cd Resume_Easy_UI
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── assets/          # Sample resume data
├── components/
│   ├── ai/          # AI-related components (API key settings, job description panel)
│   ├── export/      # Export functionality
│   ├── layout/      # App shell, header, sidebar
│   ├── preview/     # LaTeX preview component
│   ├── resume/      # Core resume components (SectionEditor, EntryCard, BulletPointItem)
│   └── ui/          # Reusable UI primitives (Button, Card, Input, etc.)
├── hooks/           # Zustand store (useResumeStore)
├── lib/             # Utilities (LaTeX generation, export/import)
└── types/           # TypeScript type definitions
```

## How It Works

1. **Master Resume** is defined in code and serves as the base template (read-only in the UI)
2. **Tailored Configs** layer overrides on top of the master resume:
   - Toggle any section, entry, or bullet point on/off
   - Override bullet point text
   - Reorder sections and entries
   - Add new entries and bullet points
3. The **Effective Resume** is computed by applying the active config's overrides to the master resume

## Created By

**Priya More** - [GitHub](https://github.com/Priya8975)
