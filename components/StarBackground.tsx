import React, { useEffect, useRef } from 'react';

const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    interface Star {
      x: number;
      y: number;
      r: number;
      a: number;
      speed: number;
    }

    const stars: Star[] = [];
    for(let i=0; i<800; i++){
      stars.push({
        x: Math.random()*w,
        y: Math.random()*h,
        r: Math.random()*1.5,
        a: Math.random()*0.8+0.2,
        speed: Math.random() * 0.2
      });
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach(s => {
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fill();
        // Subtle movement
        s.y -= s.speed;
        if(s.y < 0) s.y = h;
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default StarBackground;