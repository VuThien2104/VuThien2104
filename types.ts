export enum ScreenState {
  INTRO = 'INTRO',
  LOGIN = 'LOGIN',
  MAIN_HALL = 'MAIN_HALL',
  BREAKTHROUGH = 'BREAKTHROUGH',
  DUNGEON = 'DUNGEON',
  SKILLS = 'SKILLS',
  SHOP = 'SHOP',
  SECT = 'SECT',
  RANKING = 'RANKING'
}

export interface Item {
  id: string;
  name: string;
  type: 'consumable' | 'weapon' | 'armor' | 'material';
  price: number;
  description: string;
  // Dynamic stats for equipment
  attackBonus?: number;
  defenseBonus?: number;
  hpBonus?: number;
  // Effect for consumables
  effect?: (stats: PlayerStats) => PlayerStats;
}

export interface PlayerStats {
  name: string;
  avatar: string;
  realm: string;
  realmLevel: number;
  qi: number;
  maxQi: number;
  stones: number;
  
  // Combat stats
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  
  // Growth stats
  freePoints: number;
  breakthroughChance: number;

  // Inventory & Equipment
  inventory: Item[];
  equippedWeapon?: Item;
  equippedArmor?: Item;

  // Death Mechanic
  isDead: boolean;
  reviveTimestamp: number; // Date.now() when they can revive
}

export interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speedRating: 'slow' | 'fast' | 'normal';
  rewardStones: number;
  rewardQi: number;
}