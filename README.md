# Blog Frontend

A modern, feature-rich blog platform with advanced article workflow management, user authentication, and comprehensive content filtering. Built with React, Vite, and Tailwind CSS, integrated with a Node.js/Express backend API.

## ✨ Features

### Core Functionality
- **Full Authentication System**
  - JWT-based authentication with secure token storage
  - User registration and login with validation
  - Role-based access control (User, Author, Admin)
  - Protected routes and role-specific UI components
  - Self-service author upgrade for users

### Article Workflow System
- **Multi-stage Article Lifecycle**
  - Draft → Pending → Approved/Rejected workflow
  - Author article submission for review
  - Admin review queue with approve/reject capabilities
  - Rejection feedback system
  - Status tracking and metadata

### Advanced Features
- **Search & Filtering**
  - Real-time search with debouncing
  - Tag-based filtering with multi-select
  - Advanced filters: featured articles, author, date range, status
  - Smart pagination with page size controls
  - Multi-field sorting (date, title)

- **Content Discovery**
  - Featured articles showcase
  - Related articles by tag similarity
  - Article metadata display
  - Author information cards
  - Breadcrumb navigation

### User Experience
- **Modern UI/UX**
  - Responsive design with mobile-first approach
  - Dark/Light theme toggle
  - Toast notifications for user feedback
  - Loading states and skeleton screens
  - Error boundaries for graceful error handling
  - Responsive mobile menu with slide-out drawer

- **Markdown Editor**
  - Live preview with syntax highlighting
  - Real-time word count
  - Resizable editor panels
  - Auto-generated slugs

### User Management (Admin)
- User list with role management
- User detail view with article statistics
- Role assignment (User → Author → Admin)
- User deletion capabilities
- Activity tracking

## 🛠️ Tech Stack

- **Framework:** [React 18](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Validation:** [Zod](https://zod.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Markdown:** [react-markdown](https://github.com/remarkjs/react-markdown)

## 📁 Project Structure

```
src/
├── api/
│   └── axios.js              # API client with interceptors
├── components/
│   ├── admin/               # Admin-specific components
│   ├── article/             # Article-related components
│   ├── auth/                # Authentication components
│   ├── filters/             # Filter components
│   ├── layout/              # Layout components (Header, Footer, Breadcrumb)
│   ├── pagination/          # Pagination components
│   ├── search/              # Search components
│   ├── sorting/             # Sorting components
│   ├── ui/                  # Reusable UI components (shadcn/ui)
│   └── user/                # User-specific components
├── context/
│   ├── ArticleContext.jsx   # Article state management
│   ├── AuthContext.jsx      # Authentication state
│   └── ThemeContext.jsx     # Theme management
├── hooks/
│   ├── useArticles.jsx      # Article context hook
│   ├── useAuth.jsx          # Auth context hook
│   └── useTheme.jsx         # Theme context hook
├── pages/
│   ├── admin/               # Admin pages
│   ├── ArticleForm.jsx      # Article creation/editing
│   ├── Home.jsx             # Homepage with article list
│   ├── Login.jsx            # Login page
│   ├── MarkdownEditor.jsx   # Markdown editor
│   ├── MyArticles.jsx       # Author's articles page
│   ├── Post.jsx             # Single article view
│   └── Register.jsx         # Registration page
└── App.jsx                  # Main app component with routes
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/pnpm
- Backend API running on `http://localhost:5000` (see backend README)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd blog-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
   The application will be available at `http://localhost:5173`.

## 📜 Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Serves the production build locally
- `npm run lint` - Runs ESLint

## 🔐 User Roles & Permissions

### User
- View approved articles
- Upgrade to Author role (self-service)

### Author
- All User permissions
- Create, edit, and delete own articles
- Submit articles for review
- View own article status and feedback

### Admin
- All Author permissions
- Review and approve/reject articles
- Manage users (view, edit roles, delete)
- Access admin dashboard and review queue

## 🎯 Article Workflow

```
┌─────────┐
│  Draft  │ ──► Author creates article
└────┬────┘
     │
     ▼
┌─────────────┐
│   Pending   │ ──► Author submits for review
└──────┬──────┘
       │
       ├──► ┌──────────┐
       │    │ Approved │ ──► Published (visible to all)
       │    └──────────┘
       │
       └──► ┌──────────┐
            │ Rejected │ ──► Author can edit and resubmit
            └──────────┘
```

## 🔌 API Integration

The frontend communicates with the backend API using Axios. Key features:

- **Request Interceptor:** Automatically attaches JWT token
- **Response Interceptor:** Handles common errors (401, 403, 404, 429, 500)
- **Error Handling:** User-friendly error messages via toast notifications
- **Rate Limiting:** Displays retry time for rate-limited requests

### API Endpoints

See backend README for full API documentation. Key endpoints:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/articles` - Get articles (with filters, pagination, search)
- `POST /api/articles` - Create article
- `POST /api/articles/:id/submit` - Submit for review
- `POST /api/articles/:id/approve` - Approve article (admin)
- `POST /api/articles/:id/reject` - Reject article (admin)
- `GET /api/users` - Get all users (admin)

## 🎨 Theming

The application supports light and dark themes using Tailwind CSS and a custom theme context. Toggle between themes using the sun/moon icon in the header.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide](https://lucide.dev/) for icon library
- [React Hook Form](https://react-hook-form.com/) for form management

## 📧 Contact

For questions or support, please open an issue on GitHub.
