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
- **React**: v6.13.1 
- **Flutter**: v2.2.3 
- **Typescript**: v3.7.5
- **Docker**: Installed for optional containerized deployment  

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

## Deployment Structure API and React (local and docker)

*   release/
    *   client/ \# React client server
        *   build/ \# Built React app
        *   .env \# Environment variables for client server
        *   client.js \# Client server code (built in deploy_local with npm run start. code in deploy_local/src/index.ts)
        *   package.json \# Client dependencies
        *   Dockerfile \# Docker configuration for client (in deploy_doker)
    *   data/ \# MongoDB data storage - empty
    *   server/ \# API server
        *   dist/ \# Built API server code
        *   .env \# Environment variables for API server
        *   package.json \# API dependencies
        *   Dockerfile \# Docker configuration for API (in deploy_doker)
    *   storage/ \# User-generated content storagee - empty
    *   docker-compose.yml \# Docker Compose configuration (in deploy_doker)
    *   setup.sh \# Setup script for deployment (in deploy_doker)
    *   start-all.bat \# Run the release versions (in deploy_local)
    *   stop-all.bat \# Stop mongo, server and client (in deploy_local)

---

## Deployment Structure API and React  (local and docker)
1. Build both the server and the client.
2. Copy the build outputs into the appropriate folders (client/build, sever/build) inside the `release/` directory.
3. Run `start-all.bat` to launch the project locally, or:
   - Use `setup.sh` to build and run Docker containers via Docker Compose.

---

## Deployment Structure Flutter
1. flutter pub get
2. flutter pub get
3. flutter pub run flutter_launcher_icons:main
4. flutter build apk --release
5. flutter install (for connected device testing)
---

# API Documentation
The Global Photo Manager API provides endpoints for user authentication, photo management, and statistics retrieval. All endpoints are prefixed with /api and require appropriate authentication and role-based access control (RBAC). The API uses JWT tokens stored in HTTP-only cookies for authentication.
# Base URL
http://[Host IP / DN]:3001/api
# Authentication Endpoints
POST /auth/register
Registers a new user.
Request Body:
{
  "username": "string",
  "password": "string",
  "role": "string" // Optional: superadmin, admin, user, guest (default: guest)
}

Response:

201 Created: Returns user details and JWT token.

{
  "message": "Logged in successfully.",
  "user": {
    "userid": "string",
    "username": "string",
    "userrole": "string",
    "token": "string"
  }
}


400 Bad Request: User already exists.
500 Internal Server Error: Server error.

Cookie:

Sets a token cookie (HTTP-only, 7-day expiry).

POST /auth/login
Logs in an existing user.
Request Body:
{
  "username": "string",
  "password": "string"
}

Response:

200 OK: Returns user details and JWT token.

{
  "message": "Logged in successfully.",
  "user": {
    "token": "string",
    "userid": "string",
    "username": "string",
    "userrole": "string"
  }
}


400 Bad Request: Invalid credentials.
500 Internal Server Error: Server error.

Cookie:

Sets a token cookie (HTTP-only, 7-day expiry).

GET /auth/logout
Logs out the current user.
Request:

Requires token cookie.

Response:

200 OK: Successfully logged out.

{
  "message": "Logged out."
}


401 Unauthorized: No token provided or invalid token.
500 Internal Server Error: Server error.

Cookie:

Clears the token cookie.

PUT /auth/update-role
Updates the role of the authenticated user.
Request:

Requires token cookie.

Request Body:
{
  "role": "string" // superadmin, admin, user, guest
}

Response:

200 OK: Role updated successfully.

{
  "message": "Role updated successfully",
  "user": {
    "userid": "string",
    "username": "string",
    "userrole": "string"
  }
}


400 Bad Request: Invalid role or missing user ID.
401 Unauthorized: No token provided or invalid token.
403 Forbidden: No user identification.
404 Not Found: User not found.
500 Internal Server Error: Server error.

Cookie:

Updates the token cookie with the new role.

Photo Endpoints
GET /photos
Retrieves all photos, accessible to all roles.
Request:

Requires token cookie (optional for guests).

Response:

200 OK: Returns an array of photos.

{
  "photos": [
    {
      "id": "string",
      "filename": "string",
      "path": "string",
      "userid": "string",
      "username": "string",
      "userrole": "string",
      "uploadedAt": "string" // ISO date
    }
  ]
}


500 Internal Server Error: Server error.

POST /photos/upload
Uploads a new photo (not allowed for Guest role).
Request:

Requires token cookie.
Content-Type: multipart/form-data
Form field: photo (image file).

Response:

201 Created: Photo uploaded successfully.

{
  "message": "Photo uploaded successfully",
  "photo": {
    "id": "string",
    "filename": "string",
    "path": "string",
    "userid": "string",
    "username": "string",
    "userrole": "string",
    "uploadedAt": "string" // ISO date
  }
}


400 Bad Request: No file uploaded.
401 Unauthorized: No token provided or invalid token.
403 Forbidden: Insufficient role or no user identification.
500 Internal Server Error: Server error.

DELETE /photos/:id
Deletes a photo by ID (not allowed for Guest role).
Request:

Requires token cookie.
URL Parameter: id (photo ID).

Response:

200 OK: Photo deleted successfully.

{
  "message": "Photo deleted successfully"
}


401 Unauthorized: No token provided or invalid token.
403 Forbidden: Insufficient permissions or no user identification.
404 Not Found: Photo not found.
500 Internal Server Error: Server error.

Stats Endpoints
GET /stats
Retrieves platform statistics (not allowed for Guest role).
Request:

Requires token cookie.

Response:

200 OK: Returns platform statistics.

{
  "stats": {
    "photosAdded": number,
    "photosDeleted": number,
    "currentPhotos": number,
    "usersAdded": number,
    "usersDeleted": number,
    "currentUsers": number,
    "totalLogins": number,
    "totalLogouts": number,
    "totalLoggedInUsers": number,
    "updatedAt": "string" // ISO date
  }
}


401 Unauthorized: No token provided or invalid token.
403 Forbidden: Insufficient role.
404 Not Found: Stats not found.
500 Internal Server Error: Server error.

---

For further assistance, contact the project maintainer.
