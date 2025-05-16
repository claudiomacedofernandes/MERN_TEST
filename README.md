# Global Photo Manager – MVP Challenge Submission

This project is a minimal proof-of-concept submission for technical challenge consisting of:

- Web App (Node.js + Express backend + React frontend)
- Mobile App (Flutter client using same backend)

---

## Technologies Used

### Web App
- **Backend**: Node.js + Express
- **Database**: MongoDB (server local)
- **Authentication**: JWT
- **Image Uploads**: Local via `multer`
- **Frontend**: React + Tailwind CSS
- **Real-time Stats (MVP)**: REST polling every 10 seconds
- **Role Management**: SuperAdmin, Admin, User, Guest
- **Access Control**: Per-route middleware (RBAC)

### Mobile App
- **Framework**: Flutter
- **Networking**: `http`
- **Offline Storage**: `hive`
- **Connectivity Detection**: `connectivity_plus`
- **State Management**: `provider`
- **Image Upload**: `image_picker` + `http.MultipartRequest`
- **Real-time Stats (MVP)**: REST polling every 10 seconds

---

## Role-Based Access

- **SuperAdmin**: Full access (user + photo management)
- **Admin**: Manage own + lower role content
- **User**: Submit and delete own photos
- **Guest**: View-only access

---

## Testing Instructions

1. Clone the repo.
2. Install dependencies in `/server`, `/client`, and `/flutter_app`.
3. Configure environment variables (see below).
4. Run backend and frontend separately.
5. Open mobile app via Flutter CLI or emulator.

---

## Environment Variables (Backend)

Create a `.env` file in `/server` with:

PORT=3001
MONGODB_URI=mongodb://localhost:27017/photoapp
JWT_SECRET=your_jwt_secret
