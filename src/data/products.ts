import imgVestidoArmani from "@/assets/products/vestido-armani.webp";
import imgRemeronBunny from "@/assets/products/remeron-bunny.webp";
import imgTopRihana from "@/assets/products/top-rihana.webp";
import imgCamisaLoreana from "@/assets/products/camisa-loreana.webp";
import imgVestidoGime from "@/assets/products/vestido-gime.webp";
import imgVestidoPilar from "@/assets/products/vestido-pilar.webp";
import imgChaquetaOasis from "@/assets/products/chaqueta-oasis.jpg";
import imgTopViena from "@/assets/products/top-viena.webp";
import imgJeanOxid from "@/assets/products/jean-oxid.jpg";
import imgSetLola from "@/assets/products/set-lola.jpg";
import imgSetRina from "@/assets/products/set-rina.jpg";
import imgShortKendal from "@/assets/products/short-kendal.webp";
import imgCamisaBattery from "@/assets/products/camisa-battery.jpg";
import imgMusculosaRocio from "@/assets/products/musculosa-rocio.jpg";
import imgJeanOffWhite from "@/assets/products/jean-off-white.jpg";
import imgRemeronHeaven from "@/assets/products/remeron-heaven.jpg";
import imgRemeronIbiza from "@/assets/products/remeron-ibiza.jpg";
import imgSetMaria from "@/assets/products/set-maria.jpg";
import imgShortRocio from "@/assets/products/short-rocio.jpg";
import imgTopLari from "@/assets/products/top-lari.jpg";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  sizes?: string[];
  colors?: string[];
  image: string;
  images?: string[];
  description?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  freeShipping?: boolean;
}

export const products: Product[] = [
  {
    id: "c1",
    name: "CAMISA LOREANA",
    slug: "camisa-loreana",
    price: 79900,
    category: "Camisas",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blanco", "Beige"],
    image: imgCamisaLoreana,
    images: [imgCamisaLoreana],
    description: "Camisa de poplin talle único, corte oversize. Cuello abierto, manga larga con vuelo. Confección nacional de alta calidad. Perfecta para looks casuales o de oficina con denim o falda.",
    isFeatured: true,
    isNew: true,
    freeShipping: true,
  },
  {
    id: "c2",
    name: "TOP RIHANA",
    slug: "top-rihana",
    price: 32900,
    category: "Tops",
    sizes: ["S", "M", "L"],
    colors: ["Negro", "Crema"],
    image: imgTopRihana,
    images: [imgTopRihana],
    description: "Top cropped de punto, escote pronunciado con detalles de tiritas cruzadas al frente. Tiro corto ideal para usar con jean de tiro alto o falda midi. Material suave y elástico.",
    isNew: true,
  },
  {
    id: "c3",
    name: "VESTIDO ARMANI",
    slug: "vestido-armani",
    price: 89900,
    category: "Vestidos",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Negro"],
    image: imgVestidoArmani,
    images: [imgVestidoArmani],
    description: "Vestido largo de corte recto, inspirado en siluetas de alta costura italiana. Escote v profundo, tela fluida con caída perfecta. De día con sandalias planas, de noche con tacos y accesorios dorados.",
    isFeatured: true,
  },
  {
    id: "c4",
    name: "CHAQUETA OASIS",
    slug: "chaqueta-oasis",
    price: 189900,
    originalPrice: 229900,
    category: "Abrigos",
    sizes: ["S", "M", "L"],
    colors: ["Negro"],
    image: imgChaquetaOasis,
    images: [imgChaquetaOasis],
    description: "Tipo bomber, cuello alto, confeccionada en eco cuero negro de alta calidad. Corte holgado y estilo oversize. Interior satinado, bolsillos laterales con cierre. La pieza inversión de la temporada.",
    isFeatured: true,
    freeShipping: true,
  },
  {
    id: "c5",
    name: "JEAN OXID",
    slug: "jean-oxid",
    price: 79900,
    category: "Jeans",
    sizes: ["36", "38", "40", "42", "44"],
    colors: ["Negro Oxidado"],
    image: imgJeanOxid,
    images: [imgJeanOxid, imgJeanOffWhite],
    description: "Jean de corte recto en denim oxidado teñido. Cinco bolsillos clásicos, terminaciones sin rematar en ruedo. Tiro medio-alto. Combina con musculosas, camisas atadas y biker jackets.",
  },
  {
    id: "c6",
    name: "SET LOLA",
    slug: "set-lola",
    price: 129900,
    category: "Sets",
    sizes: ["S", "M", "L"],
    colors: ["Natural", "Blanco Roto"],
    image: imgSetLola,
    images: [imgSetLola, imgSetMaria],
    description: "Conjunto de lino premium: falda midi con elástico en cintura y volados en ruedo, top crop con corte irregular en escote. Material natural 100% lino, fresco y de secado rápido. Ideal para verano y travel looks.",
    isFeatured: true,
    freeShipping: true,
  },
  {
    id: "c7",
    name: "FALDA CALIFORNIA",
    slug: "falda-california",
    price: 52900,
    category: "Faldas",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Crema", "Beige Arena"],
    image: imgSetLola,
    images: [imgSetLola],
    description: "Falda midi de lino con culotte interior incorporado. Cintura elástica regulable, vuelo suave con caída natural. Sin cierre. El culotte integrado garantiza comodidad total sin preocupaciones.",
  },
  {
    id: "c8",
    name: "SHORT KENDAL",
    slug: "short-kendal",
    price: 52900,
    category: "Shorts",
    sizes: ["1", "2", "3"],
    colors: ["Marrón", "Camel"],
    image: imgShortKendal,
    images: [imgShortKendal, imgShortRocio],
    description: "Short de tiro alto en tela texturizada tipo tweed. Cierre lateral con botón forrado. Bolsillos traseros funcionales. Perfecto para looks de día con camisas oversize o blazers.",
  },
  {
    id: "c9",
    name: "CAMISA BATTERY",
    slug: "camisa-battery",
    price: 64900,
    category: "Camisas",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Estampado Multicolor"],
    image: imgCamisaBattery,
    images: [imgCamisaBattery],
    description: "Camisa de estilo resort con estampa floral y geométrica exclusiva. Corte recto amplio, manga corta con vuelo. Ideal para looks playeros o casuales urbanos. Tela liviana de tacto seda.",
    isNew: true,
  },
  {
    id: "c10",
    name: "TOP VIENA",
    slug: "top-viena",
    price: 69900,
    category: "Tops",
    sizes: ["S", "M", "L"],
    colors: ["Beige", "Tostado"],
    image: imgTopViena,
    images: [imgTopViena, imgTopLari],
    description: "Top estructurado de tejido especial, escote cuadrado con detalle de lazo frontal. Corte a la cintura con leve efecto bustier. Combina con falda larga o pantalón de pinzas para looks elevados.",
    isFeatured: true,
  },
  {
    id: "c11",
    name: "VESTIDO PILAR",
    slug: "vestido-pilar",
    price: 89900,
    category: "Vestidos",
    sizes: ["S", "M", "L"],
    colors: ["Blanco", "Marfil"],
    image: imgVestidoPilar,
    images: [imgVestidoPilar],
    description: "Vestido midi de gasa con bordado artesanal en escote. Corte evasé con vuelo suave, manga tres cuartos. Ideal para eventos, casamientos y ocasiones especiales. Confección artesanal en Argentina.",
    isFeatured: true,
  },
  {
    id: "c12",
    name: "REMERON BUNNY",
    slug: "remeron-bunny",
    price: 39900,
    category: "Remeras",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blanco", "Negro"],
    image: imgRemeronBunny,
    images: [imgRemeronBunny, imgRemeronHeaven],
    description: "Remera oversize de algodón 100% con estampa gráfica exclusiva de temporada. Cuello redondo, ruedo recto. Fit holgado para usar suelta o anudada en la cintura. Lavable a máquina.",
  },
  {
    id: "c13",
    name: "VESTIDO GIME",
    slug: "vestido-gime",
    price: 99900,
    category: "Vestidos",
    sizes: ["S", "M", "L"],
    colors: ["Dorado", "Champagne"],
    image: imgVestidoGime,
    images: [imgVestidoGime],
    description: "Vestido de gasa con detalles metalizados, corte asimétrico en ruedo. Escote palabra de honor con tiritas ajustables. La pieza estrella para noches de fiesta o eventos formales. Edición limitada.",
    isFeatured: true,
    isNew: true,
  },
  {
    id: "c14",
    name: "SET RINA",
    slug: "set-rina",
    price: 129900,
    category: "Sets",
    sizes: ["S", "M", "L"],
    colors: ["Verde Oliva", "Kaki"],
    image: imgSetRina,
    images: [imgSetRina, imgSetLola],
    description: "Conjunto coordinado de pantalón palazzo y top halter. Tela fluida de viscosa con textura natural. Pantalón con bolsillos laterales y tiro alto. Top con escote pronunciado y nudo frontal. Look completo listo para usar.",
  },
  // --- New products: all 6 unused images now assigned ---
  {
    id: "c15",
    name: "JEAN OFF WHITE",
    slug: "jean-off-white",
    price: 79900,
    category: "Jeans",
    sizes: ["36", "38", "40", "42", "44"],
    colors: ["Blanco Roto", "Off White"],
    image: imgJeanOffWhite,
    images: [imgJeanOffWhite, imgJeanOxid],
    description: "Jean de corte recto en denim lavado off white. Misma moldería que el JEAN OXID, en versión clara para looks de verano. Cinco bolsillos, tiro medio-alto, terminación deshilachada en ruedo.",
    isNew: true,
  },
  {
    id: "c16",
    name: "REMERON HEAVEN",
    slug: "remeron-heaven",
    price: 35900,
    category: "Remeras",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Celeste", "Lavanda"],
    image: imgRemeronHeaven,
    images: [imgRemeronHeaven, imgRemeronIbiza],
    description: "Remera de algodón liviano en tono cielo. Fit regular, cuello redondo acanalado. Estampa sublimada de baja densidad. Ideal para el día a día con jeans, shorts o bajo blazers oversized.",
    isNew: true,
    freeShipping: true,
  },
  {
    id: "c17",
    name: "REMERON IBIZA",
    slug: "remeron-ibiza",
    price: 39900,
    category: "Remeras",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Rosa", "Coral", "Naranja"],
    image: imgRemeronIbiza,
    images: [imgRemeronIbiza, imgRemeronHeaven],
    description: "Remera cropped de algodón con efecto tie-dye en tonos cálidos mediterráneos. Manga corta, cuello redondo, tiro corto ideal para cintura alta. Paleta inspirada en los atardeceres de Ibiza.",
    isNew: true,
  },
  {
    id: "c18",
    name: "SET MARIA",
    slug: "set-maria",
    price: 124900,
    category: "Sets",
    sizes: ["S", "M", "L"],
    colors: ["Crema", "Terracota"],
    image: imgSetMaria,
    images: [imgSetMaria, imgSetRina],
    description: "Set de falda lápiz midi y top manga larga con detalle en mangas. Silueta elegante y sofisticada, perfecta para eventos de día o reuniones de trabajo. Material de punto texturizado de alta calidad, confección nacional.",
    isFeatured: true,
    isNew: true,
  },
  {
    id: "c19",
    name: "SHORT ROCIO",
    slug: "short-rocio",
    price: 49900,
    category: "Shorts",
    sizes: ["1", "2", "3"],
    colors: ["Blanco", "Crudo"],
    image: imgShortRocio,
    images: [imgShortRocio, imgShortKendal],
    description: "Short liso de tiro alto en tela suave y estructurada. Cintura con pretina, cierre lateral con botón dorado. Bolsillos traseros con solapa. Versátil: de día con camiseta, de noche con blusa tucked-in.",
    isNew: true,
  },
  {
    id: "c20",
    name: "TOP LARI",
    slug: "top-lari",
    price: 34900,
    category: "Tops",
    sizes: ["S", "M", "L"],
    colors: ["Negro", "Vino"],
    image: imgTopLari,
    images: [imgTopLari, imgTopViena],
    description: "Top de punto acanalado con espalda pronunciada. Tiro corto, fit ajustado. Tiritas regulables. Ideal como segunda piel bajo blazers o solo para looks nocturnos minimalistas. Material de alta elasticidad.",
    isNew: true,
  },
  {
    id: "c21",
    name: "MUSCULOSA ROCIO",
    slug: "musculosa-rocio",
    price: 28900,
    category: "Tops",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Negro", "Blanco"],
    image: imgMusculosaRocio,
    images: [imgMusculosaRocio],
    description: "Musculosa de algodón pesado, corte recto oversize. Breteles anchos, escote recto al frente, espalda U profunda. Básico premium que sirve de base para cualquier look. Tela sustentable certificada.",
  },
];

export const categories = [
  "Todos", "Vestidos", "Faldas", "Abrigos", "Camisas",
  "Tops", "Shorts", "Remeras", "Jeans", "Sets",
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
