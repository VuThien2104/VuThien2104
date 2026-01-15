import React from 'react';
import { useGame } from '../context/GameContext';
import { ScreenState } from '../types';
import { ITEMS } from '../constants';

const Shop: React.FC = () => {
  const { player, setScreen, buyItem } = useGame();

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setScreen(ScreenState.MAIN_HALL)} className="text-cyan text-4xl hover:scale-110 transition-transform">↩</button>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">VẠN BẢO CÁC</h2>
        <div className="bg-dark/50 px-4 py-2 rounded-full border border-gold text-gold font-bold">
            {player.stones} Đá
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-10">
        {ITEMS.map(item => (
            <div key={item.id} className="bg-dark/60 border border-gold/30 p-4 rounded-2xl flex flex-col gap-2 hover:border-gold hover:bg-dark/80 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-gold">{item.name}</h3>
                        <div className="text-xs text-gray-400 capitalize">Loại: {item.type === 'consumable' ? 'Đan Dược' : item.type === 'material' ? 'Nguyên Liệu' : 'Trang Bị'}</div>
                    </div>
                    <span className="bg-gold/20 text-gold px-2 py-1 rounded text-xs font-bold border border-gold/50">{item.price} Đá</span>
                </div>
                
                <p className="text-gray-300 text-sm flex-1">{item.description}</p>
                
                <button 
                    onClick={() => buyItem(item)}
                    disabled={player.stones < item.price}
                    className={`w-full py-2 rounded-xl font-bold transition-all text-sm
                        ${player.stones >= item.price 
                            ? 'bg-gradient-to-r from-gold to-yellow-600 text-dark hover:scale-105 shadow-lg shadow-gold/20' 
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                >
                    MUA
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;