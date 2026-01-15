import { Item } from './types';

export const REALMS = [
  "Phàm Nhân",
  "Luyện Khí",
  "Trúc Cơ",
  "Kim Đan",
  "Nguyên Anh",
  "Hóa Thần",
  "Luyện Hư",
  "Hợp Thể",
  "Đại Thừa",
  "Độ Kiếp"
];

// Menu Icons (Emojo/Image representation)
export const MENU_ICONS = {
  SKILLS: '📜',
  BREAKTHROUGH: '🧘',
  DUNGEON: '👹',
  SHOP: '🏮',
  EVENTS: '🎁', // Changed from RANKING
  SECT: '🏯'
};

export const ITEMS: Item[] = [
  // Consumables (Potions)
  { id: 'p1', type: 'consumable', name: 'Tiểu Huyết Đan', price: 50, description: 'Hồi 50 HP.', effect: (s) => ({ ...s, hp: Math.min(s.hp + 50, s.maxHp) }) },
  { id: 'p2', type: 'consumable', name: 'Trung Huyết Đan', price: 200, description: 'Hồi 200 HP.', effect: (s) => ({ ...s, hp: Math.min(s.hp + 200, s.maxHp) }) },
  { id: 'p3', type: 'consumable', name: 'Đại Huyết Đan', price: 500, description: 'Hồi 1000 HP.', effect: (s) => ({ ...s, hp: Math.min(s.hp + 1000, s.maxHp) }) },
  { id: 'p4', type: 'consumable', name: 'Tiểu Linh Đan', price: 100, description: 'Tăng 100 Linh Lực.', effect: (s) => ({ ...s, qi: Math.min(s.qi + 100, s.maxQi) }) },
  { id: 'p5', type: 'consumable', name: 'Đại Linh Đan', price: 1000, description: 'Tăng 1000 Linh Lực.', effect: (s) => ({ ...s, qi: Math.min(s.qi + 1000, s.maxQi) }) },
  { id: 'p6', type: 'consumable', name: 'Trúc Cơ Đan', price: 5000, description: 'Tăng 5% tỷ lệ đột phá.', effect: (s) => ({ ...s, breakthroughChance: s.breakthroughChance + 5 }) },
  
  // Weapons
  { id: 'w1', type: 'weapon', name: 'Gỗ Mục Kiếm', price: 100, description: 'Kiếm tập sự. Công +5', attackBonus: 5 },
  { id: 'w2', type: 'weapon', name: 'Thiết Kiếm', price: 500, description: 'Kiếm sắt thường. Công +15', attackBonus: 15 },
  { id: 'w3', type: 'weapon', name: 'Tinh Thiết Kiếm', price: 1500, description: 'Sắt tinh luyện. Công +30', attackBonus: 30 },
  { id: 'w4', type: 'weapon', name: 'Huyền Thiết Trọng Kiếm', price: 5000, description: 'Kiếm rất nặng. Công +80', attackBonus: 80 },
  { id: 'w5', type: 'weapon', name: 'Thanh Vân Kiếm', price: 12000, description: 'Kiếm khí lăng nhân. Công +150', attackBonus: 150 },
  
  // Armor
  { id: 'a1', type: 'armor', name: 'Áo Vải Thô', price: 100, description: 'Áo dân thường. Thủ +2', defenseBonus: 2 },
  { id: 'a2', type: 'armor', name: 'Da Thú Giáp', price: 600, description: 'Làm từ da heo rừng. Thủ +10', defenseBonus: 10 },
  { id: 'a3', type: 'armor', name: 'Thiết Giáp', price: 2000, description: 'Giáp sắt. Thủ +25', defenseBonus: 25 },
  { id: 'a4', type: 'armor', name: 'Ngân Lân Giáp', price: 6000, description: 'Vảy bạc lấp lánh. Thủ +60', defenseBonus: 60 },
  { id: 'a5', type: 'armor', name: 'Kim Cang Giáp', price: 15000, description: 'Bất hoại chi thân. Thủ +120', defenseBonus: 120 },

  // Special/Materials
  { id: 'm1', type: 'material', name: 'Linh Thạch Vụn', price: 10, description: 'Dùng để giao dịch.' },
  { id: 'm2', type: 'material', name: 'Thảo Dược', price: 50, description: 'Nguyên liệu luyện đan.' },
  { id: 'm3', type: 'material', name: 'Yêu Đan Cấp 1', price: 200, description: 'Kết tinh của yêu thú.' },
  { id: 'm4', type: 'material', name: 'Bí Kíp Nhập Môn', price: 1000, description: 'Tăng giới hạn Linh Lực +200 vĩnh viễn.', effect: (s) => ({ ...s, maxQi: s.maxQi + 200 }) },
  { id: 'm5', type: 'material', name: 'Túi Trữ Vật', price: 5000, description: 'Không gian chứa đồ (Vật phẩm tượng trưng).' },
];