import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ScreenState } from '../types';

const Login: React.FC = () => {
  const { setScreen, setPlayer } = useGame();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (name.length < 2 || name.length > 12) {
      setError('Đạo hiệu phải từ 2-12 ký tự!');
      return;
    }
    
    // Initialize new player
    setPlayer(prev => ({ ...prev, name: name }));
    setScreen(ScreenState.MAIN_HALL);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="bg-dark/70 border-2 border-cyan/30 p-12 rounded-[30px] shadow-[0_0_80px_rgba(123,228,255,0.4)] animate-float max-w-lg w-full mx-4 backdrop-blur-md">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan to-gold flex items-center justify-center text-3xl font-black text-dark">
            仙
          </div>
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan">
            Tu Tiên Giới
          </div>
        </div>

        <h2 className="font-cinzel text-5xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan via-purple to-gold">
          Đăng Nhập
        </h2>

        <div className="space-y-6">
          <input 
            type="text" 
            placeholder="Đạo hiệu (Tên nhân vật)"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            className="w-full px-6 py-4 bg-white/10 border-2 border-cyan rounded-full text-xl text-white outline-none focus:border-gold focus:shadow-[0_0_30px_rgba(255,215,123,0.5)] transition-all placeholder-white/50"
          />
        </div>

        {error && <div className="mt-4 text-red-400 font-bold animate-bounce">{error}</div>}

        <button 
          onClick={handleLogin}
          className="mt-10 px-12 py-4 text-xl font-black tracking-widest text-dark bg-gradient-to-r from-cyan to-gold rounded-full shadow-[0_10px_40px_rgba(123,228,255,0.4)] hover:transform hover:-translate-y-1 hover:scale-105 transition-all w-full"
        >
          NHẬP MÔN
        </button>
      </div>
    </div>
  );
};

export default Login;