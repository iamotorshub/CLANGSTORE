// Importing model photos from assets
import lola1 from "@/assets/models/LOLA/lola_edgy_1.jpg.png";
import lola2 from "@/assets/models/LOLA/lola_edgy_2.jpg.png";
import lola3 from "@/assets/models/LOLA/lola_edgy_3.jpg.png";
import lola4 from "@/assets/models/LOLA/lola_edgy_4.jpg.png";

import martina1 from "@/assets/models/MARTINA/martina_classic_1.jpg.png";
import martina2 from "@/assets/models/MARTINA/martina_classic_2.jpg.png";
import martina3 from "@/assets/models/MARTINA/martina_classic_3.jpg.png";
import martina4 from "@/assets/models/MARTINA/martina_classic_4.jpg.png";

import mia1 from "@/assets/models/MIA/mia_rock_chic_1.jpg.png";
import mia2 from "@/assets/models/MIA/mia_rock_chic_2.jpg.png";
import mia3 from "@/assets/models/MIA/mia_rock_chic_3.jpg.png";
import mia4 from "@/assets/models/MIA/mia_rock_chic_4.jpg.png";

import sofia1 from "@/assets/models/SOFIA/sofia_boho_chic_1.jpg.png";
import sofia2 from "@/assets/models/SOFIA/sofia_boho_chic_2.jpg.png";
import sofia3 from "@/assets/models/SOFIA/sofia_boho_chic_3.jpg.png";
import sofia4 from "@/assets/models/SOFIA/sofia_boho_chic_4.jpg.png";

import valentina1 from "@/assets/models/VALENTINA/valentina_luxury_boss_1.jpg.png";
import valentina2 from "@/assets/models/VALENTINA/valentina_luxury_boss_2.jpg.png";
import valentina3 from "@/assets/models/VALENTINA/valentina_luxury_boss_3.jpg.png";
import valentina4 from "@/assets/models/VALENTINA/valentina_luxury_boss_4.jpg.png";

export interface AIModel {
  id: string;
  name: string;
  photoUrl: string;
  galleryUrls: string[];
  description: string;
  tags: string[];
}

export const aiModels: AIModel[] = [
  {
    id: "m1",
    name: "LOLA",
    photoUrl: lola1,
    galleryUrls: [lola1, lola2, lola3, lola4],
    description: "An edgy fashion model with short dark hair, freckles, and a bold urban style. Professional editorial photography.",
    tags: ["edgy", "urban", "short-hair"]
  },
  {
    id: "m2",
    name: "MARTINA",
    photoUrl: martina1,
    galleryUrls: [martina1, martina2, martina3, martina4],
    description: "A classic elegant fashion model with long brown hair, sophisticated and clean look, timeless beauty.",
    tags: ["classic", "elegant", "long-hair"]
  },
  {
    id: "m3",
    name: "MIA",
    photoUrl: mia1,
    galleryUrls: [mia1, mia2, mia3, mia4],
    description: "A rock-chic inspired fashion model, stylish, confident, with a mix of street and high-fashion hair and makeup.",
    tags: ["rock-chic", "confident", "street"]
  },
  {
    id: "m4",
    name: "SOFIA",
    photoUrl: sofia1,
    galleryUrls: [sofia1, sofia2, sofia3, sofia4],
    description: "A boho-chic fashion model with a natural sun-kissed look, wavy hair, and a relaxed yet premium aesthetic.",
    tags: ["boho", "natural", "wavy-hair"]
  },
  {
    id: "m5",
    name: "VALENTINA",
    photoUrl: valentina1,
    galleryUrls: [valentina1, valentina2, valentina3, valentina4],
    description: "A luxury boss style fashion model, sharp features, impeccable styling, representing high-end corporate or evening elegance.",
    tags: ["luxury", "corporate", "evening"]
  }
];
