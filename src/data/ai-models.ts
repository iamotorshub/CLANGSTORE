export interface AIModel {
  id: string;
  name: string;
  description: string;
  style: string;
  age: string;
  bestFor: string;
  avatar: string;
}

export const aiModels: AIModel[] = [
  {
    id: "martina",
    name: "Martina",
    description: "Rubia platino con estilo Editorial Chic",
    style: "Editorial Chic",
    age: "26-28",
    bestFor: "Blazers, trajes, formal",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "valentina",
    name: "Valentina",
    description: "Morena con Street Style Urbano",
    style: "Street Style",
    age: "23-25",
    bestFor: "Jeans, remeras, casual",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "catalina",
    name: "Catalina",
    description: "Castaña Minimalista Sofisticada",
    style: "Minimal Chic",
    age: "27-30",
    bestFor: "Básicos, neutros, clean",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "lucia",
    name: "Lucía",
    description: "Deportiva Athletic Lifestyle",
    style: "Athletic",
    age: "24-27",
    bestFor: "Activewear, athleisure",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "isabella",
    name: "Isabella",
    description: "Cabello negro, Glam Nocturno",
    style: "Glam Night",
    age: "28-31",
    bestFor: "Vestidos, fiesta, elegante",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
  },
];
