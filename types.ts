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
  type: 'consumable' | 'weapon' | 'armor' | 'pants' | 'shoes' | 'material';
  price: number;
  description: string;
  // Dynamic stats for equipment
  attackBonus?: number;
  defenseBonus?: number;
  hpBonus?: number;
  speedBonus?: number; // New stat for shoes
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
  speed: number; // New stat
  
  // Growth stats
  freePoints: number;
  breakthroughChance: number;

  // Inventory & Equipment
  inventory: Item[];
  equippedWeapon?: Item;
  equippedArmor?: Item;
  equippedPants?: Item; // New slot
  equippedShoes?: Item; // New slot

  // Events Tracking: { "tet": [1, 2], "newbie": [0] } -> Array of claimed indices
  eventProgress: Record<string, number[]>;

  // Death Mechanic
  isDead: boolean;
  reviveTimestamp: number;
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