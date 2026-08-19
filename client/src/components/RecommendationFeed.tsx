import React, { useEffect, useState } from 'react';
import type { MovieSummary, Playlist, RecommendationItem, Song } from '../types/api';
import { playlistService } from '../services/apiClient';

const isMovie = (item: RecommendationItem['item']): item is MovieSummary =>
    'year' in item && 'posterUrl' in item;

const isPlaylist = (item: RecommendationItem['item']): item is Playlist =>
    'songs' in item && 'name' in item;

const isSong = (item: RecommendationItem['item']): item is Song =>
    'artist' in item && 'youtubeVideoId' in item;

export const RecommendationFeed: React.FC = () => {
    const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        playlistService.getRecommendations()
            .then((response) => {
                if (!cancelled) setRecommendations(response.recommendations);
            })
            .catch(() => {
                if (!cancelled) setError('Unable to load recommendations.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) return <p style={{ color: '#aaa' }}>Loading recommendations...</p>;
    if (error) return <p style={{ color: '#ff7676' }}>{error}</p>;

    return (
        <section>
            <h2>Discover & Recommendations</h2>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '20px',
                    marginTop: '20px',
                }}
            >
                {recommendations.map((recommendation) => {
                    const { item } = recommendation;
                    const title = isMovie(item) ? item.title : isPlaylist(item) ? item.name : item.title;
                    const image = isMovie(item)
                        ? item.posterUrl
                        : isPlaylist(item)
                            ? item.movie?.posterUrl ?? null
                            : item.thumbnailUrl;

                    return (
                        <article
                            key={`${recommendation.type}-${recommendation.id}`}
                            style={{
                                background: '#141414',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                border: '1px solid #252525',
                            }}
                        >
                            {image && (
                                <img
                                    src={image}
                                    alt={title}
                                    style={{
                                        width: '100%',
                                        aspectRatio: '16 / 10',
                                        objectFit: 'cover',
                                        display: 'block',
                                    }}
                                />
                            )}

                            <div style={{ padding: '16px' }}>
                                <div style={{ color: '#1db954', fontWeight: 700, fontSize: '13px' }}>
                                    {Math.round(recommendation.score * 100)}% match
                                </div>

                                <h3 style={{ margin: '8px 0' }}>{title}</h3>

                                {isMovie(item) && (
                                    <p style={{ margin: '0 0 8px', color: '#999' }}>
                                        {item.year}
                                    </p>
                                )}

                                {isSong(item) && (
                                    <p style={{ margin: '0 0 8px', color: '#999' }}>
                                        {item.artist}
                                    </p>
                                )}

                                <p style={{ margin: 0, color: '#bbb', lineHeight: 1.5 }}>
                                    {recommendation.reason}
                                </p>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
};
