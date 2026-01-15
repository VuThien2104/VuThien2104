import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ScreenState } from '../types';

interface EventData {
  id: string;
  title: string;
  icon: string;
  badge?: number;
}

const EVENTS_LIST: EventData[] = [
  { id: 'tet', title: 'Tết 2025', icon: '🧧', badge: 1 },
  { id: 'newbie', title: 'Tân Thủ', icon: '🌱', badge: 3 },
  { id: 'checkin', title: 'Điểm Danh', icon: '📅' },
  { id: 'rank', title: 'Đua Top', icon: '🏆' },
];

const Events: React.FC = () => {
  const { setScreen, player, claimEventReward } = useGame();
  const [activeTab, setActiveTab] = useState<string>('tet');

  const isClaimed = (eventId: string, index: number) => {
      return player.eventProgress[eventId]?.includes(index);
  };

  const TetRewards = [
      { day: 1, type: 'stones', val: 100, label: '100 Đá' },
      { day: 2, type: 'qi', val: 500, label: '500 Qi' },
      { day: 3, type: 'item', val: 'p3', label: 'Đại Huyết Đan' },
      { day: 4, type: 'stones', val: 500, label: '500 Đá' },
      { day: 5, type: 'item', val: 'l2', label: 'Quần Da Sói' },
      { day: 6, type: 'qi', val: 2000, label: '2k Qi' },
      { day: 7, type: 'item', val: 's3', label: 'Lăng Ba Vi Bộ' },
  ];

  return (
    <div className="flex h-full w-full bg-dark/95 text-white overflow-hidden">
      {/* LEFT SIDEBAR (Navigation) */}
      <div className="w-1/4 md:w-1/5 border-r-2 border-white/10 flex flex-col bg-black/30">
        <div className="p-4 border-b border-white/10">
             <button onClick={() => setScreen(ScreenState.MAIN_HALL)} className="text-gray-400 hover:text-white flex items-center gap-2">
                 <span className="text-2xl">↩</span> <span className="hidden md:inline font-bold">Quay Lại</span>
             </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
            {EVENTS_LIST.map((evt) => (
                <button
                    key={evt.id}
                    onClick={() => setActiveTab(evt.id)}
                    className={`relative w-full p-4 flex flex-col items-center justify-center gap-1 transition-all border-l-4
                        ${activeTab === evt.id 
                            ? 'bg-gradient-to-r from-cyan/20 to-transparent border-cyan text-white' 
                            : 'border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
                >
                    <div className="text-3xl md:text-4xl filter drop-shadow-md">{evt.icon}</div>
                    <div className="text-xs md:text-sm font-bold text-center">{evt.title}</div>
                    
                    {evt.badge && (
                        <div className="absolute top-2 right-2 md:right-4 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-red-400 shadow-sm animate-pulse">
                            {evt.badge}
                        </div>
                    )}
                </button>
            ))}
        </div>
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 relative flex flex-col bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
          {/* Header Bar */}
          <div className="h-16 border-b border-white/10 flex items-center px-6 bg-gradient-to-r from-black/40 to-transparent backdrop-blur-sm">
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold to-white uppercase drop-shadow-md">
                  {EVENTS_LIST.find(e => e.id === activeTab)?.title}
              </h2>
              <div className="ml-auto text-xs text-gray-400 bg-black/40 px-3 py-1 rounded-full border border-white/10">Thời gian: 25/11 - 31/12</div>
          </div>

          {/* Dynamic Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
              
              {/* CONTENT: TET EVENT */}
              {activeTab === 'tet' && (
                  <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="w-full h-48 md:h-64 rounded-3xl bg-gradient-to-br from-red-900 via-red-700 to-yellow-600 relative overflow-hidden shadow-2xl border-2 border-gold/30 shrink-0 mb-6 group">
                           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                           <div className="absolute -right-10 -bottom-10 text-[150px] opacity-20 rotate-12">🧧</div>
                           <div className="absolute left-8 bottom-8">
                               <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-2 border border-yellow-400">Sự kiện Đặc Biệt</div>
                               <h1 className="text-4xl md:text-6xl font-black text-yellow-300 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">TẾT 2025</h1>
                               <p className="text-white/90 font-bold mt-1">Đăng Nhập 7 Ngày - Nhận Lăng Ba Vi Bộ Hài</p>
                           </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                              <h3 className="font-bold text-gold mb-4 border-b border-white/10 pb-2">🎁 Điểm Danh Tết</h3>
                              <div className="grid grid-cols-4 gap-2">
                                  {TetRewards.map((r, idx) => {
                                      const claimed = isClaimed('tet', idx);
                                      // Logic: Can claim if previous day claimed OR it's first day. 
                                      // Note: For demo simplicity, allowing sequential claims.
                                      const canClaim = !claimed && (idx === 0 || isClaimed('tet', idx - 1));
                                      
                                      return (
                                          <button 
                                            key={r.day} 
                                            disabled={!canClaim && !claimed} // Show locked if not reachable
                                            onClick={() => !claimed && canClaim && claimEventReward('tet', idx, { type: r.type as any, value: r.val })}
                                            className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold border transition-all relative overflow-hidden
                                                ${claimed 
                                                    ? 'bg-green-900/50 border-green-500 text-gray-400' 
                                                    : canClaim 
                                                        ? 'bg-gold text-dark border-gold hover:scale-105 animate-pulse shadow-[0_0_15px_rgba(255,215,123,0.5)]' 
                                                        : 'bg-black/40 border-gray-600 text-gray-600 opacity-50 cursor-not-allowed'}`}
                                          >
                                              <div className="text-lg mb-1">{r.type === 'item' ? '📦' : r.type === 'stones' ? '💎' : '✨'}</div>
                                              <div>Ngày {r.day}</div>
                                              {claimed && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-green-500 text-xl font-bold">✓</div>}
                                          </button>
                                      );
                                  })}
                              </div>
                              <div className="text-xs text-gray-400 mt-2 text-center italic">*Đăng nhập mỗi ngày để mở khóa phần thưởng tiếp theo.</div>
                          </div>
                          
                          {/* Info Panel */}
                          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-between backdrop-blur-md">
                               <h3 className="font-bold text-red-400 mb-2">👹 Diệt Niên Thú</h3>
                               <p className="text-sm text-gray-300">
                                   Niên thú đang quấy phá nhân gian. Hãy đến Phó Bản để tiêu diệt chúng!
                                   <br/><br/>
                                   <span className="text-yellow-400">Phần thưởng rơi thêm:</span> Bánh Chưng (Hồi 5000 HP), Lì Xì Đỏ (Ngẫu nhiên 100-1000 Đá).
                               </p>
                               <button onClick={() => setScreen(ScreenState.DUNGEON)} className="mt-4 w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold hover:brightness-110 shadow-lg shadow-red-900/50">
                                   Đến Phó Bản Ngay
                               </button>
                          </div>
                      </div>
                  </div>
              )}

              {/* CONTENT: NEWBIE */}
              {activeTab === 'newbie' && (
                   <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="w-full h-40 md:h-56 rounded-3xl bg-gradient-to-r from-cyan-900 via-blue-800 to-purple-900 relative overflow-hidden shadow-2xl border-2 border-cyan/30 shrink-0 mb-6">
                           <div className="absolute -right-5 top-5 text-[120px] opacity-10">🌱</div>
                           <div className="absolute left-8 top-1/2 -translate-y-1/2">
                               <h1 className="text-3xl md:text-5xl font-black text-cyan drop-shadow-lg">QUÀ TÂN THỦ</h1>
                               <p className="text-blue-200 mt-2 max-w-md">Chuỗi nhiệm vụ 7 ngày giúp bạn làm quen với Tu Tiên Giới.</p>
                           </div>
                      </div>

                      <div className="space-y-3">
                          {[
                              { id: 0, task: "Đạt cấp độ Luyện Khí Tầng 3", rewardLabel: "500 Đá", rType: 'stones', rVal: 500, done: player.realmLevel >= 3 || player.realm !== 'Luyện Khí Tầng 1' },
                              { id: 1, task: "Sở hữu 1000 Linh Khí", rewardLabel: "Tiểu Linh Đan", rType: 'item', rVal: 'p4', done: player.qi >= 1000 },
                              { id: 2, task: "Mua 1 món đồ trong Shop", rewardLabel: "Giày Vải", rType: 'item', rVal: 's2', done: player.inventory.length > 0 },
                          ].map((t) => {
                              const claimed = isClaimed('newbie', t.id);
                              return (
                                  <div key={t.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors">
                                      <div>
                                          <div className="font-bold text-white flex items-center gap-2">
                                              {t.task}
                                              {t.done && !claimed && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>}
                                          </div>
                                          <div className="text-xs text-cyan mt-1">Phần thưởng: {t.rewardLabel}</div>
                                      </div>
                                      <button 
                                        disabled={claimed || !t.done}
                                        onClick={() => claimEventReward('newbie', t.id, { type: t.rType as any, value: t.rVal })}
                                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all
                                            ${claimed 
                                                ? 'bg-transparent border border-gray-600 text-gray-500' 
                                                : t.done 
                                                    ? 'bg-cyan text-dark hover:scale-110 shadow-[0_0_15px_var(--cyan)]' 
                                                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                                      >
                                          {claimed ? 'Đã Nhận' : t.done ? 'NHẬN' : 'Chưa xong'}
                                      </button>
                                  </div>
                              );
                          })}
                      </div>
                   </div>
              )}

              {/* OTHER TABS */}
              {['checkin', 'rank'].includes(activeTab) && (
                  <div className="flex items-center justify-center h-full text-center flex-col opacity-50">
                      <div className="text-6xl mb-4 grayscale">{activeTab === 'checkin' ? '📅' : '🏆'}</div>
                      <h3 className="text-2xl font-bold text-gray-300">Tính năng đang phát triển</h3>
                      <p className="text-gray-500 mt-2">Đạo hữu vui lòng quay lại sau.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default Events;