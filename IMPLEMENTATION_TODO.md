# Blog App - Backend Integration Implementation Checklist

> **Branch:** `feature/backend-integration`
> **Backend API:** `http://localhost:5000/api`
> **Backend Documentation:** See backend README.md for full API reference

---

## Table of Contents
1. [Phase 1: Authentication & Authorization](#phase-1-authentication--authorization)
2. [Phase 2: Article Workflow System](#phase-2-article-workflow-system)
3. [Phase 3: Advanced Article Features](#phase-3-advanced-article-features)
4. [Phase 4: User Management](#phase-4-user-management)
5. [Phase 5: Enhanced UX & Error Handling](#phase-5-enhanced-ux--error-handling)
6. [Phase 6: Additional Features](#phase-6-additional-features)
7. [Phase 7: Polish & Documentation](#phase-7-polish--documentation)

---

## Phase 1: Authentication & Authorization

### 1.1 Authentication Context & API Integration
- [ ] **Create `src/context/AuthContext.jsx`**
  - [ ] State: `user`, `token`, `loading`, `isAuthenticated`
  - [ ] Function: `login(email, password)` → POST `/api/auth/login`
  - [ ] Function: `register(name, email, password, role)` → POST `/api/auth/register`
  - [ ] Function: `logout()` → Clear token & user state
  - [ ] Function: `checkAuth()` → Validate stored token on app mount
  - [ ] Store JWT token in localStorage
  - [ ] Update axios default headers with token

- [ ] **Create `src/hooks/useAuth.jsx`**
  - [ ] Export custom hook to access AuthContext
  - [ ] Return: `{ user, login, register, logout, isAuthenticated, loading }`

- [ ] **Update `src/api/axios.js`**
  - [ ] Add request interceptor to attach `Authorization: Bearer <token>` header
  - [ ] Add response interceptor to handle 401 errors (auto-logout)
  - [ ] Handle 429 rate limit responses

### 1.2 Authentication Pages
- [ ] **Create `src/pages/Login.jsx`**
  - [ ] Form fields: email, password
  - [ ] Use react-hook-form + Zod validation
  - [ ] Call `login()` from AuthContext
  - [ ] Show error messages for failed login
  - [ ] Link to registration page
  - [ ] Redirect to home on successful login
  - [ ] **API:** `POST /api/auth/login`
  - [ ] **Rate Limit:** 5 requests per 15 minutes

- [ ] **Create `src/pages/Register.jsx`**
  - [ ] Form fields: name, email, password, role (dropdown: user/author)
  - [ ] Use react-hook-form + Zod validation
  - [ ] Password strength indicator
  - [ ] Call `register()` from AuthContext
  - [ ] Show success message and redirect to login
  - [ ] **API:** `POST /api/auth/register`
  - [ ] **Rate Limit:** 5 requests per 15 minutes

### 1.3 Protected Routes & Authorization
- [ ] **Create `src/components/auth/ProtectedRoute.jsx`**
  - [ ] Check `isAuthenticated` from AuthContext
  - [ ] Redirect to `/login` if not authenticated
  - [ ] Accept `allowedRoles` prop for role-based access
  - [ ] Show "Access Denied" message for insufficient permissions

- [ ] **Create `src/components/auth/RoleGuard.jsx`**
  - [ ] Wrapper component for role-based conditional rendering
  - [ ] Props: `allowedRoles`, `children`, `fallback`
  - [ ] Hide/show UI elements based on user role

- [ ] **Update `src/App.jsx` routing**
  - [ ] Wrap admin routes with `<ProtectedRoute allowedRoles={['admin']} />`
  - [ ] Wrap author routes with `<ProtectedRoute allowedRoles={['author', 'admin']} />`
  - [ ] Add `/login` route
  - [ ] Add `/register` route

### 1.4 Header & User Profile
- [ ] **Update `src/components/layout/Header.jsx`**
  - [ ] Show login/register buttons when not authenticated
  - [ ] Show user dropdown menu when authenticated:
    - [ ] Display user name and role
    - [ ] "My Articles" link (for authors/admins)
    - [ ] "Admin Dashboard" link (for admins only)
    - [ ] "Upgrade to Author" link (for users only)
    - [ ] Logout button
  - [ ] Use `useAuth()` hook
  - [ ] Conditional rendering based on user role

---

## Phase 2: Article Workflow System

### 2.1 Update Article Context for Workflow
- [ ] **Update `src/context/ArticleContext.jsx`**
  - [ ] Update `addArticle()` to handle `status: "draft"` by default
  - [ ] Add `submitArticleForReview(id)` → POST `/api/articles/:id/submit`
  - [ ] Add `approveArticle(id)` → POST `/api/articles/:id/approve` (admin only)
  - [ ] Add `rejectArticle(id, reason)` → POST `/api/articles/:id/reject` (admin only)
  - [ ] Add `getMyArticles(status?)` → GET `/api/articles/my/articles?status=...`
  - [ ] Add `getPendingArticles()` → GET `/api/articles/admin/pending` (admin only)
  - [ ] Update article list to show only approved articles for public users
  - [ ] Update API response handling for pagination structure

### 2.2 My Articles Page (Author View)
- [ ] **Create `src/pages/MyArticles.jsx`**
  - [ ] Display user's articles with status badges
  - [ ] Filter tabs: All, Drafts, Pending, Approved, Rejected
  - [ ] Call `getMyArticles(status)` from context
  - [ ] Show submission date for pending articles
  - [ ] Show review date and reviewer for approved/rejected articles
  - [ ] Show rejection reason for rejected articles
  - [ ] Action buttons per status:
    - [ ] Draft: Edit, Delete, Submit for Review
    - [ ] Pending: View only (no actions)
    - [ ] Approved: Edit, Delete
    - [ ] Rejected: Edit, Delete, Submit for Review (after edits)
  - [ ] **API:** `GET /api/articles/my/articles`
  - [ ] Protected route: Author or Admin only

### 2.3 Submit for Review Feature
- [ ] **Create `src/components/article/SubmitReviewButton.jsx`**
  - [ ] Button component with confirmation dialog
  - [ ] Call `submitArticleForReview(id)` from context
  - [ ] Show success toast on submission
  - [ ] Update article status to "pending" in UI
  - [ ] Disabled for articles already pending/approved
  - [ ] **API:** `POST /api/articles/:id/submit`

### 2.4 Admin Review Queue
- [ ] **Create `src/pages/AdminReviewQueue.jsx`**
  - [ ] Display pending articles in review order (oldest first)
  - [ ] Show submission date and author info
  - [ ] Preview button to view full article content
  - [ ] Approve/Reject action buttons for each article
  - [ ] Call `getPendingArticles()` from context
  - [ ] **API:** `GET /api/articles/admin/pending`
  - [ ] Protected route: Admin only

### 2.5 Approve/Reject Article Components
- [ ] **Create `src/components/admin/ApproveButton.jsx`**
  - [ ] Button with confirmation dialog
  - [ ] Call `approveArticle(id)` from context
  - [ ] Show success toast
  - [ ] Remove from pending list on success
  - [ ] **API:** `POST /api/articles/:id/approve`
  - [ ] Admin only

- [ ] **Create `src/components/admin/RejectDialog.jsx`**
  - [ ] Dialog with textarea for rejection reason
  - [ ] Validation: 10-500 characters required
  - [ ] Call `rejectArticle(id, reason)` from context
  - [ ] Show success toast
  - [ ] Remove from pending list on success
  - [ ] **API:** `POST /api/articles/:id/reject`
  - [ ] Admin only

### 2.6 Status Badge Component
- [ ] **Create `src/components/article/StatusBadge.jsx`**
  - [ ] Visual badge component for article status
  - [ ] Color coding:
    - [ ] Draft: Gray
    - [ ] Pending: Yellow/Orange
    - [ ] Approved: Green
    - [ ] Rejected: Red
  - [ ] Use in ArticleCard, MyArticles, AdminReviewQueue

### 2.7 Update Article Form for Workflow
- [ ] **Update `src/pages/ArticleForm.jsx`**
  - [ ] Remove `author` field (use authenticated user)
  - [ ] Auto-populate author from `useAuth()` context
  - [ ] Set `status: "draft"` on creation
  - [ ] Show current status when editing
  - [ ] Disable editing for pending articles (except admins)
  - [ ] Update validation schema to match backend requirements

---

## Phase 3: Advanced Article Features ✅

### 3.1 Search Functionality ✅
- [x] **Create `src/components/search/SearchBar.jsx`**
  - [x] Input field with search icon
  - [x] Debounced input (500ms delay)
  - [x] Call backend search API with query parameter
  - [x] Clear button to reset search
  - [x] Show search result count

- [x] **Update `src/context/ArticleContext.jsx`**
  - [x] Update `GET /api/articles` to accept `search` query param
  - [x] Add `searchQuery` to state
  - [x] Add `setSearchQuery(query)` function
  - [x] Fetch articles with search param

- [x] **Add SearchBar to `src/pages/Home.jsx`**
  - [x] Place above article list
  - [x] Show loading indicator during fetch
  - [x] Display result count

### 3.2 Tag Filtering
- [ ] **Create `src/components/filters/TagFilter.jsx`**
  - [ ] Display all available tags as clickable chips
  - [ ] Multi-select support (comma-separated in API)
  - [ ] Active state styling for selected tags
  - [ ] Clear all tags button
  - [ ] Call `GET /api/articles?tags=tag1,tag2`

- [ ] **Update `src/context/ArticleContext.jsx`**
  - [ ] Add `selectedTags` to state
  - [ ] Add `setSelectedTags(tags)` function
  - [ ] Update fetch to include `tags` query param
  - [ ] Extract unique tags from API response

- [ ] **Add TagFilter to `src/pages/Home.jsx`**
  - [ ] Place in sidebar or above article list
  - [ ] Show tag count next to each tag

### 3.3 Additional Filters
- [ ] **Create `src/components/filters/FilterPanel.jsx`**
  - [ ] Featured articles toggle checkbox
  - [ ] Author dropdown (fetch from user list)
  - [ ] Date range picker (startDate, endDate)
  - [ ] Status filter (admin only)
  - [ ] Apply/Reset buttons
  - [ ] Collapsible panel on mobile

- [ ] **Update `src/context/ArticleContext.jsx`**
  - [ ] Add filter state: `featured`, `author`, `startDate`, `endDate`, `status`
  - [ ] Update fetch to include all filter params
  - [ ] Add `applyFilters(filters)` function
  - [ ] Add `clearFilters()` function

### 3.4 Pagination
- [ ] **Create `src/components/pagination/Pagination.jsx`**
  - [ ] Page number buttons (1, 2, 3, ... n)
  - [ ] Previous/Next buttons
  - [ ] First/Last page buttons
  - [ ] Current page indicator
  - [ ] Jump to page input
  - [ ] Responsive design for mobile

- [ ] **Create `src/components/pagination/PageSizeSelector.jsx`**
  - [ ] Dropdown to select items per page (10, 20, 50, 100)
  - [ ] Update `limit` query param on change

- [ ] **Update `src/context/ArticleContext.jsx`**
  - [ ] Add pagination state: `currentPage`, `totalPages`, `totalItems`, `itemsPerPage`
  - [ ] Parse pagination data from API response structure:
    ```json
    {
      "data": [...],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 47,
        "itemsPerPage": 10,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
    ```
  - [ ] Add `setPage(page)` function
  - [ ] Add `setPageSize(limit)` function
  - [ ] Fetch with `page` and `limit` query params

- [ ] **Add Pagination to `src/pages/Home.jsx`**
  - [ ] Place below article list
  - [ ] Show total results count
  - [ ] Update URL query params on page change

### 3.5 Sorting
- [ ] **Create `src/components/sorting/SortDropdown.jsx`**
  - [ ] Dropdown with sort options:
    - [ ] Newest First (createdAt desc)
    - [ ] Oldest First (createdAt asc)
    - [ ] Title A-Z (title asc)
    - [ ] Title Z-A (title desc)
    - [ ] Author A-Z (author asc)
  - [ ] Visual indicator for active sort

- [ ] **Update `src/context/ArticleContext.jsx`**
  - [ ] Add sort state: `sortBy`, `order`
  - [ ] Default: `sortBy=createdAt`, `order=desc`
  - [ ] Update fetch to include sort params
  - [ ] Add `setSorting(sortBy, order)` function

- [ ] **Add SortDropdown to `src/pages/Home.jsx`**
  - [ ] Place next to search bar or filter panel

---

## Phase 4: User Management ✅

### 4.1 Users List Page (Admin) ✅
- [x] **Create `src/pages/admin/UsersList.jsx`**
  - [x] Display all users in table/card view
  - [x] Columns: Name, Email, Role, Created Date, Actions
  - [x] Call `GET /api/users` (admin only)
  - [x] Protected route: Admin only
  - [x] **API:** `GET /api/users`

### 4.2 User Detail View ✅
- [x] **Create `src/pages/admin/UserDetail.jsx`**
  - [x] Display full user information
  - [x] Show user's article count and list
  - [x] Role badge
  - [x] Created/Updated timestamps
  - [x] Call `GET /api/users/:id` (admin only)
  - [x] **API:** `GET /api/users/:id`

### 4.3 Role Assignment (Admin) ✅
- [x] **Create `src/components/admin/RoleAssignmentDialog.jsx`**
  - [x] Dialog with role dropdown (user, author, admin)
  - [x] Confirmation step before changing role
  - [x] Call `PUT /api/users/:id/role` with `{ role: "..." }`
  - [x] Show success toast
  - [x] Update user list on success
  - [x] Prevent admins from changing their own role
  - [x] **API:** `PUT /api/users/:id/role`
  - [x] **Rate Limit:** 3 requests per hour
  - [x] Admin only

### 4.4 User Deletion (Admin) ✅
- [x] **Add Delete User Button to UsersList**
  - [x] Confirmation dialog with warning message
  - [x] Call `DELETE /api/users/:id` (admin only)
  - [x] Remove user from list on success
  - [x] Show success toast
  - [x] **API:** `DELETE /api/users/:id`
  - [x] **Rate Limit:** 3 requests per hour
  - [x] Admin only

### 4.5 Author Upgrade (User Self-Service) ✅
- [x] **Create `src/components/user/UpgradeToAuthorButton.jsx`**
  - [x] Button visible only to users with role="user"
  - [x] Confirmation dialog explaining author privileges
  - [x] Call `PUT /api/users/me/upgrade-to-author`
  - [x] Update user context on success
  - [x] Show success toast
  - [x] **API:** `PUT /api/users/me/upgrade-to-author`
  - [x] **Rate Limit:** 3 requests per hour

- [x] **Add button to Header dropdown menu**
  - [x] Show only for users with role="user"
  - [x] Hide after upgrade

---

## Phase 5: Enhanced UX & Error Handling ✅ (Core Features Complete)

### 5.1 Toast Notification System ✅
- [x] **Install toast library:** `pnpm add sonner`
- [x] Using Sonner library (provides all toast variants built-in)
  - [x] Success toast (green)
  - [x] Error toast (red)
  - [x] Warning toast (yellow)
  - [x] Info toast (blue)
  - [x] Auto-dismiss after default duration
  - [x] Close button

- [x] **Add Toaster to `src/App.jsx`**
  - [x] Render at root level
  - [x] Position: top-right with richColors enabled

### 5.2 Global Error Handling ✅
- [x] **Update `src/api/axios.js` response interceptor**
  - [x] Handle 400: Show validation errors
  - [x] Handle 401: Auto-logout and redirect to login
  - [x] Handle 403: Show "Access Denied" toast
  - [x] Handle 404: Show "Not Found" error
  - [x] Handle 429: Show rate limit exceeded message with retry time
  - [x] Handle 500: Show generic error message
  - [x] Log errors to console in development only

- [x] **Create `src/components/ErrorBoundary.jsx`**
  - [x] Catch React component errors
  - [x] Display fallback UI
  - [x] Log errors to console
  - [x] Reset button to recover
  - [x] Go to Home button

- [x] **Wrap App with ErrorBoundary in `src/main.jsx`**

### 5.3 Loading States ✅
- [x] **Create `src/components/ui/Skeleton.jsx`**
  - [x] Generic skeleton loader component with animation
  - [x] Customizable className support

- [x] **Create `src/components/ui/Spinner.jsx`**
  - [x] Small/medium/large spinner variants for buttons
  - [x] PageSpinner for full page loading
  - [x] Uses lucide-react Loader2 icon

- [x] **Success notifications added to components:**
  - [x] ApproveButton - Article approval
  - [x] RejectDialog - Article rejection with feedback
  - [x] SubmitReviewButton (existing)
  - [x] Other components already have loading states

### 5.4 Optimistic UI Updates ⚠️ (Deferred)
- [ ] **Update ArticleContext for optimistic updates**
  - [ ] Note: Skipped for now as current implementation is stable
  - [ ] Can be added in future iteration if needed

### 5.5 Form Validation Error Display ⚠️ (Partial)
- [x] **Global error handling via axios interceptor**
  - [x] Backend validation errors shown via toast
  - [ ] Field-specific error mapping (can be added per form as needed)

---

## Phase 6: Additional Features

### 6.1 Article Metadata Display
- [ ] **Update `src/pages/Post.jsx`**
  - [ ] Show creation date (formatted)
  - [ ] Show last updated date
  - [ ] Show author card with name, email, role
  - [ ] Show reviewer info for approved/rejected articles:
    - [ ] Reviewer name
    - [ ] Review date
  - [ ] Show submission date for pending articles
  - [ ] Add "Edit Article" button for author/admin
  - [ ] Add "Delete Article" button for author/admin

- [ ] **Create `src/components/article/ArticleMetadata.jsx`**
  - [ ] Reusable metadata display component
  - [ ] Format dates with date-fns or Intl.DateTimeFormat
  - [ ] Author avatar (use initial letters or default icon)

### 6.2 Author Information Card
- [ ] **Create `src/components/article/AuthorCard.jsx`**
  - [ ] Display author name, role badge
  - [ ] Avatar or placeholder
  - [ ] "View more articles by this author" link
  - [ ] Article count for this author
  - [ ] Use in Post.jsx

### 6.3 Related Articles Section
- [ ] **Create `src/components/article/RelatedArticles.jsx`**
  - [ ] Fetch related articles based on tags
  - [ ] Display 3-4 related article cards
  - [ ] "View similar articles" link
  - [ ] Use existing `getRelatedArticles()` from context
  - [ ] Add to Post.jsx below article content

- [ ] **Update `src/context/ArticleContext.jsx`**
  - [ ] Ensure `getRelatedArticles()` uses approved articles only
  - [ ] Update to fetch from API if needed

### 6.4 Rate Limit Feedback
- [ ] **Create `src/components/ui/RateLimitWarning.jsx`**
  - [ ] Display when 429 response received
  - [ ] Show cooldown timer
  - [ ] Calculate retry time from rate limit headers
  - [ ] Disable affected action buttons until cooldown expires

- [ ] **Update axios interceptor to handle rate limits**
  - [ ] Parse rate limit headers from response
  - [ ] Show RateLimitWarning component
  - [ ] Store rate limit state in context

### 6.5 Featured Articles Section
- [ ] **Create `src/components/article/FeaturedArticles.jsx`**
  - [ ] Display featured articles in hero section
  - [ ] Carousel or grid layout
  - [ ] Larger cards with images (if available)
  - [ ] Call `GET /api/articles?featured=true&limit=3`

- [ ] **Add to `src/pages/Home.jsx`**
  - [ ] Place above main article list
  - [ ] Separate section with heading

---

## Phase 7: Polish & Documentation

### 7.1 Update Routing
- [ ] **Update `src/App.jsx`**
  - [ ] Add all new routes:
    - [ ] `/login` - Login page
    - [ ] `/register` - Register page
    - [ ] `/my-articles` - My Articles page (protected, author/admin)
    - [ ] `/admin/review-queue` - Admin Review Queue (protected, admin)
    - [ ] `/admin/users` - Users list (protected, admin)
    - [ ] `/admin/users/:id` - User detail (protected, admin)
  - [ ] Wrap protected routes with ProtectedRoute component
  - [ ] Update navigation links in Header

### 7.2 Breadcrumb Navigation
- [ ] **Create `src/components/layout/Breadcrumb.jsx`**
  - [ ] Display current page path
  - [ ] Clickable ancestor links
  - [ ] Use in all pages for consistent navigation

- [ ] **Add to Layout component**
  - [ ] Place below Header

### 7.3 Responsive Mobile Menu
- [ ] **Update `src/components/layout/Header.jsx`**
  - [ ] Add hamburger menu icon for mobile
  - [ ] Sliding drawer menu on mobile
  - [ ] Collapse nav items on small screens
  - [ ] Use Radix UI DropdownMenu or Sheet component

### 7.4 User Onboarding
- [ ] **Create `src/components/onboarding/WelcomeModal.jsx`**
  - [ ] Show on first login
  - [ ] Explain user roles and permissions
  - [ ] Tour of main features
  - [ ] "Don't show again" checkbox
  - [ ] Store preference in localStorage

- [ ] **Create tooltip hints**
  - [ ] Add tooltips to complex UI elements
  - [ ] Use Radix UI Tooltip component
  - [ ] Explain workflow states in MyArticles

### 7.5 Update README.md
- [ ] **Update project README**
  - [ ] Document new features
  - [ ] Add screenshots of key pages
  - [ ] Update setup instructions
  - [ ] Add authentication flow diagram
  - [ ] Add article workflow diagram
  - [ ] List all routes and permissions
  - [ ] Add troubleshooting section

### 7.6 Code Quality & Cleanup
- [ ] **Remove unused code**
  - [ ] Delete `src/utils/mockData.js` (using real API now)
  - [ ] Remove hardcoded `isAdmin = true` from Admin.jsx
  - [ ] Clean up console.log statements
  - [ ] Remove 4-second artificial delay in ArticleForm

- [ ] **Add PropTypes or TypeScript types**
  - [ ] Consider migrating to TypeScript for type safety
  - [ ] Or add PropTypes to all components

- [ ] **Code formatting**
  - [ ] Run Prettier on all files
  - [ ] Ensure consistent code style

### 7.7 Testing Preparation
- [ ] **Create test utilities**
  - [ ] Mock AuthContext for component tests
  - [ ] Mock ArticleContext for component tests
  - [ ] Test data fixtures

- [ ] **Document testing strategy**
  - [ ] List components that need tests
  - [ ] Integration test scenarios
  - [ ] E2E test scenarios

---

## Implementation Priority Order

### High Priority (MVP Features)
1. Phase 1: Authentication & Authorization (Essential for security)
2. Phase 2: Article Workflow System (Core feature per backend)
3. Phase 5.1-5.3: Error handling and loading states (UX critical)

### Medium Priority (Enhanced Features)
4. Phase 3.1-3.2: Search and tag filtering (User-requested features)
5. Phase 3.4: Pagination (Needed for scalability)
6. Phase 4.5: Author upgrade (Self-service feature)

### Lower Priority (Nice-to-Have)
7. Phase 3.3: Additional filters
8. Phase 3.5: Sorting options
9. Phase 4.1-4.4: Full user management (Admin tools)
10. Phase 6: Additional features (Polish)
11. Phase 7: Documentation and cleanup

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user (Rate limit: 5/15min)
- `POST /api/auth/login` - Login user (Rate limit: 5/15min)

### Articles
- `GET /api/articles` - Get all approved articles (public)
- `GET /api/articles/:slug` - Get article by slug (public)
- `GET /api/articles/user/:userId` - Get user's articles
- `POST /api/articles` - Create article (Author/Admin, Rate limit: 10/hour)
- `PUT /api/articles/:id` - Update article (Author/Admin)
- `DELETE /api/articles/:id` - Delete article (Author/Admin)

### Article Workflow
- `GET /api/articles/my/articles` - Get my articles (Author)
- `POST /api/articles/:id/submit` - Submit for review (Author)
- `GET /api/articles/admin/pending` - Get pending articles (Admin)
- `POST /api/articles/:id/approve` - Approve article (Admin)
- `POST /api/articles/:id/reject` - Reject article (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `DELETE /api/users/:id` - Delete user (Admin, Rate limit: 3/hour)
- `PUT /api/users/me/upgrade-to-author` - Upgrade to author (User, Rate limit: 3/hour)
- `PUT /api/users/:id/role` - Update user role (Admin, Rate limit: 3/hour)

---

## Technical Notes

### JWT Token Management
- Store token in localStorage: `localStorage.setItem('token', token)`
- Attach to all requests: `Authorization: Bearer <token>`
- Remove on logout or 401 response
- Validate token on app mount

### Article Status Flow
```
draft → pending → approved ✓
              → rejected → (edit) → pending
```

### Role Permissions
- **User**: View approved articles, upgrade to author
- **Author**: Create/edit/delete own articles, submit for review, view own rejected articles
- **Admin**: All author permissions + approve/reject articles, manage users, view all statuses

### Protected Fields (Cannot be Updated)
- `author`, `status`, `_id`, `createdAt`, `updatedAt`
- `reviewedBy`, `reviewedAt`, `submittedAt`, `rejectionReason`

### Rate Limits
- Auth endpoints: 5 requests per 15 minutes
- Article creation: 10 per hour
- Role changes: 3 per hour
- User deletion: 3 per hour
- General API: 100 per 15 minutes

---

## Dependencies to Install

```bash
# Toast notifications
pnpm add sonner

# Date formatting
pnpm add date-fns

# Additional UI components (if not already installed)
pnpm add @radix-ui/react-toast
pnpm add @radix-ui/react-dropdown-menu
pnpm add @radix-ui/react-select
```

---

## Environment Variables

Ensure `.env` file has:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Update `src/api/axios.js` to use `import.meta.env.VITE_API_BASE_URL`

---

**Total Estimated Tasks:** ~120+ individual items
**Estimated Development Time:** 40-60 hours
**Components to Create:** ~30 new components
**Components to Modify:** ~15 existing components
**New Pages:** ~8 routes
