
**Design Document – Movie Music Playlist & Recommendation System**

**Version:** 0.1  
**Last Updated:** August 17, 2026  
**Stack:** React (Frontend) | C# (.NET) Backend | Python (Recommendation + Wrapper API)

---

### 1. High-Level Architecture

- Frontend: React (TypeScript preferred) – uses camelCase in all code and when consuming APIs.
- Main Backend API: C# (.NET) – owns authentication, user/playlist/movie CRUD, database access, Movie API + YouTube API orchestration, and serves as the single public entry point for the frontend.
- Recommendation + Wrapper Service: Python (FastAPI recommended) – owns the recommendation engine, feature extraction, and heavy data-processing / ML logic. Exposes a thin internal API consumed only by the C# backend.
- Communication flow:
  - React → C# API (public, authenticated)
  - C# API → Python Recommendation Service (internal / service-to-service)
- Database is the single source of truth. Only the C# service writes to the database for users, playlists, saved playlists, etc.

---

### 2. Naming & Serialization Conventions

- Frontend (React): Strict camelCase (`userId`, `playlistId`, `createdAt`, `isPublic`, `posterUrl`, etc.).
- C# Backend:
  - Internal C# models and entities: PascalCase.
  - JSON responses sent to React: camelCase (configured globally via JsonSerializerOptions or equivalent).
- Python Service:
  - Internal Python code: snake_case.
  - JSON payloads sent to C#: camelCase (to keep consistency with the frontend contract).
- All UUIDs are represented as strings in JSON.
- Dates are ISO-8601 strings (example: `2026-08-17T10:30:00Z`).
- Enums are returned as strings (example: `"source": "movie"`).

---

### 3. Core Data Shapes (Shared Contracts)

**Playlist object returned by C# to the Frontend**

```json
{
  "id": "uuid-string",
  "name": "string",
  "description": "string",
  "isPublic": true,
  "source": "movie",
  "creatorId": "uuid-string",
  "movieId": "uuid-string | null",
  "songs": [
    {
      "title": "string",
      "artist": "string",
      "youtubeUrl": "string",
      "youtubeVideoId": "string",
      "durationSeconds": 210,
      "thumbnailUrl": "string | null"
    }
  ],
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601",
  "movie": {
    "id": "uuid-string",
    "title": "string",
    "year": 2023,
    "posterUrl": "string"
  }
}
```

**Recommendation response (Python → C# → Frontend)**

```json
{
  "recommendations": [
    {
      "type": "movie",
      "id": "uuid-string",
      "score": 0.87,
      "reason": "Because you liked similar artists / same genre / same movie soundtrack",
      "item": { /* full Movie, Playlist, or Song object in camelCase */ }
    }
  ],
  "generatedAt": "ISO-8601",
  "modelVersion": "string"
}
```

---

### 4. How the C# API Returns Data to the Frontend

- Every successful response is clean JSON using camelCase property names.
- Recommended list response envelope:

```json
{
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 142,
    "totalPages": 8
  }
}
```

- Consistent error response shape:

```json
{
  "error": {
    "code": "PlaylistNotFound",
    "message": "Human readable message",
    "details": null
  }
}
```

- C# JSON serializer is configured once (globally) to:
  - Emit camelCase property names
  - Handle DateTime as ISO-8601
  - Decide and stick to one null-handling policy (include or ignore nulls)
- The frontend never receives PascalCase or snake_case.

---

### 5. How the Python API Supplies Recommendation Data to the C# API

- Python exposes internal endpoints only (not reachable from the frontend).
- Example endpoint: `POST /internal/recommendations`
- Request body (camelCase):

```json
{
  "userId": "uuid-string",
  "context": {
    "recentPlaylistIds": ["uuid1", "uuid2"],
    "favoriteArtists": ["Artist A", "Artist B"],
    "preferredGenres": ["Soundtrack", "Electronic"],
    "limit": 20
  }
}
```

- Response body uses the Recommendation shape shown in section 3 (camelCase).
- C# side:
  - Uses a typed HttpClient with retry and circuit-breaker policies (Polly recommended).
  - Maps the Python response into internal DTOs if needed, then returns the final camelCase payload to React.
  - Never exposes the Python service directly to the frontend.
- Service-to-service authentication options: mutual TLS, API key header, or internal network restriction.

---

### 6. Suggested Endpoint Ownership

**C# (public – called by React)**
- User endpoints: `/api/users/...`
- Playlist endpoints: `/api/playlists/...` (CRUD + save)
- Movie search & playlist generation: `/api/movies/search` and `/api/movies/{id}/generate-playlist`
- Recommendations: `/api/recommendations` (C# calls Python behind the scenes)

**Python (internal only)**
- `POST /internal/recommendations`
- Optional: `POST /internal/features/extract`
- Model training and batch jobs remain inside the Python service

---

### 7. Key Design Decisions & Rationale

- C# is the single public API surface and the only writer to the database → simpler security, authentication, and data consistency.
- Python is isolated to ML and heavy processing so the recommendation team can iterate and scale independently.
- Consistent camelCase JSON across the entire stack removes mapping friction for both the frontend and the C# ↔ Python boundary.
- Songs stored as JSON inside the Playlist table (as per the existing schema) is acceptable for v1. The C# layer is responsible for validating the structure before saving.
- Start with synchronous HTTP between C# and Python. Introduce a message queue later only if latency or throughput requires it.

---

**Next Steps**
- Finalize OpenAPI / Swagger contracts for the C# public API.
- Define the exact Python internal contract and error model.
- Agree on authentication mechanism between C# and Python.
- Create shared TypeScript types on the frontend that mirror the camelCase contracts above.

