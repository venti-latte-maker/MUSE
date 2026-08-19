# MovieMusic frontend implementation

Implemented:
- `client/src/components/MovieSearch.tsx`
- `client/src/components/RecommendationFeed.tsx`
- `client/src/pages/PlaylistDetail.tsx`
- `client/src/services/apiClient.ts` movie search + playlist generation methods
- `client/src/App.tsx` routing for `/`, `/search`, `/playlist/:id`

The implementation uses the supplied API models from `client/src/types/api.ts`.

## Dependency
Ensure `react-router-dom` is installed:

```bash
npm install react-router-dom
```

## API assumptions
Movie search is called as:
`GET /api/movies/search?query=<term>`

Playlist generation is called as:
`POST /api/movies/{id}/generate-playlist`

The supplied `apiClient.ts` had `USE_MOCK = true`, so the generated implementation preserves that flag. With mocks enabled, movie search returns an empty result because the supplied mock data contains recommendations and a playlist but no movie-search dataset.
