import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ScreenState, Item } from '../types';
import { MENU_ICONS } from '../constants';

interface MenuBtnProps {
  icon: string;
  text: string;
  onClick: () => void;
}

const MenuBtn: React.FC<MenuBtnProps> = ({ icon, text, onClick }) => (
  <button 
    onClick={onClick}
    className="group relative aspect-square bg-dark/70 border-[3px] border-cyan rounded-[30px] flex flex-col items-center justify-center overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:border-gold hover:shadow-[0_20px_70px_rgba(255,215,123,0.4)] shadow-[0_0_40px_rgba(123,228,255,0.2)]"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
    <div className="text-6xl md:text-7xl mb-4 drop-shadow-[0_0_20px_var(--cyan)] filter grayscale-0">{icon}</div>
    <div className="text-sm md:text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan to-gold text-center px-2">
      {text}
    </div>
  </button>
);

const MainHall: React.FC = () => {
  const { player, setPlayer, setScreen, logout, useItem, equipItem, addLog } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showBag, setShowBag] = useState(false);
  const [giftCode, setGiftCode] = useState('');

  const increaseStat = (stat: 'attack' | 'maxHp' | 'defense') => {
    if (player.freePoints > 0) {
      setPlayer(prev => ({
        ...prev,
        freePoints: prev.freePoints - 1,
        [stat]: prev[stat] + (stat === 'maxHp' ? 10 : 1)
      }));
    }
  };

  const handleItemClick = (item: Item) => {
      if (item.type === 'weapon' || item.type === 'armor') {
          equipItem(item);
      } else {
          useItem(item);
      }
  };

  const handleRedeemCode = () => {
      const code = giftCode.toUpperCase().trim();
      if (code === 'TANTHU') {
          setPlayer(prev => ({ ...prev, stones: prev.stones + 1000, qi: prev.qi + 500 }));
          addLog("Nhập code TANTHU thành công! Nhận 1000 Đá, 500 Qi.");
          setGiftCode('');
      } else if (code === 'TET2025') {
          setPlayer(prev => ({ ...prev, stones: prev.stones + 2025 }));
          addLog("Chúc mừng năm mới! Nhận 2025 Đá.");
          setGiftCode('');
      } else {
          addLog("Mã quà tặng không đúng hoặc đã hết hạn.");
      }
  };

  // Calculate percentage for progress bar
  const progressPercent = Math.min((player.qi / player.maxQi) * 100, 100);

  return (
    <div className="flex flex-col h-full p-4 md:p-6 gap-4">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-dark/60 border-2 border-cyan/40 rounded-[25px] backdrop-blur-md relative z-20">
        <img src={player.avatar} alt="Avatar" className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-cyan object-cover shadow-[0_0_30px_rgba(123,228,255,0.6)] animate-float cursor-pointer" />
        
        <div className="flex-1 text-center">
          <div className="text-3xl md:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan to-gold">
            {player.name}
          </div>
          <div className="text-xl md:text-2xl mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple to-gold font-bold">
            {player.realm} • {player.stones} Đá
          </div>
        </div>

        <button 
          onClick={() => setShowSettings(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple to-gold flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(212,179,255,0.6)] animate-float hover:rotate-90 transition-transform duration-500 text-dark"
        >
          ⚙
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex items-center justify-center overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl p-2">
          <MenuBtn icon={MENU_ICONS.SKILLS} text="CÔNG PHÁP" onClick={() => setScreen(ScreenState.SKILLS)} />
          <MenuBtn icon={MENU_ICONS.BREAKTHROUGH} text="TU LUYỆN" onClick={() => setScreen(ScreenState.BREAKTHROUGH)} />
          <MenuBtn icon={MENU_ICONS.DUNGEON} text="PHÓ BẢN" onClick={() => setScreen(ScreenState.DUNGEON)} />
          <MenuBtn icon={MENU_ICONS.SHOP} text="THƯƠNG ĐIẾM" onClick={() => setScreen(ScreenState.SHOP)} />
          <MenuBtn icon={MENU_ICONS.EVENTS} text="SỰ KIỆN" onClick={() => setScreen(ScreenState.RANKING)} />
          <MenuBtn icon={MENU_ICONS.SECT} text="TÔNG MÔN" onClick={() => setScreen(ScreenState.SECT)} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-4 bg-dark/60 border-2 border-cyan/30 rounded-[25px] backdrop-blur-md gap-4">
        {/* Túi Đồ Button */}
        <button 
          onClick={() => setShowBag(true)}
          className="w-20 h-20 bg-gradient-to-br from-purple to-gold rounded-2xl flex flex-col items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform text-dark border-2 border-white/20 flex-shrink-0"
        >
          <span className="text-3xl">🎒</span>
          <span className="text-xs font-bold mt-1">Túi Đồ</span>
        </button>

        {/* Thanh Tiến Độ Tu Vi (Changed from Mission Text) */}
        <div className="flex-1 h-20 flex flex-col justify-center px-2">
            <div className="flex justify-between text-sm mb-1 px-1">
                <span className="text-cyan font-bold">Tu Vi</span>
                <span className="text-gray-300">{Math.floor(progressPercent)}%</span>
            </div>
            <div className="w-full h-8 bg-black/50 rounded-full border border-white/20 relative overflow-hidden">
                {/* Background pulse effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/0 via-blue-500/10 to-blue-900/0 animate-[shimmer_2s_infinite]"></div>
                
                {/* Progress Bar */}
                <div 
                    className="h-full bg-gradient-to-r from-cyan via-blue-500 to-purple-600 transition-all duration-500 relative"
                    style={{ width: `${progressPercent}%` }}
                >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[moveStripe_1s_linear_infinite]"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                </div>

                {/* Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center text-xs md:text-sm font-bold text-white drop-shadow-md z-10">
                    {player.qi} / {player.maxQi} Linh Khí
                </div>
            </div>
        </div>

        {/* Thông Số Button */}
        <button 
          onClick={() => setShowStats(true)}
          className="w-20 h-20 bg-gradient-to-br from-cyan to-blue-500 rounded-2xl flex flex-col items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform text-dark border-2 border-white/20 flex-shrink-0"
        >
          <span className="text-3xl">📊</span>
          <span className="text-xs font-bold mt-1">Thông Số</span>
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-dark/95 border-[3px] border-cyan rounded-[35px] p-10 max-w-md w-full text-center shadow-[0_0_100px_rgba(123,228,255,0.5)] animate-float" onClick={e => e.stopPropagation()}>
            <h2 className="font-cinzel text-4xl mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan via-purple to-gold">CÀI ĐẶT</h2>
            
            <div className="mb-8">
                <label className="block text-gray-400 mb-2 text-sm uppercase tracking-wider">Nhập Mã Quà Tặng</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={giftCode}
                        onChange={(e) => setGiftCode(e.target.value)}
                        placeholder="Nhập code..."
                        className="flex-1 bg-white/10 border border-cyan/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
                    />
                    <button 
                        onClick={handleRedeemCode}
                        className="px-6 py-3 bg-cyan text-dark font-bold rounded-xl hover:bg-cyan/80 transition-colors"
                    >
                        NHẬN
                    </button>
                </div>
            </div>

            <button 
              onClick={logout}
              className="px-8 py-3 bg-red-500 text-white font-bold text-xl rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 w-full"
            >
              ĐĂNG XUẤT
            </button>
            <button onClick={() => setShowSettings(false)} className="mt-8 block w-full text-gray-400 hover:text-white">Đóng</button>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowStats(false)}>
          <div className="bg-dark/95 border-[2px] border-gold rounded-[25px] p-8 max-w-md w-full shadow-[0_0_50px_rgba(255,215,123,0.3)] relative" onClick={e => e.stopPropagation()}>
            <h2 className="text-3xl font-bold mb-6 text-gold text-center border-b border-gold/30 pb-4">Thông Tin Tu Vi</h2>
            
            <div className="space-y-4 text-lg">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Trạng thái:</span>
                <span className={`${player.isDead ? 'text-red-500' : 'text-green-400'} font-bold`}>{player.isDead ? 'Trọng Thương' : 'Khỏe Mạnh'}</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-gray-400">Vũ khí:</span>
                 <span className="text-orange-400">{player.equippedWeapon?.name || 'Tay Không'}</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-gray-400">Giáp:</span>
                 <span className="text-blue-300">{player.equippedArmor?.name || 'Áo Vải'}</span>
              </div>

              <div className="flex justify-between mt-4">
                <span className="text-gray-400">Sinh lực (HP):</span>
                <span className="text-red-400 font-bold">{player.maxHp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Công kích:</span>
                <span className="text-yellow-400 font-bold">{player.attack}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phòng thủ:</span>
                <span className="text-blue-400 font-bold">{player.defense}</span>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="text-center mb-4 text-purple-300">Điểm tiềm năng: <span className="font-bold text-2xl text-white">{player.freePoints}</span></div>
                
                <div className="grid grid-cols-1 gap-3">
                   <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                      <span>Tăng Máu (+10)</span>
                      <button onClick={() => increaseStat('maxHp')} className="w-8 h-8 bg-green-600 rounded flex items-center justify-center hover:bg-green-500 disabled:opacity-50" disabled={player.freePoints <= 0}>+</button>
                   </div>
                   <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                      <span>Tăng Công (+1)</span>
                      <button onClick={() => increaseStat('attack')} className="w-8 h-8 bg-red-600 rounded flex items-center justify-center hover:bg-red-500 disabled:opacity-50" disabled={player.freePoints <= 0}>+</button>
                   </div>
                   <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                      <span>Tăng Thủ (+1)</span>
                      <button onClick={() => increaseStat('defense')} className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-500 disabled:opacity-50" disabled={player.freePoints <= 0}>+</button>
                   </div>
                </div>
              </div>
            </div>
            
            <button onClick={() => setShowStats(false)} className="mt-8 w-full py-3 bg-gray-700 rounded-xl hover:bg-gray-600 font-bold">Đóng</button>
          </div>
        </div>
      )}

      {/* Bag Modal */}
      {showBag && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowBag(false)}>
          <div className="bg-dark/95 border-[2px] border-purple rounded-[25px] p-8 max-w-lg w-full h-[70vh] flex flex-col shadow-[0_0_50px_rgba(212,179,255,0.3)]" onClick={e => e.stopPropagation()}>
            <h2 className="text-3xl font-bold mb-4 text-purple text-center">Túi Càn Khôn</h2>
            <div className="flex-1 overflow-y-auto bg-black/30 rounded-xl p-4 border border-white/10">
               {player.inventory.length === 0 ? (
                   <div className="text-gray-500 text-center h-full flex items-center justify-center">Hiện tại túi đồ trống rỗng...</div>
               ) : (
                   <div className="grid grid-cols-1 gap-2">
                       {player.inventory.map((item, idx) => (
                           <div key={idx} className="bg-white/5 p-3 rounded-lg flex justify-between items-center hover:bg-white/10 transition-colors">
                               <div>
                                   <div className={`font-bold ${item.type === 'weapon' ? 'text-orange-400' : item.type === 'armor' ? 'text-blue-400' : 'text-green-400'}`}>{item.name}</div>
                                   <div className="text-xs text-gray-400">{item.description}</div>
                               </div>
                               <button 
                                onClick={() => handleItemClick(item)}
                                className="px-3 py-1 bg-cyan/20 text-cyan text-sm font-bold rounded border border-cyan/50 hover:bg-cyan/40"
                               >
                                   {item.type === 'consumable' ? 'Dùng' : item.type === 'material' ? 'Xem' : 'Trang Bị'}
                               </button>
                           </div>
                       ))}
                   </div>
               )}
            </div>
            <button onClick={() => setShowBag(false)} className="mt-4 w-full py-3 bg-gray-700 rounded-xl hover:bg-gray-600 font-bold">Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainHall;