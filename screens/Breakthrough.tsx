import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { ScreenState } from '../types';
import { REALMS } from '../constants';

const Breakthrough: React.FC = () => {
  const { player, setPlayer, setScreen, gainQi, addLog } = useGame();
  const [isMeditating, setIsMeditating] = useState(false);
  
  // Timer for 60s reward
  const holdTimeRef = useRef(0);

  // Auto gain Qi while meditating & Stone Logic
  useEffect(() => {
    let interval: any;
    if (isMeditating) {
      interval = setInterval(() => {
        // 1. Gain Qi
        gainQi(5);
        
        // 2. Track Time for Stones (tick every 500ms)
        holdTimeRef.current += 500;
        
        // 3. Reward every 60 seconds (60000ms)
        if (holdTimeRef.current >= 60000) {
            // Reset timer
            holdTimeRef.current = 0;
            
            // Calculate random stone amount (Low rate for 100)
            const isLucky = Math.random() < 0.05; // 5% chance for 100
            const amount = isLucky ? 100 : Math.floor(Math.random() * 20) + 1;
            
            setPlayer(prev => ({
                ...prev,
                stones: prev.stones + amount
            }));

            if (amount === 100) {
                addLog(`Cảm ngộ thiên địa 1 phút, đại cơ duyên nhận 100 Linh Thạch!`);
            } else {
                addLog(`Ngồi thiền 1 phút, linh khí ngưng tụ thành ${amount} Linh Thạch.`);
            }
        }

      }, 500);
    } else {
        // Reset if released (Optional: Keep it if you want cumulative? Prompt implies continuous hold)
        holdTimeRef.current = 0;
    }
    return () => clearInterval(interval);
  }, [isMeditating]);

  const handleBreakthrough = () => {
    if (player.qi >= player.maxQi) {
      const baseRate = Math.max(50, 95 - (player.realmLevel * 2)); 
      const totalRate = Math.min(100, baseRate + player.breakthroughChance);
      const isSuccess = Math.random() * 100 < totalRate;

      if (isSuccess) {
          const currentRealmIndex = REALMS.findIndex(r => player.realm.includes(r));
          const nextLevel = player.realmLevel + 1;
          
          let newRealm = player.realm;
          let newLevel = nextLevel;
          let newMaxQi = Math.floor(player.maxQi * 1.5);
          let newAttack = player.attack + 10;
          let newMaxHp = player.maxHp + 50;
          let bonusPoints = 10;

          if (nextLevel > 9) {
              const nextRealmName = REALMS[currentRealmIndex + 1] || "Vô Thượng";
              newRealm = `${nextRealmName} Tầng 1`;
              newLevel = 1;
              newAttack += 50;
              newMaxHp += 200;
              bonusPoints = 100;
              addLog(`Độ kiếp thành công! Bước chân vào ${nextRealmName}! (+${bonusPoints} điểm)`);
          } else {
              const realmName = player.realm.split(" Tầng")[0];
              newRealm = `${realmName} Tầng ${newLevel}`;
              addLog(`Đột phá thành công! (+${bonusPoints} điểm)`);
          }

          setPlayer(prev => ({
            ...prev,
            realm: newRealm,
            realmLevel: newLevel,
            qi: 0,
            maxQi: newMaxQi,
            attack: newAttack,
            maxHp: newMaxHp,
            hp: newMaxHp,
            freePoints: prev.freePoints + bonusPoints,
            breakthroughChance: 0
          }));
      } else {
          const lossQi = Math.floor(player.maxQi * 0.3);
          setPlayer(prev => ({
              ...prev,
              qi: Math.max(0, prev.qi - lossQi),
              breakthroughChance: prev.breakthroughChance + 1
          }));
          addLog(`Thất bại! Tổn thất ${lossQi} linh lực. Tỷ lệ thành công +1%.`);
      }
    } else {
      addLog("Linh lực chưa đủ!");
    }
  };

  const percent = Math.min((player.qi / player.maxQi) * 100, 100);
  const baseRate = Math.max(50, 95 - (player.realmLevel * 2));
  const currentSuccessRate = Math.min(100, baseRate + player.breakthroughChance);

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setScreen(ScreenState.MAIN_HALL)} className="text-cyan text-4xl hover:scale-110 transition-transform">↩</button>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold to-white">TU LUYỆN</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-10">
        
        {/* Meditation Animation */}
        <div className="relative w-72 h-72 flex items-center justify-center">
            
            {/* Rear Rotating Effects (Mandala/Bagua style) */}
            <div className={`absolute inset-0 rounded-full border-4 border-dashed border-purple/30 ${isMeditating ? 'animate-[spin_10s_linear_infinite]' : 'animate-[spin_20s_linear_infinite]'}`}></div>
            <div className={`absolute inset-4 rounded-full border-2 border-dotted border-gold/30 ${isMeditating ? 'animate-[spin_8s_linear_infinite_reverse]' : 'animate-[spin_15s_linear_infinite_reverse]'}`}></div>
            <div className={`absolute inset-8 rounded-full border border-cyan/20 ${isMeditating ? 'animate-[spin_5s_linear_infinite]' : 'animate-[spin_10s_linear_infinite]'}`}></div>

            {/* Central Information */}
            <div className="absolute flex flex-col items-center z-10 p-8 rounded-full bg-dark/80 backdrop-blur-sm border border-cyan/30 shadow-[0_0_50px_rgba(123,228,255,0.2)]">
                <span className="text-5xl font-black text-white drop-shadow-[0_0_10px_var(--cyan)]">{Math.floor(percent)}%</span>
                <span className="text-sm text-cyan/80 mt-2">{player.qi} / {player.maxQi}</span>
            </div>
            
            {/* Inner pulsing aura */}
            {isMeditating && (
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan/20 to-purple/20 rounded-full animate-pulse blur-xl"></div>
            )}
        </div>

        <div className="text-center">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple to-white mb-2">{player.realm}</div>
            <div className="text-sm text-gray-400">Tỷ lệ thành công: <span className="text-gold font-bold">{currentSuccessRate}%</span></div>
            {player.breakthroughChance > 0 && <div className="text-xs text-green-400">(Cộng thêm {player.breakthroughChance}%)</div>}
        </div>

        <div className="flex gap-6 w-full max-w-md justify-center mt-4">
            <button 
                onMouseDown={() => setIsMeditating(true)}
                onMouseUp={() => setIsMeditating(false)}
                onMouseLeave={() => setIsMeditating(false)}
                onTouchStart={() => setIsMeditating(true)}
                onTouchEnd={() => setIsMeditating(false)}
                className="flex-1 py-5 bg-gradient-to-br from-cyan/20 to-blue-500/20 border-2 border-cyan rounded-2xl font-bold text-xl hover:bg-cyan/20 active:scale-95 transition-all select-none shadow-[0_0_20px_rgba(123,228,255,0.2)]"
            >
                {isMeditating ? 'Đang Hấp Thụ...' : 'Giữ Để Tu Luyện'}
            </button>

            <button 
                onClick={handleBreakthrough}
                disabled={percent < 100}
                className={`flex-1 py-5 rounded-2xl font-bold text-xl transition-all border-2 shadow-lg
                    ${percent >= 100 
                        ? 'bg-gradient-to-br from-gold to-orange-500 text-dark border-gold animate-pulse hover:scale-105 cursor-pointer shadow-gold/40' 
                        : 'bg-gray-800/50 text-gray-500 border-gray-600 cursor-not-allowed'}`}
            >
                Đột Phá
            </button>
        </div>

        <div className="bg-dark/50 p-4 rounded-xl border border-white/10 w-full max-w-lg mt-4 text-center">
             <div className="text-gray-500 text-xs italic">
                "Giữ nút tu luyện liên tục 60 giây để có cơ hội nhận Linh Thạch."
             </div>
        </div>

      </div>
    </div>
  );
};

export default Breakthrough;