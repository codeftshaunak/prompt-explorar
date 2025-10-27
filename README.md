# AI System Prompts Explorer

A beautiful, minimalistic Next.js application for exploring and interacting with AI system prompts from 30+ tools and platforms.

## Features

- 🎨 **Minimalistic Design** - Clean UI inspired by huly.io
- 🔍 **Smart Search** - Search through prompts by title, category, or content
- 📂 **Category Filter** - Browse prompts by tool/platform categories
- 📝 **Detailed View** - Full prompt display with metadata and usage instructions
- 💻 **Interactive** - Copy prompts, download as files, and view statistics
- 📱 **Responsive** - Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- The prompt files should be in the parent directory of this project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page with prompt grid
│   ├── prompt/[id]/       # Individual prompt pages
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── SearchBar.tsx      # Search functionality
│   ├── PromptCard.tsx     # Prompt preview cards
│   ├── CategoryFilter.tsx # Category sidebar
│   └── ui/               # Base UI components
├── lib/                  # Utility functions
│   └── prompts.ts        # Prompt data handling
└── data/                 # Static data files
```

## Key Features

### Search & Filter
- Real-time search across all prompt content
- Category-based filtering
- Combined search and filter functionality

### Prompt Display
- Syntax highlighting for code blocks
- Copy to clipboard functionality
- Download prompts as text files
- Responsive markdown rendering

### Statistics
- Total prompts count
- Word count per prompt
- Category distribution
- Last modified dates

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design tokens
- **Typography**: Inter + JetBrains Mono fonts
- **Icons**: Lucide React
- **Markdown**: React Markdown with GFM support
- **TypeScript**: Full type safety

## Design Philosophy

The UI follows minimalistic design principles inspired by modern productivity tools:

- Clean typography hierarchy
- Subtle hover states and transitions
- Consistent spacing and borders
- Accessible color contrast
- Mobile-first responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.