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
  const { setScreen } = useGame();
  const [activeTab, setActiveTab] = useState<string>('tet');

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
                    
                    {/* Notification Badge */}
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
      <div className="flex-1 relative flex flex-col">
          {/* Header Bar */}
          <div className="h-16 border-b border-white/10 flex items-center px-6 bg-gradient-to-r from-black/40 to-transparent">
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold to-white uppercase">
                  {EVENTS_LIST.find(e => e.id === activeTab)?.title}
              </h2>
              <div className="ml-auto text-xs text-gray-400">Thời gian: 25/11 - 31/12</div>
          </div>

          {/* Dynamic Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
              
              {/* CONTENT: TET EVENT */}
              {activeTab === 'tet' && (
                  <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                      {/* Banner */}
                      <div className="w-full h-48 md:h-64 rounded-3xl bg-gradient-to-br from-red-900 via-red-700 to-yellow-600 relative overflow-hidden shadow-2xl border-2 border-gold/30 shrink-0 mb-6 group">
                           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                           <div className="absolute -right-10 -bottom-10 text-[150px] opacity-20 rotate-12">🧧</div>
                           <div className="absolute left-8 bottom-8">
                               <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-2 border border-yellow-400">Sự kiện Đặc Biệt</div>
                               <h1 className="text-4xl md:text-6xl font-black text-yellow-300 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">TẾT 2025</h1>
                               <p className="text-white/90 font-bold mt-1">Đón Xuân Sang - Rinh Quà Khủng</p>
                           </div>
                           {/* Shine Effect */}
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                      </div>

                      {/* Content Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                              <h3 className="font-bold text-gold mb-2">🎁 Điểm Danh Tết</h3>
                              <p className="text-sm text-gray-400 mb-4">Đăng nhập 7 ngày nhận ngay Trang phục giới hạn.</p>
                              <div className="flex gap-2">
                                  {[1,2,3,4,5,6,7].map(d => (
                                      <div key={d} className={`flex-1 aspect-square rounded flex items-center justify-center text-xs font-bold border ${d<=3 ? 'bg-gold text-dark border-gold' : 'bg-black/40 border-gray-600 text-gray-500'}`}>
                                          {d}
                                      </div>
                                  ))}
                              </div>
                          </div>
                          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-between">
                               <h3 className="font-bold text-red-400 mb-2">👹 Diệt Niên Thú</h3>
                               <p className="text-sm text-gray-400">Tham gia Phó Bản Rừng Yêu Thú để thu thập Bánh Chưng đổi quà.</p>
                               <button className="mt-2 w-full py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold text-sm hover:brightness-110">Đến Phó Bản</button>
                          </div>
                      </div>
                  </div>
              )}

              {/* CONTENT: NEWBIE */}
              {activeTab === 'newbie' && (
                   <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                      {/* Banner */}
                      <div className="w-full h-40 md:h-56 rounded-3xl bg-gradient-to-r from-cyan-900 via-blue-800 to-purple-900 relative overflow-hidden shadow-2xl border-2 border-cyan/30 shrink-0 mb-6">
                           <div className="absolute -right-5 top-5 text-[120px] opacity-10">🌱</div>
                           <div className="absolute left-8 top-1/2 -translate-y-1/2">
                               <h1 className="text-3xl md:text-5xl font-black text-cyan drop-shadow-lg">QUÀ TÂN THỦ</h1>
                               <p className="text-blue-200 mt-2 max-w-md">Hành trang vững chắc trên con đường tu tiên. Hoàn thành nhiệm vụ để nhận thưởng.</p>
                           </div>
                      </div>

                      <div className="space-y-3">
                          {[
                              { task: "Đạt cấp độ Luyện Khí Tầng 5", reward: "500 Đá", done: true },
                              { task: "Chiến thắng 10 trận Phó Bản", reward: "Kiếm Sắt", done: false },
                              { task: "Mua 1 vật phẩm bất kỳ", reward: "200 Qi", done: false },
                          ].map((t, idx) => (
                              <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                                  <div>
                                      <div className="font-bold text-white">{t.task}</div>
                                      <div className="text-xs text-cyan mt-1">Phần thưởng: {t.reward}</div>
                                  </div>
                                  <button 
                                    disabled={!t.done}
                                    className={`px-6 py-2 rounded-full font-bold text-sm ${t.done ? 'bg-cyan text-dark hover:scale-105' : 'bg-gray-700 text-gray-500'}`}
                                  >
                                      {t.done ? 'Nhận' : 'Chưa xong'}
                                  </button>
                              </div>
                          ))}
                      </div>
                   </div>
              )}

              {/* CONTENT: CHECKIN */}
              {activeTab === 'checkin' && (
                  <div className="flex items-center justify-center h-full text-center flex-col">
                      <div className="text-6xl mb-4">📅</div>
                      <h3 className="text-2xl font-bold text-gray-300">Tính năng đang cập nhật</h3>
                      <p className="text-gray-500 mt-2">Vui lòng quay lại sau.</p>
                  </div>
              )}

              {/* CONTENT: RANK */}
              {activeTab === 'rank' && (
                  <div className="flex items-center justify-center h-full text-center flex-col">
                       <div className="text-6xl mb-4">🏆</div>
                      <h3 className="text-2xl font-bold text-gray-300">Bảng Xếp Hạng Liên Server</h3>
                      <p className="text-gray-500 mt-2">Sắp mở khóa.</p>
                  </div>
              )}

          </div>
      </div>
    </div>
  );
};

export default Events;