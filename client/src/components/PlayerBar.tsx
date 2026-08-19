import React, { useState } from 'react';
import YouTube, { type YouTubeProps, type YouTubePlayer } from 'react-youtube';
import type { Song } from '../types/api';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

interface PlayerBarProps {
    currentTrack: Song | null;
    onNext?: () => void;
    onPrev?: () => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({ currentTrack, onNext, onPrev }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [playerRef, setPlayerRef] = useState<YouTubePlayer | null>(null);

    if (!currentTrack) return null;

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        setPlayerRef(event.target);
        event.target.playVideo();
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (!playerRef) return;
        if (isPlaying) {
            playerRef.pauseVideo();
            setIsPlaying(false);
        } else {
            playerRef.playVideo();
            setIsPlaying(true);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#121212',
            borderTop: '1px solid #282828',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fff',
            zIndex: 1000
        }}>
            {/* Track Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}>
                {currentTrack.thumbnailUrl && (
                    <img
                        src={currentTrack.thumbnailUrl}
                        alt={currentTrack.title}
                        style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }}
                    />
                )}
                <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{currentTrack.title}</div>
                    <div style={{ color: '#b3b3b3', fontSize: '12px' }}>{currentTrack.artist}</div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={onPrev} style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer' }}>
                    <SkipBack size={20} />
                </button>
                <button onClick={togglePlay} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    {isPlaying ? <Pause size={18} color="#000" /> : <Play size={18} color="#000" />}
                </button>
                <button onClick={onNext} style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer' }}>
                    <SkipForward size={20} />
                </button>
            </div>

            {/* Hidden YouTube Engine */}
            <div style={{ display: 'none' }}>
                <YouTube
                    videoId={currentTrack.youtubeVideoId}
                    opts={{ height: '0', width: '0', playerVars: { autoplay: 1 } }}
                    onReady={onPlayerReady}
                    onEnd={onNext}
                />
            </div>
        </div>
    );
};