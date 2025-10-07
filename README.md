# 🔗 Kantan Link Tree

**The easiest way to create a beautiful, personalized link tree**

[Live Demo](https://kantan-link-tree.vercel.app/) · [Report Bug](https://github.com/sixtyto/kantan-link-tree/issues) · [Request Feature](https://github.com/sixtyto/kantan-link-tree/issues)

---

## 📋 Table of Contents

- [🎯 About](#about)
- [✨ Features](#features)
- [🛠 Tech Stack](#tech-stack)
- [🚀 Getting Started](#getting-started)
- [📁 Project Structure](#project-structure)
- [🔌 API Endpoints](#api-endpoints)
- [🔐 Environment Variables](#environment-variables)
- [💻 Development](#development)
- [📝 License](#license)
- [🙏 Acknowledgments](#acknowledgments)

---

## About

Kantan Link Tree is a modern, full-stack link aggregation platform that allows users to create a personalized landing page with all their important links in one place. Perfect for social media bios, business cards, and anywhere you need to share multiple links.

**"Kantan" (簡単)** means "simple" or "easy" in Japanese - reflecting the app's philosophy of making link sharing effortless.

## Features

### 🔐 Authentication & User Management

- Secure user registration and login
- Session-based authentication with `nuxt-auth-utils`
- Password change functionality
- Account deletion with confirmation

### 🔗 Link Management

- Create unlimited custom links
- Add social media links with platform-specific icons
- Drag-and-drop link reordering
- Custom link titles and URLs
- Link visibility toggle
- Click tracking and analytics

### 👤 Profile Customization

- Custom username (unique URL slug)
- Profile picture upload
- Bio/description
- Display name
- Theme customization

### 📊 Analytics

- Track link clicks
- View performance metrics
- Monitor engagement

### 🎨 Modern UI/UX

- Beautiful, responsive design built with Nuxt UI
- Dark mode support
- Smooth animations and transitions
- Mobile-first approach
- Intuitive user interface

## Tech Stack

### Frontend

- **[Nuxt 4](https://nuxt.com/)** - The Intuitive Vue Framework
- **[Vue 3](https://vuejs.org/)** - Composition API with `<script setup>`
- **[Nuxt UI](https://ui.nuxt.com/)** - Beautiful UI components
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **TypeScript** - Type-safe development

### Backend

- **[Nuxt Server Routes](https://nuxt.com/docs/guide/directory-structure/server)** - API endpoints
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe database toolkit
- **[Neon Database](https://neon.tech/)** - Serverless Postgres
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[nuxt-auth-utils](https://github.com/Atinux/nuxt-auth-utils)** - Authentication utilities

### DevOps

- **[Vercel](https://vercel.com/)** - Deployment platform
- **[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)** - Database migrations
- **[ESLint](https://eslint.org/)** - Code linting

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Neon Database account (or any PostgreSQL database)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sixtyto/kantan-link-tree.git
   cd kantan-link-tree
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL=your_neon_database_url

   # Auth (generate a random secret)
   NUXT_SESSION_PASSWORD=your-secret-password-min-32-chars
   ```

4. **Run database migrations**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Project Structure

```
kantan-link-tree/
├── app/                          # Nuxt application
│   ├── components/              # Vue components
│   │   ├── profile/            # Profile-related components
│   │   ├── settings/           # Settings components
│   │   └── ui/                 # Reusable UI components
│   ├── composables/            # Vue composables
│   ├── layouts/                # Nuxt layouts
│   ├── middleware/             # Route middleware
│   ├── pages/                  # Application pages
│   │   ├── u/                  # Public profile pages
│   │   ├── index.vue          # Landing page
│   │   ├── login.vue          # Login page
│   │   ├── profile.vue        # User profile editor
│   │   └── settings.vue       # User settings
│   └── utils/                  # Utility functions
├── server/                      # Server-side code
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── links/             # Link management endpoints
│   │   ├── social-links/      # Social link endpoints
│   │   ├── u/                 # Public profile endpoints
│   │   └── user/              # User management endpoints
│   ├── database/              # Database schema
│   └── utils/                 # Server utilities
├── shared/                      # Shared types and schemas
│   ├── schemas/               # Zod validation schemas
│   └── types/                 # TypeScript types
├── drizzle/                     # Database migrations
├── public/                      # Static assets
└── nuxt.config.ts              # Nuxt configuration
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Management

- `POST /api/user/update-profile` - Update user profile
- `POST /api/user/change-password` - Change password
- `DELETE /api/user/delete-account` - Delete account

### Links

- `GET /api/links/list` - Get user's links
- `POST /api/links/create` - Create new link
- `PUT /api/links/:id` - Update link
- `DELETE /api/links/:id` - Delete link
- `POST /api/links/:id/track` - Track link click

### Social Links

- `GET /api/social-links/list` - Get user's social links
- `POST /api/social-links/create` - Create new social link
- `PUT /api/social-links/:id` - Update social link
- `DELETE /api/social-links/:id` - Delete social link

### Public

- `GET /api/u/:username` - Get public profile data

## Environment Variables

| Variable                | Description                           | Required |
| ----------------------- | ------------------------------------- | -------- |
| `DATABASE_URL`          | Neon Database connection string       | ✅       |
| `NUXT_SESSION_PASSWORD` | Session encryption key (min 32 chars) | ✅       |

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and fix code
npm run lint

# Generate database migrations
npm run db:generate

# Run database migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Nuxt](https://nuxt.com/) for the amazing framework
- [Nuxt UI](https://ui.nuxt.com/) for beautiful components
- [Neon](https://neon.tech/) for serverless Postgres
- [Vercel](https://vercel.com/) for hosting

---

**Made with ❤️ using Nuxt and Vue**

[⬆ back to top](#-kantan-link-tree)
