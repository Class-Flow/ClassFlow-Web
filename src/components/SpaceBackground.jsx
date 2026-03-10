import React, { useRef, useEffect } from 'react';
import './SpaceBackground.css';

const SpaceBackground = ({ className = '' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width, height;

        const initCanvas = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', initCanvas);
        initCanvas();

        // Configuration
        const stars = [];
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random(), // percentage 0-1
                yBase: Math.random() * 2.8, // 0-2.8 relative to height
                sz: Math.random() * 1.8 + 0.3,
                baseOp: Math.random() * 0.65 + 0.25,
                phase: Math.random() * Math.PI * 2
            });
        }

        const asteroids = [];
        const astColors = ['#0C1D2B', '#180B1E', '#091C1C', '#131009', '#100C0C'];
        for (let i = 0; i < 24; i++) {
            asteroids.push({
                x: Math.random(),
                yBase: Math.random() * 3.0,
                sz: Math.random() * 9 + 3,
                stretch: 0.6 + Math.random() * 0.8,
                col: astColors[i % astColors.length],
                i: i
            });
        }

        const shootingStars = [];

        const drawMoon = (cx, cy, r, colorHex, driftAmp, driftVal) => {
            const top = cy + Math.sin(driftVal * Math.PI * 2) * driftAmp;
            const offsetX = Math.cos(driftVal * Math.PI * 1.8) * (driftAmp * 0.6);
            const fCx = cx + offsetX;
            const fCy = top;

            ctx.save();
            // Base color
            ctx.beginPath();
            ctx.arc(fCx, fCy, r, 0, Math.PI * 2);
            ctx.fillStyle = colorHex + 'DC'; // ~86% opacity hex
            ctx.fill();

            // Shadow side
            const grad = ctx.createLinearGradient(fCx - r, fCy, fCx + r, fCy);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(1, 'rgba(0,0,0,0.25)');
            ctx.beginPath();
            ctx.arc(fCx, fCy, r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Craters manually
            const craters = [
                { x: fCx - r * 0.48, y: fCy - r * 0.42, r: r * 0.060 },
                { x: fCx + r * 0.38, y: fCy + r * 0.28, r: r * 0.040 },
                { x: fCx + r * 0.08, y: fCy - r * 0.60, r: r * 0.027 },
            ];
            craters.forEach(c => {
                ctx.beginPath();
                ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0,0,0,0.28)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(0,0,0,0.14)';
                ctx.lineWidth = 0.6;
                ctx.stroke();
            });

            // Rim highlight
            ctx.beginPath();
            ctx.arc(fCx, fCy, r, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.06)';
            ctx.lineWidth = 1.0;
            ctx.stroke();
            ctx.restore();
        };

        const drawPlanet = (cx, cy, r, bodyHex, ringHex, hasRing, driftAmp, driftVal, isLeft) => {
            const top = cy + Math.sin(driftVal * Math.PI * 2) * driftAmp;
            const offsetX = Math.cos((driftVal + (isLeft ? cx : width - cx) * 0.1) * Math.PI * 1.8) * (driftAmp * 0.6);
            const fCx = cx + offsetX;
            const fCy = top;

            ctx.save();
            const drawRing = (behind) => {
                ctx.beginPath();
                ctx.ellipse(fCx, fCy + 4, r * 1.45, r * 0.275, 0, behind ? Math.PI : 0, behind ? Math.PI * 2 : Math.PI);
                ctx.strokeStyle = ringHex + (behind ? '8c' : '59'); // roughly 55% or 35% alpha
                ctx.lineWidth = r * 0.22;
                ctx.stroke();
            };

            if (hasRing) drawRing(true);

            ctx.beginPath();
            ctx.arc(fCx, fCy, r, 0, Math.PI * 2);
            ctx.fillStyle = bodyHex + 'EB'; // 92% opacity
            ctx.fill();

            const grad = ctx.createRadialGradient(fCx - r * 0.4, fCy - r * 0.4, 0, fCx, fCy, r);
            grad.addColorStop(0, 'rgba(255,255,255,0.07)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.beginPath();
            ctx.arc(fCx, fCy, r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(fCx, fCy, r, 0, Math.PI * 2);
            ctx.strokeStyle = ringHex + '47'; // 28% alpha
            ctx.lineWidth = 1;
            ctx.stroke();

            if (hasRing) drawRing(false);
            ctx.restore();
        };

        const drawGlow = (cx, cy, r, colorRGBA) => {
            ctx.save();
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r / 2);
            grad.addColorStop(0, colorRGBA);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.beginPath();
            ctx.arc(cx, cy, r / 2, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
        };

        let startTime = Date.now();
        let lastShootingStarTime = Date.now();

        const draw = () => {
            if (!width || !height) return;
            const now = Date.now();
            const elapsedSecs = (now - startTime) / 1000;

            ctx.clearRect(0, 0, width, height);

            // Base Gradient
            const bgGrad = ctx.createLinearGradient(0, 0, width, height);
            bgGrad.addColorStop(0, '#020B14');
            bgGrad.addColorStop(0.4, '#071828');
            bgGrad.addColorStop(0.72, '#0A2030');
            bgGrad.addColorStop(1, '#060E1A');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            const drift = (elapsedSecs % 8) / 8; // 0 to 1 over 8 seconds
            const twinkle = (elapsedSecs % 4) / 4; // 0 to 1 over 4 seconds

            // Auroras
            drawGlow(width - 120 + Math.cos(drift * Math.PI * 1.7) * 3.2,
                -200 + Math.sin(drift * Math.PI * 2) * 4.5 + 260, // shifted to show
                520, 'rgba(0, 217, 255, 0.08)');
            drawGlow(-180 + Math.cos((drift + 0.3) * Math.PI * 1.5) * 3.5,
                height * 0.35 + Math.sin((drift + 0.3) * Math.PI * 2) * 3.8 + 240,
                480, 'rgba(0, 119, 182, 0.10)');
            drawGlow(width - 100 + Math.cos((drift + 0.6) * Math.PI * 1.9) * 2.8,
                height + 260 + Math.sin((drift + 0.6) * Math.PI * 2) * 4.2 - 300,
                600, 'rgba(2, 62, 138, 0.12)');

            // Stars
            stars.forEach(s => {
                const y = (s.yBase * height) % (height * 1.7);
                const twinkleAmount = Math.sin(twinkle * Math.PI * 2 + s.phase) * 0.15;
                let op = s.baseOp + twinkleAmount;
                if (op < 0.15) op = 0.15;
                if (op > 0.90) op = 0.90;

                ctx.beginPath();
                ctx.arc(s.x * width, y, s.sz / 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${op})`;
                if (s.sz > 1.4) {
                    ctx.shadowColor = `rgba(0, 217, 255, ${op * 0.22})`;
                    ctx.shadowBlur = 3;
                } else {
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
            });
            ctx.shadowBlur = 0;

            // Moons
            drawMoon(width * 0.04, 240, 60, '#B5D8E8', 3.2, drift);
            drawMoon(width - (width * 0.05) - 44, 560, 44, '#6EC6C6', 2.8, drift);
            drawMoon(width * 0.22, 1080, 52.5, '#8DBBD4', 2.2, drift);

            // Dark Planets
            drawPlanet(width - (width * 0.16) - 22, 155, 22, '#1A0B32', '#4B1080', true, 3.5, drift, false);
            drawPlanet(width * 0.52, 430, 15, '#0B2514', '#000000', false, 2.6, drift, true);
            drawPlanet(width * 0.07, 695, 26, '#0E1E38', '#1C3A62', true, 3.0, drift, true);
            drawPlanet(width - (width * 0.11) - 13, 940, 13, '#1E0B0E', '#000000', false, 2.4, drift, false);
            drawPlanet(width * 0.60, 1260, 18, '#181805', '#38380A', true, 2.9, drift, true);

            // Asteroids
            asteroids.forEach(a => {
                const y = (a.yBase * height) % (height * 1.9);
                const driftX = Math.sin((drift + a.i * 0.05) * Math.PI * 2) * 1.5;
                const driftY = Math.cos((drift + a.i * 0.07) * Math.PI * 1.5) * 1.2;
                ctx.save();
                ctx.beginPath();
                ctx.ellipse(a.x * width + driftX, y + driftY, a.sz / 2, (a.sz * a.stretch) / 2, 0, 0, Math.PI * 2);
                ctx.fillStyle = a.col;
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.03)';
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.restore();
            });

            // Shooting Stars Logic
            if (now - lastShootingStarTime > 50) {
                lastShootingStarTime = now;
                for (let s of shootingStars) {
                    const elapsed = now - s.spawnTime;
                    s.progress = Math.min(1.0, elapsed / 2000.0);
                }
                for (let i = shootingStars.length - 1; i >= 0; i--) {
                    if (shootingStars[i].progress >= 1.0) shootingStars.splice(i, 1);
                }
                if (shootingStars.length < 3 && Math.random() < 0.05) {
                    const edge = Math.floor(Math.random() * 3);
                    let startX, startY;
                    if (edge === 0) {
                        startX = Math.random() * width; startY = -50 - Math.random() * 200;
                    } else if (edge === 1) {
                        startX = -50 - Math.random() * 200; startY = Math.random() * height * 0.7;
                    } else {
                        startX = -100 - Math.random() * 300; startY = -100 - Math.random() * 300;
                    }
                    const travelAngle = Math.random() * (Math.PI / 3) + (Math.PI / 6);
                    const distance = Math.random() * 400 + 300;
                    const endX = startX + Math.cos(travelAngle) * distance;
                    const endY = startY + Math.sin(travelAngle) * distance;

                    shootingStars.push({
                        startX, startY, endX, endY,
                        thickness: Math.random() * 0.8 + 0.2,
                        length: Math.random() * 120 + 80,
                        angle: Math.atan2(endY - startY, endX - startX),
                        baseOpacity: Math.random() * 0.35 + 0.15,
                        spawnTime: now,
                        progress: 0.0
                    });
                }
            }

            // Draw Shooting Stars
            shootingStars.forEach(s => {
                const x = s.startX + (s.endX - s.startX) * s.progress;
                const y = s.startY + (s.endY - s.startY) * s.progress;
                const opacity = (1.0 - s.progress) * s.baseOpacity;

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(s.angle);
                const grad = ctx.createLinearGradient(0, 0, s.length, 0);
                grad.addColorStop(0, 'rgba(255,255,255,0)');
                grad.addColorStop(0.5, `rgba(255,255,255,${opacity})`);
                grad.addColorStop(1, `rgba(255,255,255,${opacity * 0.5})`);
                ctx.fillStyle = grad;
                ctx.fillRect(0, -s.thickness / 2, s.length, s.thickness);
                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', initCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className={`space-background ${className}`} />;
};

export default SpaceBackground;
