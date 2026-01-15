import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ScreenState, Enemy, Item } from '../types';

type Zone = 'easy' | 'medium' | 'hard';

const Dungeon: React.FC = () => {
  const { player, setPlayer, setScreen, addLog } = useGame();
  
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  
  // Local state for the "5 seconds before death" phase
  const [isDying, setIsDying] = useState(false);
  
  // Revive Timer UI (Global state from context)
  const [timeLeftToRevive, setTimeLeftToRevive] = useState(0);

  // Update Revive Timer for UI
  useEffect(() => {
    let timer: any;
    if (player.isDead) {
       timer = setInterval(() => {
           const remaining = Math.max(0, Math.ceil((player.reviveTimestamp - Date.now()) / 1000));
           setTimeLeftToRevive(remaining);
       }, 1000);
    }
    return () => clearInterval(timer);
  }, [player.isDead, player.reviveTimestamp]);

  // COMBAT LOOP
  useEffect(() => {
    if (!enemy || player.isDead || isDying || !selectedZone) return;

    // Determine attack interval based on speed
    let intervalTime = 2000;
    if (enemy.speedRating === 'fast') intervalTime = 1000;
    if (enemy.speedRating === 'slow') intervalTime = 3000;

    const interval = setInterval(() => {
        // Enemy Logic: Attack Player
        if (enemy.hp > 0 && player.hp > 0) {
            const dmgToPlayer = Math.max(1, enemy.attack - player.defense);
            
            const nextHp = player.hp - dmgToPlayer;

            if (nextHp <= 0) {
                // START DYING PHASE
                setPlayer(prev => ({ ...prev, hp: 0 }));
                setCombatLog(prev => [...prev, `${enemy.name} tung đòn chí mạng! Bạn đã gục ngã...`].slice(-6));
                setIsDying(true); // Stop combat

                // Wait 5 seconds before actual Death
                setTimeout(() => {
                    setPlayer(prev => ({
                        ...prev,
                        hp: 0,
                        isDead: true,
                        reviveTimestamp: Date.now() + 60000 // 1 minute from now
                    }));
                    setEnemy(null);
                    setIsDying(false);
                }, 5000);

            } else {
                // Normal Hit
                setPlayer(prev => ({ ...prev, hp: nextHp }));
                setCombatLog(prev => [...prev, `${enemy.name} tấn công! Bạn mất ${dmgToPlayer} HP.`].slice(-6));
            }
        }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [enemy, player.isDead, isDying, player.hp, player.defense, selectedZone]); 

  const generateEnemy = (zone: Zone): Enemy => {
    let namePrefix = "Tiểu Yêu";
    let baseAtk = 15;
    let baseHp = 100;
    let baseDef = 5;

    // Simple level simulation: 1-10 for easy, 10-50 medium, etc.
    let level = 1;
    if (zone === 'easy') level = Math.floor(Math.random() * 10) + 1;
    if (zone === 'medium') { level = Math.floor(Math.random() * 40) + 11; namePrefix = "Yêu Vương"; }
    if (zone === 'hard') { level = Math.floor(Math.random() * 50) + 51; namePrefix = "Cổ Thú"; }

    // Balancing Formula:
    // Easy: Damage 15 start, +2 per level -> Level 1 = 17, Level 10 = 35.
    // Scale up for zones.
    
    if (zone === 'easy') {
        baseHp = 100 + (level * 50);
        baseAtk = 15 + (level * 2); 
        baseDef = 10 + level;
    } else if (zone === 'medium') {
        baseHp = 1000 + (level * 200);
        baseAtk = 200 + (level * 10);
        baseDef = 100 + (level * 5);
    } else {
        baseHp = 10000 + (level * 500);
        baseAtk = 2000 + (level * 50);
        baseDef = 1000 + (level * 10);
    }

    // Random Variance (+- 10%)
    const hp = Math.floor(baseHp * (0.9 + Math.random() * 0.2));
    const atk = Math.floor(baseAtk * (0.9 + Math.random() * 0.2));
    const def = Math.floor(baseDef * (0.9 + Math.random() * 0.2));

    return {
      name: `${namePrefix} Cấp ${level}`,
      hp, maxHp: hp,
      attack: atk,
      defense: def,
      speedRating: Math.random() > 0.6 ? 'fast' : Math.random() < 0.3 ? 'slow' : 'normal',
      rewardStones: zone === 'easy' ? 50 : zone === 'medium' ? 500 : 5000,
      rewardQi: zone === 'easy' ? 100 : zone === 'medium' ? 1000 : 10000
    };
  };

  const generateLoot = (zone: Zone) => {
      if (Math.random() > 0.4) return; // 40% chance to drop nothing

      const type = Math.random() > 0.5 ? 'weapon' : 'armor';
      let minStat = 1, maxStat = 10;
      let name = "Rác";

      if (zone === 'easy') { minStat = 1; maxStat = 10; name = "Phàm"; }
      if (zone === 'medium') { minStat = 10; maxStat = 50; name = "Linh"; }
      if (zone === 'hard') { minStat = 50; maxStat = 500; name = "Tiên"; }

      const statVal = Math.floor(Math.random() * (maxStat - minStat)) + minStat;
      
      const newItem: Item = {
          id: `drop_${Date.now()}`,
          type: type,
          name: `${name} ${type === 'weapon' ? 'Kiếm' : 'Giáp'} [+${statVal}]`,
          price: statVal * 10,
          description: `Vật phẩm rơi từ phó bản ${zone}.`,
          attackBonus: type === 'weapon' ? statVal : 0,
          defenseBonus: type === 'armor' ? statVal : 0
      };

      setPlayer(prev => ({
          ...prev,
          inventory: [...prev.inventory, newItem]
      }));
      setCombatLog(prev => [...prev, `Nhặt được: ${newItem.name}`].slice(-6));
  };

  const startBattle = (zone: Zone) => {
    if (player.isDead) return;
    if (player.hp <= 0) {
        addLog("Bạn cần hồi phục trước!");
        return;
    }
    
    setSelectedZone(zone);
    const newEnemy = generateEnemy(zone);
    setEnemy(newEnemy);
    setCombatLog([`Tiến vào khu ${zone.toUpperCase()}. Gặp ${newEnemy.name} (ATK:${newEnemy.attack}, HP:${newEnemy.maxHp})`]);
  };

  const attack = () => {
    if (!enemy || player.isDead || isDying || player.hp <= 0) return;

    // Player hits enemy
    const dmgToEnemy = Math.max(1, player.attack - enemy.defense);
    const newEnemyHp = enemy.hp - dmgToEnemy;
    
    setCombatLog(prev => [...prev, `Bạn gây ${dmgToEnemy} sát thương.`].slice(-6));

    if (newEnemyHp <= 0) {
        // Victory
        setEnemy(null);
        setCombatLog(prev => [...prev, `Chiến thắng! Nhận ${enemy.rewardStones} Đá, ${enemy.rewardQi} Qi.`].slice(-6));
        setPlayer(prev => ({
            ...prev,
            stones: prev.stones + enemy.rewardStones,
            qi: Math.min(prev.qi + enemy.rewardQi, prev.maxQi)
        }));
        generateLoot(selectedZone!);
    } else {
        setEnemy({ ...enemy, hp: newEnemyHp });
    }
  };

  const flee = () => {
      setEnemy(null);
      setSelectedZone(null);
      setCombatLog(['Đã rút lui an toàn.']);
  };

  // If Dead
  if (player.isDead) {
      return (
          <div className="flex flex-col h-full items-center justify-center p-6 bg-dark text-center">
              <h2 className="text-4xl text-red-600 font-cinzel font-black mb-4">TRỌNG THƯƠNG</h2>
              <p className="text-gray-400 mb-8">Bạn đã bị đánh bại. Kinh mạch tổn hại nghiêm trọng.</p>
              <div className="text-6xl font-bold text-white mb-4 animate-pulse">{timeLeftToRevive}s</div>
              <p className="text-sm text-gray-500">Vui lòng chờ hồi phục...</p>
              <button onClick={() => setScreen(ScreenState.MAIN_HALL)} className="mt-8 px-6 py-2 border border-gray-600 rounded-full">Quay về sảnh</button>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setScreen(ScreenState.MAIN_HALL)} className="text-cyan text-4xl hover:scale-110 transition-transform">↩</button>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple">PHÓ BẢN</h2>
        <div className="w-10"></div>
      </div>

      {!enemy ? (
          // Zone Selection
          <div className="flex-1 flex flex-col gap-6 items-center justify-center">
              <div className="text-center mb-4 text-gray-400">Chọn độ khó để khiêu chiến</div>
              
              <button onClick={() => startBattle('easy')} className="w-full max-w-md p-6 rounded-2xl bg-gradient-to-r from-green-900/50 to-green-600/50 border border-green-500 hover:scale-105 transition-transform flex justify-between items-center group">
                  <div className="text-left">
                      <div className="text-2xl font-bold text-green-400">KHU DỄ</div>
                      <div className="text-xs text-gray-300">Quái: Cấp 1-10 | Đồ: Cấp 1-10</div>
                  </div>
                  <div className="text-4xl group-hover:rotate-12 transition-transform">🌲</div>
              </button>

              <button onClick={() => startBattle('medium')} className="w-full max-w-md p-6 rounded-2xl bg-gradient-to-r from-yellow-900/50 to-yellow-600/50 border border-yellow-500 hover:scale-105 transition-transform flex justify-between items-center group">
                  <div className="text-left">
                      <div className="text-2xl font-bold text-yellow-400">KHU TRUNG</div>
                      <div className="text-xs text-gray-300">Quái: Cấp 10-50 | Đồ: Cấp 10-50</div>
                  </div>
                  <div className="text-4xl group-hover:rotate-12 transition-transform">🏔️</div>
              </button>

              <button onClick={() => startBattle('hard')} className="w-full max-w-md p-6 rounded-2xl bg-gradient-to-r from-red-900/50 to-red-600/50 border border-red-500 hover:scale-105 transition-transform flex justify-between items-center group">
                  <div className="text-left">
                      <div className="text-2xl font-bold text-red-500">KHU KHÓ</div>
                      <div className="text-xs text-gray-300">Quái: Cấp 50+ | Đồ: Cấp 50+</div>
                  </div>
                  <div className="text-4xl group-hover:rotate-12 transition-transform">🌋</div>
              </button>
          </div>
      ) : (
          // Battle UI
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
              {/* Combat Stats */}
              <div className={`w-full bg-dark/60 border ${isDying ? 'border-red-600 animate-pulse' : 'border-white/10'} rounded-3xl p-6 backdrop-blur-md mb-4`}>
                  <div className="flex justify-between items-end mb-6">
                      {/* Player */}
                      <div className="text-center w-1/3">
                          <img src={player.avatar} className="w-16 h-16 rounded-full border-2 border-cyan mx-auto mb-2" />
                          <div className="font-bold text-cyan text-sm">{player.name}</div>
                          <div className="w-full bg-gray-700 h-2 rounded-full mt-1"><div className="bg-green-500 h-full" style={{width: `${(player.hp/player.maxHp)*100}%`}}></div></div>
                          <div className="text-xs">{player.hp}/{player.maxHp}</div>
                      </div>
                      
                      <div className="text-2xl font-black text-red-500 italic pb-4">VS</div>

                      {/* Enemy */}
                      <div className="text-center w-1/3">
                          <div className="w-16 h-16 rounded-full border-2 border-red-500 bg-red-900/50 mx-auto mb-2 flex items-center justify-center text-3xl">{enemy.hp > 10000 ? '🐲' : '🐺'}</div>
                          <div className="font-bold text-red-400 text-sm truncate">{enemy.name}</div>
                          <div className="w-full bg-gray-700 h-2 rounded-full mt-1"><div className="bg-red-500 h-full" style={{width: `${(enemy.hp/enemy.maxHp)*100}%`}}></div></div>
                          <div className="text-xs">{enemy.hp}/{enemy.maxHp}</div>
                      </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-4">
                      {isDying ? (
                          <div className="w-full text-center text-red-500 font-bold text-xl py-4">BẠN ĐÃ GỤC NGÃ...</div>
                      ) : (
                          <>
                            <button onClick={attack} className="flex-1 py-4 bg-cyan/20 border border-cyan text-cyan font-bold rounded-xl hover:bg-cyan hover:text-dark active:scale-95 transition-all">
                                TẤN CÔNG
                            </button>
                            <button onClick={flee} className="px-6 py-4 bg-gray-700 border border-gray-500 text-gray-300 font-bold rounded-xl active:scale-95 hover:bg-gray-600">
                                BỎ CHẠY
                            </button>
                          </>
                      )}
                  </div>
              </div>

              {/* Logs */}
              <div className="w-full h-32 bg-black/40 rounded-xl border border-white/5 p-4 overflow-y-auto text-xs font-mono">
                  {combatLog.map((l, i) => <div key={i} className="border-b border-white/5 pb-1 mb-1">{l}</div>)}
              </div>
          </div>
      )}
    </div>
  );
};

export default Dungeon;