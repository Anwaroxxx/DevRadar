import React, { useEffect, useRef } from 'react';

export default function AsciiWaterfall() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d', { alpha: false }); // Optimization: static background
        let frameId;
        let lastTime = 0;
        const fpsInterval = 60; // Throttled to ~16fps for ultra-low impact
        
        const bin = "010101";
        const kata = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
        const charSet = (bin + kata).split("");
        const fontSize = 20; // Larger font = fewer operations
        
        let columns;
        let drops;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            columns = Math.ceil(canvas.width / fontSize);
            drops = new Array(columns).fill(0).map(() => Math.random() * -100);
        };

        const draw = (currentTime) => {
            frameId = requestAnimationFrame(draw);

            const elapsed = currentTime - lastTime;
            if (elapsed < fpsInterval) return;
            lastTime = currentTime - (elapsed % fpsInterval);

            // Stop logic for Light Mode or Hidden Tab
            const isLight = document.documentElement.classList.contains('light');
            if (isLight || document.hidden) {
                ctx.fillStyle = "#f4f7f6";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                return;
            }

            ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `bold ${fontSize}px monospace`;
            ctx.textAlign = "center";

            for (let i = 0; i < drops.length; i++) {
                // Performance: Stagger columns (only process even columns)
                if (i % 2 !== 0) continue;

                const text = charSet[Math.floor(Math.random() * charSet.length)];
                
                // Draw head
                ctx.fillStyle = "#fff";
                ctx.fillText(text, i * fontSize + fontSize/2, drops[i] * fontSize);

                // Draw trail body
                ctx.fillStyle = "rgba(34, 197, 94, 0.8)"; 
                ctx.fillText(text, i * fontSize + fontSize/2, (drops[i] - 1) * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
                    drops[i] = 0;
                }
                drops[i] += 1;
            }
        };

        window.addEventListener('resize', resize);
        resize();
        frameId = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}
