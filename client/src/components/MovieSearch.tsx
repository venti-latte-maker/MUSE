import React, { useEffect, useState } from 'react';
import type { MovieSummary, Playlist } from '../types/api';
import { movieService } from '../services/apiClient';

export const MovieSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState<MovieSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [generatedPlaylist, setGeneratedPlaylist] = useState<Playlist | null>(null);

    useEffect(() => {
        const trimmed = query.trim();

        if (!trimmed) {
            setMovies([]);
            setError(null);
            return;
        }

        const timer = window.setTimeout(async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await movieService.searchMovies(trimmed);
                setMovies(response.data);
            } catch {
                setMovies([]);
                setError('Unable to search movies. Please try again.');
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => window.clearTimeout(timer);
    }, [query]);

    const handleGeneratePlaylist = async (movieId: string) => {
        setGeneratingId(movieId);
        setError(null);
        setGeneratedPlaylist(null);

        try {
            const playlist = await movieService.generatePlaylist(movieId);
            setGeneratedPlaylist(playlist);
        } catch {
            setError('Unable to generate the playlist. Please try again.');
        } finally {
            setGeneratingId(null);
        }
    };

    return (
        <section>
            <h2>Movie Search</h2>

            <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for a movie..."
                aria-label="Search for a movie"
                style={{
                    width: '100%',
                    maxWidth: '620px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    background: '#141414',
                    color: '#fff',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                }}
            />

            {loading && <p style={{ color: '#aaa' }}>Searching...</p>}
            {error && <p style={{ color: '#ff7676' }}>{error}</p>}

            {generatedPlaylist && (
                <div style={{ margin: '20px 0', padding: '16px', background: '#141414', borderRadius: '8px' }}>
                    <strong>Playlist generated:</strong> {generatedPlaylist.name}
                </div>
            )}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '20px',
                    marginTop: '24px',
                }}
            >
                {movies.map((movie) => (
                    <article
                        key={movie.id}
                        style={{
                            background: '#141414',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            border: '1px solid #252525',
                        }}
                    >
                        <img
                            src={movie.posterUrl}
                            alt={`${movie.title} poster`}
                            style={{ width: '100%', aspectRatio: '2 / 3', objectFit: 'cover', display: 'block' }}
                        />

                        <div style={{ padding: '14px' }}>
                            <h3 style={{ margin: '0 0 6px', fontSize: '16px' }}>{movie.title}</h3>
                            <p style={{ margin: '0 0 14px', color: '#999' }}>{movie.year}</p>

                            <button
                                type="button"
                                onClick={() => handleGeneratePlaylist(movie.id)}
                                disabled={generatingId === movie.id}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: 0,
                                    borderRadius: '6px',
                                    cursor: generatingId === movie.id ? 'wait' : 'pointer',
                                    background: '#1db954',
                                    color: '#000',
                                    fontWeight: 700,
                                }}
                            >
                                {generatingId === movie.id ? 'Generating...' : 'Generate Playlist'}
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            {!loading && query.trim() && movies.length === 0 && !error && (
                <p style={{ color: '#aaa' }}>No movies found.</p>
            )}
        </section>
    );
};
