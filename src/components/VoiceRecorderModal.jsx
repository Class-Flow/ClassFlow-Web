import { useState, useRef, useEffect } from 'react';
import { HiOutlineMicrophone, HiOutlinePlay, HiOutlinePause, HiOutlineStop, HiCheck, HiX } from 'react-icons/hi';
import './VoiceNotes.css';

const VoiceRecorderModal = ({ isOpen, onClose, onSave, contextType }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false); // Added

    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const audioContext = useRef(null); // Added

    const resetRecorder = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
        }
        if (audioContext.current) audioContext.current.close(); // Added

        setIsRecording(false);
        setIsPaused(false); // Added
        setDuration(0);
        setAudioUrl(null); // Moved
        audioChunks.current = [];
        // Removed: setAudioBlob(null);
        // Removed: setIsPlaying(false);
    };

    useEffect(() => {
        if (!isOpen) {
            resetRecorder();
        }
    }, [isOpen]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            mediaRecorder.current.onstop = () => {
                const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioUrl(url);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            audioChunks.current = [];
            mediaRecorder.current.start();
            setIsRecording(true);

            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access is required to record voice notes.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
        }
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const togglePlayAudio = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);

            // Set up onended listener
            audioRef.current.onended = () => {
                setIsPlaying(false);
            };
        }
    };

    const handleSave = () => {
        if (audioBlob) {
            onSave(audioBlob, duration);
            onClose();
        }
    };

    const formatDuration = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (!isOpen) return null;

    return (
        <div className="voice-modal-overlay popup-overlay">
            <div className="voice-modal-content card slide-up">
                <button className="icon-btn close-btn" onClick={onClose} style={{ position: 'absolute', top: 16, right: 16 }}>
                    <HiX />
                </button>

                <h3 style={{ marginBottom: 24, textAlign: 'center' }}>
                    {contextType === 'event' ? 'Attach Voice Note' : 'Record Voice Note'}
                </h3>

                <div className="recorder-status" style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div className={`mic-icon-wrapper ${isRecording ? 'recording-pulse' : ''}`} style={{
                        width: 80, height: 80, borderRadius: '50%', background: isRecording ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px',
                        color: isRecording ? 'var(--error-red)' : 'var(--primary-blue)'
                    }}>
                        <HiOutlineMicrophone size={40} />
                    </div>

                    <div className="duration-display" style={{ fontSize: 32, fontWeight: 700, fontFamily: 'monospace' }}>
                        {formatDuration(duration)}
                    </div>
                </div>

                {!audioUrl ? (
                    <div className="recorder-actions" style={{ display: 'flex', justifyContent: 'center' }}>
                        {!isRecording ? (
                            <button className="btn-filled record-btn" onClick={startRecording} style={{ background: 'var(--error-red)', width: '100%' }}>
                                Start Recording
                            </button>
                        ) : (
                            <button className="btn-filled stop-btn" onClick={stopRecording} style={{ background: 'var(--secondary-teal)', width: '100%' }}>
                                <HiOutlineStop className="mr-2" /> Stop Recording
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="playback-actions">
                        <audio ref={audioRef} src={audioUrl} />

                        <div className="playback-controls card" style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-secondary)', marginBottom: 24 }}>
                            <button className="icon-btn-rounded" onClick={togglePlayAudio} style={{ background: 'var(--primary-blue)', color: 'white', marginRight: 16 }}>
                                {isPlaying ? <HiOutlinePause size={20} /> : <HiOutlinePlay size={20} />}
                            </button>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Voice Note Ready</div>
                                <div style={{ height: 4, background: 'var(--border-color)', borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: isPlaying ? '100%' : '0%', background: 'var(--primary-blue)', transition: isPlaying ? `width ${duration}s linear` : 'none' }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn-outline" onClick={resetRecorder} style={{ flex: 1, borderColor: 'var(--error-red)', color: 'var(--error-red)' }}>
                                Discard
                            </button>
                            <button className="btn-filled" onClick={handleSave} style={{ flex: 1 }}>
                                <HiCheck className="mr-2" /> Save Note
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoiceRecorderModal;
