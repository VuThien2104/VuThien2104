import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ScreenState } from '../types';

const Intro: React.FC = () => {
  const { setScreen } = useGame();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Animation sequence
    const t1 = setTimeout(() => setStage(1), 500); // Logo
    const t2 = setTimeout(() => setStage(2), 1500); // Title
    const t3 = setTimeout(() => setStage(3), 3000); // Tagline
    const t4 = setTimeout(() => setStage(4), 4000); // Button

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, []);

  const handleStart = () => {
    const saved = localStorage.getItem('tuTienPlayer');
    if (saved) {
        setScreen(ScreenState.MAIN_HALL);
    } else {
        setScreen(ScreenState.LOGIN);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className={`flex items-center gap-4 mb-8 transition-all duration-1000 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan to-gold flex items-center justify-center text-4xl font-black text-dark shadow-[0_0_50px_rgba(123,228,255,0.6)] animate-float">
          仙
        </div>
        <div className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan">
          Tu Tiên Giới
        </div>
      </div>

      <h1 className={`font-cinzel text-7xl md:text-9xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-purple to-gold transition-all duration-1000 delay-500 ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ textShadow: '0 0 60px rgba(123,228,255,0.5)' }}>
        Vũ Trụ Huyền Ảo
      </h1>

      <div className={`text-xl md:text-3xl font-bold tracking-[8px] text-[#ffeb99] mt-8 mb-16 transition-all duration-1000 delay-1000 ${stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        Vạn cổ trường sinh • Nhất niệm thành tiên
      </div>

      <button 
        onClick={handleStart}
        className={`px-16 py-6 text-2xl font-black tracking-widest text-dark bg-gradient-to-r from-cyan to-gold rounded-full shadow-[0_15px_50px_rgba(123,228,255,0.5)] hover:transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 ${stage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 animate-pulse-slow'}`}
      >
        BẮT ĐẦU HÀNH TRÌNH
      </button>
    </div>
  );
};

export default Intro;