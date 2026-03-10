import React, { useRef, useEffect } from 'react';

const AnimatedAvatar = ({
    avatar = {
        bodyStyle: 'circle',
        bodyColor: '#4ECDC4',
        eyesStyle: 'round',
        eyesColor: '#000000',
        mouthStyle: 'smile',
        accentColor: '#FF6B9D',
        hasGlasses: false
    },
    size = 120,
    autoAnimate = true,
    onClick
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Set canvas resolution
        const dpr = window.devicePixelRatio || 1;
        // We add a little padding to the canvas so animations don't clip
        const padding = size * 0.1;
        const actualSize = size + padding * 2;
        canvas.width = actualSize * dpr;
        canvas.height = actualSize * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${actualSize}px`;
        canvas.style.height = `${actualSize}px`;

        let animationFrameId;
        let startTime = Date.now();
        let nextBlinkTime = startTime + 3000;
        let isBlinking = false;
        let blinkStartTime = 0;

        const draw = () => {
            const now = Date.now();
            const elapsed = (now - startTime) / 1000; // in seconds

            ctx.clearRect(0, 0, actualSize, actualSize);

            let blinkValue = 0; // 0 open, 1 closed
            if (autoAnimate) {
                if (!isBlinking && now > nextBlinkTime) {
                    isBlinking = true;
                    blinkStartTime = now;
                }

                if (isBlinking) {
                    const blinkElapsed = now - blinkStartTime;
                    // blink takes 300ms total (150 down, 150 up)
                    if (blinkElapsed < 150) {
                        blinkValue = blinkElapsed / 150;
                    } else if (blinkElapsed < 300) {
                        blinkValue = 1 - ((blinkElapsed - 150) / 150);
                    } else {
                        isBlinking = false;
                        blinkValue = 0;
                        nextBlinkTime = now + 3000 + Math.random() * 2000;
                    }
                }
            }

            // Sine wave between -1 and 1
            const eyeMoveValue = autoAnimate ? Math.sin(elapsed * Math.PI) : 0;
            const mouthValue = autoAnimate ? (Math.sin(elapsed * Math.PI * 2) + 1) / 2 : 0.5; // 0 to 1
            const bodyValue = autoAnimate ? Math.sin(elapsed * Math.PI) : 0; // -1 to 1

            // Center with body animation offset
            const cx = actualSize / 2 + (bodyValue * size * 0.02);
            const cy = actualSize / 2;

            const bodyRadius = size * 0.35;
            const outlineWidth = size * 0.018;

            // Draw Body
            ctx.fillStyle = avatar.bodyColor || '#4ECDC4';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = outlineWidth;
            ctx.beginPath();

            if (avatar.bodyStyle === 'square') {
                ctx.rect(cx - bodyRadius, cy - bodyRadius, bodyRadius * 2, bodyRadius * 2);
            } else if (avatar.bodyStyle === 'rounded') {
                ctx.roundRect(cx - bodyRadius, cy - bodyRadius, bodyRadius * 2, bodyRadius * 2, bodyRadius * 0.3);
            } else {
                // circle
                ctx.arc(cx, cy, bodyRadius, 0, Math.PI * 2);
            }
            ctx.fill();
            ctx.stroke();

            // Facial features
            const eyeSpacing = size * 0.13;
            const eyeSize = size * 0.11;
            const leftEyeCenter = { x: cx - eyeSpacing, y: cy + size * 0.02 };
            const rightEyeCenter = { x: cx + eyeSpacing, y: cy + size * 0.02 };

            // Draw Eyes
            const drawEye = (center) => {
                if (avatar.eyesStyle === 'x_eyes') {
                    const yOffset = -size * 0.02;
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = size * 0.022;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(center.x - eyeSize * 0.35, center.y + yOffset - eyeSize * 0.35);
                    ctx.lineTo(center.x + eyeSize * 0.35, center.y + yOffset + eyeSize * 0.35);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(center.x + eyeSize * 0.35, center.y + yOffset - eyeSize * 0.35);
                    ctx.lineTo(center.x - eyeSize * 0.35, center.y + yOffset + eyeSize * 0.35);
                    ctx.stroke();
                    return;
                }

                const eyeOpenness = 1 - blinkValue;
                const eyeHeight = eyeSize * eyeOpenness;
                const eyeYOffset = -eyeSize + (eyeSize * blinkValue);

                if (avatar.eyesStyle === 'square') {
                    if (blinkValue < 0.95) {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(center.x - eyeSize, center.y + eyeYOffset - eyeHeight, eyeSize * 2, eyeHeight * 2);
                        ctx.strokeStyle = '#000000';
                        ctx.lineWidth = outlineWidth;
                        ctx.strokeRect(center.x - eyeSize, center.y + eyeYOffset - eyeHeight, eyeSize * 2, eyeHeight * 2);

                        const pupilOffset = eyeMoveValue * eyeSize * 0.5;
                        const pupilSize = eyeSize * 0.45;
                        ctx.fillStyle = avatar.eyesColor || '#000000';
                        ctx.fillRect(center.x + pupilOffset - pupilSize, center.y + eyeYOffset - pupilSize, pupilSize * 2, pupilSize * 2);

                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(center.x + pupilOffset + pupilSize * 0.3 - pupilSize * 0.6, center.y + eyeYOffset - pupilSize + pupilSize * 0.1, pupilSize * 0.6, pupilSize * 0.6);
                    } else {
                        ctx.strokeStyle = '#000000';
                        ctx.lineWidth = size * 0.02;
                        ctx.lineCap = 'round';
                        ctx.beginPath();
                        ctx.moveTo(center.x - eyeSize * 0.8, center.y);
                        ctx.lineTo(center.x + eyeSize * 0.8, center.y);
                        ctx.stroke();
                    }
                } else {
                    // round
                    if (blinkValue < 0.95) {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.beginPath();
                        ctx.ellipse(center.x, center.y + eyeYOffset, eyeSize, eyeHeight, 0, 0, Math.PI * 2);
                        ctx.fill();

                        const pupilOffset = eyeMoveValue * eyeSize * 0.5;
                        const pupilSize = eyeSize * 0.5;
                        ctx.fillStyle = avatar.eyesColor || '#000000';
                        ctx.beginPath();
                        ctx.arc(center.x + pupilOffset, center.y + eyeYOffset, pupilSize, 0, Math.PI * 2);
                        ctx.fill();

                        ctx.fillStyle = '#FFFFFF';
                        ctx.beginPath();
                        ctx.arc(center.x + pupilOffset + pupilSize * 0.35, center.y + eyeYOffset - pupilSize * 0.35, pupilSize * 0.35, 0, Math.PI * 2);
                        ctx.fill();

                        ctx.strokeStyle = '#000000';
                        ctx.lineWidth = outlineWidth;
                        ctx.beginPath();
                        ctx.ellipse(center.x, center.y + eyeYOffset, eyeSize, eyeHeight, 0, 0, Math.PI * 2);
                        ctx.stroke();
                    } else {
                        ctx.strokeStyle = '#000000';
                        ctx.lineWidth = size * 0.02;
                        ctx.lineCap = 'round';
                        ctx.beginPath();
                        ctx.moveTo(center.x - eyeSize * 0.8, center.y);
                        ctx.lineTo(center.x + eyeSize * 0.8, center.y);
                        ctx.stroke();
                    }
                }
            };

            drawEye(leftEyeCenter);
            drawEye(rightEyeCenter);

            // Draw Mouth
            const mouthY = cy + size * 0.18;
            ctx.fillStyle = avatar.accentColor || '#FF6B9D';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = outlineWidth;
            ctx.lineCap = 'round';

            if (avatar.mouthStyle === 'neutral') {
                const movement = mouthValue * size * 0.01;
                ctx.beginPath();
                ctx.moveTo(cx - size * 0.1, mouthY + movement);
                ctx.lineTo(cx + size * 0.1, mouthY + movement);
                ctx.strokeStyle = avatar.accentColor || '#FF6B9D';
                ctx.stroke();
            } else if (avatar.mouthStyle === 'surprised') {
                const radius = size * 0.05 + (mouthValue * size * 0.01);
                ctx.beginPath();
                ctx.arc(cx, mouthY, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            } else if (avatar.mouthStyle === 'box') {
                const boxWidth = size * 0.16;
                const boxHeight = size * 0.08;
                const movement = mouthValue * size * 0.01;
                ctx.beginPath();
                ctx.roundRect(cx - boxWidth / 2, mouthY + movement - boxHeight / 2, boxWidth, boxHeight, size * 0.015);
                ctx.fill();
                ctx.stroke();
            } else {
                // smile
                const movement = mouthValue * size * 0.02;
                ctx.strokeStyle = avatar.accentColor || '#FF6B9D';
                ctx.beginPath();
                ctx.arc(cx, mouthY + movement, size * 0.1, 0, Math.PI, false);
                ctx.stroke();
            }

            // Draw Glasses
            if (avatar.hasGlasses) {
                const glassYOffset = -size * 0.03;
                const gLeft = { x: leftEyeCenter.x, y: leftEyeCenter.y + glassYOffset };
                const gRight = { x: rightEyeCenter.x, y: rightEyeCenter.y + glassYOffset };

                ctx.strokeStyle = 'rgba(0,0,0,0.87)';
                ctx.lineWidth = size * 0.024;
                ctx.beginPath();
                ctx.arc(gLeft.x, gLeft.y, eyeSize, 0, Math.PI * 2);
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(gRight.x, gRight.y, eyeSize, 0, Math.PI * 2);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(gLeft.x + eyeSize - size * 0.02, gLeft.y);
                ctx.lineTo(gRight.x - eyeSize + size * 0.02, gRight.y);
                ctx.stroke();
            }

            if (autoAnimate) {
                animationFrameId = requestAnimationFrame(draw);
            }
        };

        draw();

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [avatar, size, autoAnimate]);

    return (
        <div
            style={{ cursor: onClick ? 'pointer' : 'default', display: 'inline-block' }}
            onClick={onClick}
        >
            <canvas ref={canvasRef} />
        </div>
    );
};

export default AnimatedAvatar;
