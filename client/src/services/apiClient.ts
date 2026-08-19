import axios from 'axios';
import type { ApiResponse, MovieSummary, Playlist, RecommendationResponse } from '../types/api';
import { mockPlaylist, mockRecommendations } from './mockData';

const USE_MOCK = true;

export const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

export const movieService = {
    searchMovies: async (query: string): Promise<ApiResponse<MovieSummary>> => {
        if (USE_MOCK) {
            return {
                data: [],
                pagination: {
                    page: 1,
                    pageSize: 0,
                    totalCount: 0,
                    totalPages: 0,
                },
            };
        }

        const res = await apiClient.get<ApiResponse<MovieSummary>>('/movies/search', {
            params: { query },
        });
        return res.data;
    },

    generatePlaylist: async (id: string): Promise<Playlist> => {
        if (USE_MOCK) return mockPlaylist;

        const res = await apiClient.post<Playlist>(`/movies/${id}/generate-playlist`);
        return res.data;
    },
};

export const playlistService = {
    getPlaylistById: async (id: string): Promise<Playlist> => {
        if (USE_MOCK) return Promise.resolve(mockPlaylist);

        const res = await apiClient.get<Playlist>(`/playlists/${id}`);
        return res.data;
    },

    getRecommendations: async (): Promise<RecommendationResponse> => {
        if (USE_MOCK) return Promise.resolve(mockRecommendations);

        const res = await apiClient.get<RecommendationResponse>('/recommendations');
        return res.data;
    },
};
