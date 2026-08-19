export interface ApiResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
    };
}

export interface ApiError {
    error: {
        code: string;
        message: string;
        details: unknown | null;
    };
}

export interface MovieSummary {
    id: string;
    title: string;
    year: number;
    posterUrl: string;
}

export interface Song {
    title: string;
    artist: string;
    youtubeUrl: string;
    youtubeVideoId: string;
    durationSeconds: number;
    thumbnailUrl: string | null;
}

export interface Playlist {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
    source: 'movie' | 'user' | string;
    creatorId: string;
    movieId: string | null;
    songs: Song[];
    createdAt: string;
    updatedAt: string;
    movie?: MovieSummary;
}

export interface RecommendationItem {
    type: 'movie' | 'playlist' | 'song';
    id: string;
    score: number;
    reason: string;
    item: MovieSummary | Playlist | Song;
}

export interface RecommendationResponse {
    recommendations: RecommendationItem[];
    generatedAt: string;
    modelVersion: string;
}