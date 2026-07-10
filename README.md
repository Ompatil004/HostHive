# HostHive

HostHive is a modern, fully-decoupled, Airbnb-like full-stack web application. It features a static, highly responsive client-side interface communicating with a Node.js/Express JSON REST API backend, utilizing MongoDB for data storage.

### 🌐 Live Deployment
*   **Frontend**: [https://host-hive-h18yn03ex-ompatil197.vercel.app/](https://host-hive-h18yn03ex-ompatil197.vercel.app/)
*   **Backend API**: [https://host-hive-wghj.onrender.com/api/listings](https://host-hive-wghj.onrender.com/api/listings)

---

## 🏗️ Project Architecture

The project has been refactored from a Server-Side Rendered (SSR) app into two main directories:

```
hostHive/
├── backend/          # Node.js/Express JSON API server & Mongoose Schemas
│   ├── controllers/  # API business logic
│   ├── models/       # MongoDB/Mongoose schemas (Listings, Reviews, Users)
│   ├── routes/       # API endpoints (/api/listings, /api/reviews, /api)
│   ├── init/         # Database seeding scripts & sample data
│   ├── uploads/      # Locally uploaded listing images
│   └── app.js        # Backend server entry point
└── frontend/         # Static HTML/CSS/Vanilla JS client application
    ├── index.html    # Homepage (listing cards & category filters)
    ├── show.html     # Detailed listing view & reviews
    ├── new.html      # Create listing form (supports file upload)
    ├── edit.html     # Update listing form
    ├── login.html    # User login
    ├── signup.html   # User registration
    ├── css/          # Core stylesheet rules (style.css, rating.css)
    └── js/           # Client-side scripts (common.js - Navbar/Footer/Auth logic)
```

---

## 🚀 Getting Started Locally

### 1. Prerequisite Configuration
Ensure you have a MongoDB instance running (local or MongoDB Atlas) and create a `.env` file in the **`backend/`** directory with the following variables:
```env
ATLASDB_URL=your-mongodb-url
SECRET=your-session-secret-key
PORT=8000
```

### 2. Seed the Database
To populate the database with dummy listings:
```bash
cd backend
node init/index.js
```

### 3. Start the Backend API Server
```bash
cd backend
npm install
npm run dev
```
The API server will start listening on `http://localhost:8000`.

### 4. Serve the Frontend Client
Serve the static files from the `frontend/` directory. If using VS Code:
* Right-click `frontend/index.html` and choose **"Open with Live Server"** (runs on `http://localhost:5500`).

*(Note: Always access your local site via `http://localhost:5500` instead of `http://127.0.0.1:5500` so cookie authentication sessions persist correctly).*

---

## 🌐 Production Deployment

### Backend (Render)
1. Deploy a **Web Service** pointing to the `backend` root folder.
2. Configure Environment Variables (`ATLASDB_URL`, `SECRET`, `NODE_ENV=production`).
3. Set the start command to `node app.js`.

### Frontend (Vercel)
1. Deploy the project on Vercel.
2. In the Project Settings, set the **Root Directory** to `frontend`.
3. Update the `API_BASE` variable inside `frontend/js/common.js` to point to your live backend service URL.
