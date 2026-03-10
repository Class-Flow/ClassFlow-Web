import { useState, useRef } from 'react';
import { HiOutlinePlay, HiOutlinePause, HiOutlineTrash } from 'react-icons/hi';
import './VoiceNotes.css';

const VoiceNotePlayer = ({ voiceNote, onDelete }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Assuming voiceNote.url exists. If not, it might be a Blob object URL
    const audioUrl = voiceNote.url || voiceNote.url_path;

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);

            audioRef.current.onended = () => {
                setIsPlaying(false);
            };
        }
    };

    const formatDuration = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="voice-player-card card" style={{ padding: '12px', display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <button
                className="icon-btn-rounded"
                onClick={togglePlay}
                style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-blue)', width: 40, height: 40, marginRight: 12 }}
            >
                {isPlaying ? <HiOutlinePause size={20} /> : <HiOutlinePlay size={20} />}
            </button>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span style={{ fontFamily: 'monospace' }}>
                        Playback
                    </span>
                    <span style={{ fontFamily: 'monospace' }}>
                        {formatDuration(voiceNote.duration || 0)}
                    </span>
                </div>

                <div style={{ height: 4, background: 'var(--border-color)', borderRadius: 2, position: 'relative' }}>
                    <div style={{
                        height: '100%',
                        background: 'var(--primary-blue)',
                        borderRadius: 2,
                        width: isPlaying ? '100%' : '0%',
                        transition: isPlaying ? `width ${voiceNote.duration}s linear` : 'none'
                    }} />
                </div>
            </div>

            {onDelete && (
                <button
                    className="icon-btn-danger"
                    onClick={onDelete}
                    style={{ marginLeft: 12, color: 'var(--error-red)', padding: 8, background: 'transparent', border: 'none' }}
                >
                    <HiOutlineTrash size={20} />
                </button>
            )}

            {audioUrl && <audio ref={audioRef} src={audioUrl} />}
        </div>
    );
};

export default VoiceNotePlayer;
