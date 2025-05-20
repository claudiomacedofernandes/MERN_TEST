# Global Photo Manager – MVP Challenge Submission

This project is a minimal proof-of-concept submission for a technical challenge, consisting of:

- Web App (Node.js + Express backend with a React frontend)
- Mobile App (Flutter client using the same backend)

---

## Technologies Used

### Web App

- **Backend**: Node.js + Express
- **Database**: MongoDB (local instance)
- **Authentication**: JWT (HTTP-only cookies)
- **Image Uploads**: Local filesystem via `multer`
- **Frontend**: React + Tailwind CSS
- **Real-Time Stats (MVP)**: REST polling every few seconds
- **Role Management**: SuperAdmin, Admin, User, Guest
- **Access Control**: Route-based RBAC via middleware

### Mobile App

- **Framework**: Flutter
- **Networking**: `http`
- **Offline Storage**: `hive`
- **Connectivity Detection**: `connectivity_plus`
- **State Management**: `provider`
- **Image Upload**: `image_picker` + `http.MultipartRequest`
- **Real-Time Stats (MVP)**: REST polling every few seconds

---

## Role-Based Access

| Role        | Permissions                                      |
|-------------|--------------------------------------------------|
| SuperAdmin  | Full access: user + photo management             |
| Admin       | Manage own content and content of lower roles    |
| User        | Submit and delete own photos                     |
| Guest       | View-only access                                 |

---

## Prerequisites

- **Node.js**: v13.14.0  
- **MongoDB**: v4.0.0  
- **Docker**: Installed for optional containerized deployment  
- **Project Files**: Ensure all files in the `release/` directory are present, including `.env` files configured with correct settings (e.g., MongoDB URI, API/client ports)

---

## Testing Instructions (Local)

1. Clone the repository.
2. Install dependencies in the following directories:
   - `/server`
   - `/client`
   - `/flutter_app`
3. Install and run MongoDB locally.
4. Configure environment variables in the `.env` files.
5. Start services:
   - **MongoDB**: Run `mongod` on your desired port.
   - **Backend**: Run `npm start` inside `/server` (starts `ts-node src/index.ts`).
   - **Frontend**: Run `npm start` inside `/client` (uses `react-scripts start`).
     - Ensure the `proxy` field is set correctly in `client/package.json` to match the backend.
6. Open the mobile app via the Flutter CLI or emulator.

---

## Deployment Structure (local and docker)

*   release/
    *   client/ \# React client server
        *   build/ \# Built React app
        *   .env \# Environment variables for client server
        *   client.js \# Client server code
        *   package.json \# Client dependencies
        *   Dockerfile \# Docker configuration for client
    *   data/ \# MongoDB data storage
    *   server/ \# API server
        *   dist/ \# Built API server code
        *   .env \# Environment variables for API server
        *   package.json \# API dependencies
        *   Dockerfile \# Docker configuration for API
    *   storage/ \# User-generated content storage
    *   docker-compose.yml \# Docker Compose configuration
    *   setup.sh \# Setup script for deployment
    *   start-all.bat \# Run the release versions in deploy\_local
    *   stop-all.bat \# Stop mongo, server and client

---

## Deployment Structure (local and docker)
1. Build both the server and the client.
2. Copy the build outputs into the appropriate folders inside the `release/` directory.
3. Run `start-all.bat` to launch the project locally, or:
   - Use `setup.sh` to build and run Docker containers via Docker Compose.

---

For further assistance, contact the project maintainer.