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
  claimEventReward: (eventId: string, index: number, reward: { type: 'stones' | 'qi' | 'item', value: number | string, name?: string }) => void;
}

const defaultPlayer: PlayerStats = {
  name: 'Vô Danh',
  avatar: 'https://i.ibb.co.com/9bY8YhL/default-avatar.png',
  realm: 'Luyện Khí Tầng 1',
  realmLevel: 1,
  qi: 0,
  maxQi: 1000,
  stones: 100,
  
  hp: 100,
  maxHp: 100,
  attack: 10,
  defense: 2,
  speed: 1,
  
  freePoints: 0,
  breakthroughChance: 0,
  
  inventory: [],
  eventProgress: {},
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
      setPlayer(prev => {
          let newStats = { ...prev };
          let oldItem: Item | undefined;

          // Helper to remove item from inv and add old item back
          const updateInv = (equipped: Item | undefined) => {
              const invWithoutNew = prev.inventory.filter(i => i !== item);
              return equipped ? [...invWithoutNew, equipped] : invWithoutNew;
          };

          if (item.type === 'weapon') {
              oldItem = prev.equippedWeapon;
              newStats.attack = (prev.attack - (oldItem?.attackBonus || 0)) + (item.attackBonus || 0);
              newStats.equippedWeapon = item;
          } 
          else if (item.type === 'armor') {
              oldItem = prev.equippedArmor;
              newStats.defense = (prev.defense - (oldItem?.defenseBonus || 0)) + (item.defenseBonus || 0);
              newStats.equippedArmor = item;
          }
          else if (item.type === 'pants') {
              oldItem = prev.equippedPants;
              newStats.defense = (prev.defense - (oldItem?.defenseBonus || 0)) + (item.defenseBonus || 0);
              newStats.maxHp = (prev.maxHp - (oldItem?.hpBonus || 0)) + (item.hpBonus || 0);
              newStats.equippedPants = item;
          }
          else if (item.type === 'shoes') {
              oldItem = prev.equippedShoes;
              newStats.speed = (prev.speed - (oldItem?.speedBonus || 0)) + (item.speedBonus || 0);
              newStats.equippedShoes = item;
          }

          newStats.inventory = updateInv(oldItem);
          return newStats;
      });
      addLog(`Đã trang bị ${item.name}.`);
  };

  const claimEventReward = (eventId: string, index: number, reward: { type: 'stones' | 'qi' | 'item', value: number | string, name?: string }) => {
      setPlayer(prev => {
          // Check if already claimed
          const claimed = prev.eventProgress[eventId] || [];
          if (claimed.includes(index)) return prev;

          let newState = { ...prev };
          
          if (reward.type === 'stones') {
              newState.stones += Number(reward.value);
              addLog(`Nhận thưởng sự kiện: ${reward.value} Linh Thạch`);
          } else if (reward.type === 'qi') {
              newState.qi = Math.min(newState.maxQi, newState.qi + Number(reward.value));
              addLog(`Nhận thưởng sự kiện: ${reward.value} Linh Khí`);
          } else if (reward.type === 'item') {
              // Find item definition
              const itemDef = ITEMS.find(i => i.id === reward.value);
              if (itemDef) {
                  newState.inventory = [...newState.inventory, itemDef];
                  addLog(`Nhận thưởng sự kiện: ${itemDef.name}`);
              }
          }

          // Update progress
          newState.eventProgress = {
              ...prev.eventProgress,
              [eventId]: [...claimed, index]
          };

          return newState;
      });
  };

  return (
    <GameContext.Provider value={{ 
      screen, setScreen, 
      player, setPlayer, 
      logs, addLog, 
      buyItem, useItem, equipItem, gainQi, checkRevival, logout,
      claimEventReward 
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