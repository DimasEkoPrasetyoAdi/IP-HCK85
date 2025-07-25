# Sport Connect API Documentation

## Base URL
```
http://localhost:3000
```

## Overview
Sport Connect adalah aplikasi untuk mengelola dan bergabung dengan sesi olahraga. API ini menyediakan fitur registrasi pengguna, autentikasi, manajemen sesi olahraga, dan rekomendasi AI.

## Authentication
Sebagian besar endpoint memerlukan authentication token yang dikirim melalui header:
```
Authorization: Bearer <access_token>
```

---

## Public Endpoints (No Authentication Required)

### 1. Register User
**POST** `/register`

Mendaftarkan pengguna baru.

**Request Body:**
```json
{
  "name": "tes",
  "email": "tes@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "tes",
  "email": "tes@example.com",
  "createdAt": "2025-07-24T08:00:00.000Z",
  "updatedAt": "2025-07-24T08:00:00.000Z"
}
```

**Error Responses:**
- **400** - Validation error (missing fields, duplicate email)
- **500** - Server error

---

### 2. Login User
**POST** `/login`

Login pengguna dan mendapatkan access token.

**Request Body:**
```json
{
  "email": "tes@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "tes",
    "email": "tes@example.com"
  }
}
```

**Error Responses:**
- **401** - Invalid credentials
- **400** - Missing email or password

---

### 3. Google Login
**POST** `/google-login`

Login menggunakan Google OAuth.

**Request Body:**
```json
{
  "googleToken": "google_oauth_token_here"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "tes Doe",
    "email": "tes@example.com"
  }
}
```

---

### 4. Get Public Sessions
**GET** `/pub`

Mendapatkan daftar semua sesi yang tersedia untuk publik.

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Basketball Game",
    "description": "Friendly basketball match",
    "session_date": "2025-08-01T14:00:00.000Z",
    "duration_hours": 2,
    "provinsi_id": "31",
    "kabupaten_id": "3171",
    "kecamatan_id": "3171010",
    "ai_recommendation": "Permainan basket selama 2 jam akan membakar sekitar 800 kalori...",
    "max_participants": 10,
    "image_url": "https://cloudinary.com/image.jpg",
    "host": {
      "id": 1,
      "name": "tes"
    },
    "Sport": {
      "id": 1,
      "name": "Basketball"
    }
  }
]
```

---

### 5. Get Sports List
**GET** `/sports`

Mendapatkan daftar semua jenis olahraga yang tersedia.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Basketball"
  },
  {
    "id": 2,
    "name": "Football"
  },
  {
    "id": 3,
    "name": "Tennis"
  }
]
```

---

## Protected Endpoints (Authentication Required)

### 1. Create Session
**POST** `/sessions`

Membuat sesi olahraga baru.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Basketball Game",
  "description": "Friendly basketball match",
  "session_date": "2025-08-01T14:00:00.000Z",
  "duration_hours": 2,
  "sport_id": 1,
  "provinsi_id": "31",
  "kabupaten_id": "3171",
  "kecamatan_id": "3171010",
  "max_participants": 10
}
```

**Response (201):**
```json
{
  "id": 1,
  "host_id": 1,
  "sport_id": 1,
  "title": "Basketball Game",
  "description": "Friendly basketball match",
  "session_date": "2025-08-01T14:00:00.000Z",
  "duration_hours": 2,
  "provinsi_id": "31",
  "kabupaten_id": "3171",
  "kecamatan_id": "3171010",
  "max_participants": 10,
  "ai_recommendation": null,
  "image_url": null,
  "createdAt": "2025-07-24T08:00:00.000Z",
  "updatedAt": "2025-07-24T08:00:00.000Z"
}
```

**Error Responses:**
- **400** - Validation error (missing required fields)
- **401** - Unauthorized (missing or invalid token)

---

### 2. Get User Sessions
**GET** `/sessions`

Mendapatkan daftar sesi yang dibuat oleh user yang sedang login.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Basketball Game",
    "description": "Friendly basketball match",
    "session_date": "2025-08-01T14:00:00.000Z",
    "duration_hours": 2,
    "provinsi_id": "31",
    "kabupaten_id": "3171",
    "kecamatan_id": "3171010",
    "ai_recommendation": null,
    "max_participants": 10,
    "image_url": null,
    "host": {
      "id": 1,
      "name": "tes Doe"
    },
    "Sport": {
      "id": 1,
      "name": "Basketball"
    },
    "participants": [
      {
        "id": 2,
        "name": "Jane Smith"
      }
    ]
  }
]
```

---

### 3. Get Session Detail
**GET** `/sessions/:id`

Mendapatkan detail sesi berdasarkan ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `id` (integer) - Session ID

**Response (200):**
```json
{
  "id": 1,
  "title": "Basketball Game",
  "description": "Friendly basketball match",
  "session_date": "2025-08-01T14:00:00.000Z",
  "duration_hours": 2,
  "provinsi_id": "31",
  "kabupaten_id": "3171",
  "kecamatan_id": "3171010",
  "ai_recommendation": "Permainan basket selama 2 jam akan membakar sekitar 800 kalori...",
  "max_participants": 10,
  "image_url": "https://cloudinary.com/image.jpg",
  "host": {
    "id": 1,
    "name": "tes Doe"
  },
  "Sport": {
    "id": 1,
    "name": "Basketball"
  },
  "participants": [
    {
      "id": 2,
      "name": "Jane Smith"
    }
  ]
}
```

**Error Responses:**
- **404** - Session not found
- **401** - Unauthorized

---

### 4. Update Session
**PUT** `/sessions/:id`

Mengupdate sesi yang dimiliki oleh user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `id` (integer) - Session ID

**Request Body:**
```json
{
  "title": "Updated Basketball Game",
  "description": "Updated description",
  "session_date": "2025-08-02T15:00:00.000Z",
  "duration_hours": 3,
  "sport_id": 1,
  "provinsi_id": "31",
  "kabupaten_id": "3171",
  "kecamatan_id": "3171010",
  "max_participants": 12
}
```

**Response (200):**
```json
{
  "message": "Session updated successfully",
  "session": {
    "id": 1,
    "title": "Updated Basketball Game",
    "description": "Updated description",
    // ... other fields
  }
}
```

**Error Responses:**
- **403** - Forbidden (not session owner)
- **404** - Session not found
- **400** - Validation error

---

### 5. Delete Session
**DELETE** `/sessions/:id`

Menghapus sesi yang dimiliki oleh user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `id` (integer) - Session ID

**Response (200):**
```json
{
  "message": "Session deleted successfully"
}
```

**Error Responses:**
- **403** - Forbidden (not session owner)
- **404** - Session not found

---

