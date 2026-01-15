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

// Menu Icons
export const MENU_ICONS = {
  SKILLS: '📜',
  BREAKTHROUGH: '🧘',
  DUNGEON: '👹',
  SHOP: '🏮',
  EVENTS: '🎁', 
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
  
  // Armor (Shirts)
  { id: 'a1', type: 'armor', name: 'Áo Vải Thô', price: 100, description: 'Áo dân thường. Thủ +2', defenseBonus: 2 },
  { id: 'a2', type: 'armor', name: 'Da Thú Giáp', price: 600, description: 'Làm từ da heo rừng. Thủ +10', defenseBonus: 10 },
  { id: 'a3', type: 'armor', name: 'Thiết Giáp', price: 2000, description: 'Giáp sắt. Thủ +25', defenseBonus: 25 },
  { id: 'a4', type: 'armor', name: 'Ngân Lân Giáp', price: 6000, description: 'Vảy bạc lấp lánh. Thủ +60', defenseBonus: 60 },
  
  // Pants
  { id: 'l1', type: 'pants', name: 'Quần Vải', price: 80, description: 'Quần thường. Thủ +1, Máu +5', defenseBonus: 1, hpBonus: 5 },
  { id: 'l2', type: 'pants', name: 'Quần Da Sói', price: 500, description: 'Bền bỉ. Thủ +5, Máu +20', defenseBonus: 5, hpBonus: 20 },
  { id: 'l3', type: 'pants', name: 'Hắc Thiết Khố', price: 1800, description: 'Làm từ sắt đen. Thủ +15, Máu +50', defenseBonus: 15, hpBonus: 50 },

  // Shoes
  { id: 's1', type: 'shoes', name: 'Dép Rơm', price: 50, description: 'Đi cho đỡ đau chân. Tốc độ +1', speedBonus: 1 },
  { id: 's2', type: 'shoes', name: 'Giày Vải', price: 300, description: 'Nhẹ nhàng. Tốc độ +3', speedBonus: 3 },
  { id: 's3', type: 'shoes', name: 'Lăng Ba Vi Bộ Hài', price: 2500, description: 'Giày của cao thủ. Tốc độ +10', speedBonus: 10 },

  // Special/Materials
  { id: 'm1', type: 'material', name: 'Linh Thạch Vụn', price: 10, description: 'Dùng để giao dịch.' },
  { id: 'm2', type: 'material', name: 'Thảo Dược', price: 50, description: 'Nguyên liệu luyện đan.' },
  { id: 'm3', type: 'material', name: 'Yêu Đan Cấp 1', price: 200, description: 'Kết tinh của yêu thú.' },
  { id: 'm4', type: 'material', name: 'Bí Kíp Nhập Môn', price: 1000, description: 'Tăng giới hạn Linh Lực +200 vĩnh viễn.', effect: (s) => ({ ...s, maxQi: s.maxQi + 200 }) },
  { id: 'm5', type: 'material', name: 'Túi Trữ Vật', price: 5000, description: 'Không gian chứa đồ (Vật phẩm tượng trưng).' },
];