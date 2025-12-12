# The Outpost VFM

Website for The Outpost VFM - A mountain restaurant and cabin rental located in Mount Laguna, California.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Code Quality**: ESLint + Prettier
- **Package Manager**: npm

## Project Structure

```
the-outpost-vfm/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── layout/           # Layout components
├── lib/                  # Utility functions and helpers
├── public/               # Static assets
│   ├── images/          # Image files
│   └── fonts/           # Font files
├── .env.example         # Environment variables template
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm (comes with Node.js)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd the-outpost-vfm
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Development Guidelines

### Code Quality

- All code must pass ESLint checks before committing
- Use Prettier for consistent code formatting
- Write TypeScript for type safety
- Follow the existing code structure and conventions

### Component Organization

- Place reusable UI components in `components/ui/`
- Place layout-specific components in `components/layout/`
- Keep components small and focused on a single responsibility
- Use TypeScript interfaces for component props

### Styling

- Use Tailwind CSS utility classes for styling
- Follow mobile-first responsive design approach
- Maintain consistent spacing and color schemes
- Use CSS variables for theme values (see `globals.css`)

## Features Roadmap

- [ ] Restaurant information and menu
- [ ] Cabin rental listings and booking
- [ ] Gallery/photos
- [ ] Contact information and location
- [ ] About page with history and team
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Accessibility improvements

## License

Private - All rights reserved
