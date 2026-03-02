# E-Commerce Frontend (Next.js 15)

A premium Next.js frontend paired with the accompanying Express backend.

## Features
- Next.js 15 App Router structure
- Context API (Cart & Auth)
- Axios with interceptors
- Tailwind CSS styling with modern aesthetics
- Admin Management Portal

## Setup Instructions

### 1. Prerequisite 
Ensure the **backend server** is running on port 5000 (`http://localhost:5000`). This frontend uses this default URL in `.env.local` to fetch APIs including images.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application. 

* **To access the Admin view**, log out from the default user account, create a new backend user (via Postman or MongoDB compass) with `{ role: "admin" }`, or modify an existing user's role to `'admin'` directly in your MongoDB database, then log in here.
