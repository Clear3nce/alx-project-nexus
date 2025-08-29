# MC Poll System  (Frontend) — Next.js + TypeScript + Tailwind CSS

A modern, responsive frontend for **MC Poll System**. Users can browse, search, filter, sort, and participate in polls, view real-time results, and manage their voting activity — all with a polished UI built using Tailwind CSS and React patterns.

**Project by:** Muluvhu Clearence Mpho (ALX – ProDev FE)  
**Stack:** Next.js (App Router) · TypeScript · Redux Toolkit · Tailwind CSS · REST API

---

## ✨ Features

- **Dynamic Poll Catalog** with API integration
- **Search, Filtering, and Sorting** of polls
- **Voting System** with duplicate prevention
- **Real-time Results** with visual charts
- **User Authentication** with JWT tokens
- **Responsive Design** (desktop, tablet, mobile)
- **Polished UI**: clean poll cards, result visualizations, intuitive navigation
- **Persistent authentication state** (localStorage)
- **Poll Management** for authenticated users

---

## 🚀 Quick Start

```bash
# 1) Install dependencies
npm install

# 2) Copy environment file and set API base
cp .env.example .env.local

# 3) Run development server
npm run dev    # http://localhost:3000

# 4) Lint (optional)
npm run lint

# 5) Build & start (production)
npm run build && npm run start
```

> Requires Node 18+ (or the version in `.nvmrc` if present).

---

## 🔧 Configuration

Create **`.env.local`** (example):

```env
# Base URL of your Django backend (no trailing slash)
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000/api

# For Vercel, set this in the Project Settings -> Environment Variables
```

If you host the backend elsewhere, update the value accordingly.

---

## 📦 Scripts

```jsonc
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 🗂 Project Structure (example)

```
src/
  app/
    layout.tsx
    page.tsx                 # Home page with featured polls
    polls/
      page.tsx               # Poll listing with filters
      [id]/
        page.tsx             # Individual poll page with voting
    auth/
      login/
        page.tsx             # Login form
      register/
        page.tsx             # Registration form
  components/
    Navbar.tsx
    Footer.tsx
    PollCard.tsx
    PollResults.tsx          # Results visualization component
    CreatePollModal.tsx      # Modal for creating new polls
    AuthGuard.tsx            # Component for protecting routes
  lib/
    store.ts                 # Redux store
    hooks.ts                 # Typed hooks
    slices/
      authSlice.ts           # Authentication state
      pollsSlice.ts          # Polls data
    api/
      client.ts              # fetch wrapper with auth headers
      polls.ts               # poll API helpers
  styles/
    globals.css
  types/
    poll.ts                  # TS interfaces for polls
    auth.ts                  # TS interfaces for authentication
public/
  favicon.ico
  icons/*
```

> Your folder names may differ; the above shows a clean modular layout.

---

## 🔌 API Integration

All requests use `NEXT_PUBLIC_API_BASE`. Example fetch helper:

```ts
// src/lib/api/client.ts
export const api = async <T>(path: string, init: RequestInit = {}) => {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000/api";
  
  // Get auth token from store or localStorage
  const token = localStorage.getItem('access_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...init.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${base}${path}`, { 
    ...init, 
    headers,
    cache: "no-store" 
  });
  
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
};
```

Typical endpoints (from the backend README):

```
GET /polls/?page=1&ordering=-created_at
GET /polls/?search=technology
GET /polls/{id}/results/
POST /polls/{id}/vote/
POST /auth/token/
```

---

## 🔐 Authentication Flow

- Login form submits to `/api/auth/token/`
- JWT tokens are stored in localStorage and Redux state
- All subsequent requests include the token in the Authorization header
- Token refresh mechanism handles expired tokens
**Example login implementation**:

  ```tsx
  const handleLogin = async (credentials: LoginFormData) => {
  try {
    const response = await api<{ access: string; refresh: string }>('/auth/token/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store tokens
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    
    // Update Redux state
    dispatch(setAuthUser({ 
      username: credentials.username, 
      token: response.access 
    }));
    
    router.push('/polls');
  } catch (error) {
    setError('Invalid credentials');
  }
  };
  ```
## 📊 Results Visualization
### Poll results are displayed using chart components:

```tsx
// Using Recharts library for data visualization
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={pollData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="option" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="votes" fill="#4361ee" />
  </BarChart>
</ResponsiveContainer>
```
## 🎨 UI Components
- **PollCard**: Clean card design showing poll question, status, and action buttons
- **PollResults**: Visual representation of voting results with charts
- **CreatePollModal**: Form for authenticated users to create new polls
- **AuthGuard**: Component to protect routes requiring authentication

---

## 🧪 Testing the Flow

1. Open `/` — view featured polls and call-to-action
2. Navigate to `/polls` — browse all polls with filtering and sorting
3. Select a poll to view details and vote (if not already voted)
4. View real-time results after voting
5. Login/Register to create new polls (protected functionality)
6. Test responsive design on different screen sizes

---

## 🚢 Deployment

### Vercel

- Import repository → Framework preset: **Next.js**
- Set environment variable `NEXT_PUBLIC_API_BASE=https://your-backend-domain/api`
- Deploy

### Netlify

- Build command: `npm run build`
- Publish directory: `.next`
- Add environment variable `NEXT_PUBLIC_API_BASE`

---

## 🧰 Troubleshooting

- **Authentication errors**: Verify JWT token is being correctly attached to requests
- **CORS issues**: Ensure backend has proper CORS configuration for your frontend domain
- **API connection failures**: Check `**NEXT_PUBLIC_API_BASE**` value and backend server status
- **Voting restrictions**: Ensure voter identification is working correctly
---

## 🏷️ Commit Style (suggestion)

```
feat(ui): add poll cards and result visualization
feat(auth): implement login/logout functionality
feat(poll): add voting system with validation
feat(api): integrate with backend polls endpoint
fix(navbar): responsive menu improvements
chore: add TypeScript types for poll data
docs: update README with setup instructions
```

---

## 📄 License

MIT (or your preferred license)

---

## 📣 Credits

Frontend by **Muluvhu Clearence Mpho** for **ALX ProDev**.  
Pairs with **MC Poll System API** (Django backend).
