import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlayerStats, ScreenState, Item } from '../types';
import { ITEMS } from '../constants';

interface GameContextType {
  screen: ScreenState;
  setScreen: (s: ScreenState) => void;
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (msg: string) => void;
  logs: string[];
  buyItem: (item: Item) => void;
  useItem: (item: Item) => void;
  equipItem: (item: Item) => void;
  gainQi: (amount: number) => void;
  checkRevival: () => void;
  logout: () => void;
}

const defaultPlayer: PlayerStats = {
  name: 'Vô Danh',
  avatar: 'https://i.ibb.co.com/9bY8YhL/default-avatar.png',
  realm: 'Luyện Khí Tầng 1',
  realmLevel: 1,
  qi: 0,
  maxQi: 1000,
  stones: 100, // Starting money
  
  hp: 100,
  maxHp: 100,
  attack: 10,
  defense: 2,
  
  freePoints: 0,
  breakthroughChance: 0,
  
  inventory: [],
  isDead: false,
  reviveTimestamp: 0
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [screen, setScreen] = useState<ScreenState>(ScreenState.INTRO);
  const [player, setPlayer] = useState<PlayerStats>(defaultPlayer);
  const [logs, setLogs] = useState<string[]>([]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('tuTienPlayer');
    if (saved) {
      setPlayer({ ...defaultPlayer, ...JSON.parse(saved) });
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('tuTienPlayer', JSON.stringify(player));
  }, [player]);

  // Global Tick for revival check
  useEffect(() => {
    const interval = setInterval(() => {
        checkRevival();
    }, 1000);
    return () => clearInterval(interval);
  }, [player.isDead, player.reviveTimestamp]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 50));
  };

  const logout = () => {
    localStorage.removeItem('tuTienPlayer');
    setPlayer(defaultPlayer);
    setScreen(ScreenState.INTRO);
  };

  const checkRevival = () => {
      if (player.isDead && Date.now() >= player.reviveTimestamp) {
          setPlayer(prev => ({
              ...prev,
              isDead: false,
              hp: prev.maxHp,
              reviveTimestamp: 0
          }));
          addLog("Thương thế đã lành, bạn đã hồi phục!");
      }
  };

  const gainQi = (amount: number) => {
    if (player.isDead) return;
    setPlayer(prev => {
      let newQi = prev.qi + amount;
      if (newQi > prev.maxQi) newQi = prev.maxQi;
      return { ...prev, qi: newQi };
    });
  };

  const buyItem = (item: Item) => {
    if (player.stones >= item.price) {
      setPlayer(prev => ({
          ...prev,
          stones: prev.stones - item.price,
          inventory: [...prev.inventory, item]
      }));
      addLog(`Đã mua ${item.name}.`);
    } else {
      addLog("Không đủ Linh Thạch!");
    }
  };

  const useItem = (item: Item) => {
      if (item.type === 'consumable' || item.type === 'material') {
          if (item.effect) {
             const newStats = item.effect(player);
             // Remove 1 instance of item
             const newInv = [...player.inventory];
             const idx = newInv.findIndex(i => i.id === item.id);
             if (idx > -1) newInv.splice(idx, 1);
             
             setPlayer({ ...newStats, inventory: newInv });
             addLog(`Đã sử dụng ${item.name}.`);
          } else {
             addLog(`${item.name} không thể sử dụng trực tiếp.`);
          }
      }
  };

  const equipItem = (item: Item) => {
      if (item.type === 'weapon') {
          setPlayer(prev => {
              // Unequip current weapon if any
              const oldWeapon = prev.equippedWeapon;
              let currentAtk = prev.attack - (oldWeapon?.attackBonus || 0);
              
              // Equip new
              return {
                  ...prev,
                  attack: currentAtk + (item.attackBonus || 0),
                  equippedWeapon: item,
                  // Remove from inv (conceptually equipped items leave inventory or stay marked, here simplified: remove from inv list)
                  inventory: prev.inventory.filter(i => i !== item).concat(oldWeapon ? [oldWeapon] : [])
              };
          });
          addLog(`Đã trang bị ${item.name}.`);
      } else if (item.type === 'armor') {
        setPlayer(prev => {
            const oldArmor = prev.equippedArmor;
            let currentDef = prev.defense - (oldArmor?.defenseBonus || 0);
            return {
                ...prev,
                defense: currentDef + (item.defenseBonus || 0),
                equippedArmor: item,
                inventory: prev.inventory.filter(i => i !== item).concat(oldArmor ? [oldArmor] : [])
            };
        });
        addLog(`Đã trang bị ${item.name}.`);
      }
  };

  return (
    <GameContext.Provider value={{ 
      screen, setScreen, 
      player, setPlayer, 
      logs, addLog, 
      buyItem, useItem, equipItem, gainQi, checkRevival, logout 
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};