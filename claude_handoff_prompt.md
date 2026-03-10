# Claude Handoff Prompt: CLANGSTORE Project Completion

Actúa como el mejor desarrollador frontend, experto en UI/UX, animaciones (Remotion), y diseño integrado con Figma plugins. Tu objetivo es llevar el sitio actual de **CLANGSTORE** al siguiente nivel basándote en un diseño altamente superior y unificando el catálogo. 

El proyecto actual se encuentra localmente en: `/Users/francolarrarte/CLANGSTORE`
También puedes realizar un pull directamente desde la rama `main` en GitHub, donde acabo de pushear la última versión.

## Resumen de la App y Funcionalidades Actuales
Actualmente, la tienda es un MVP que tiene funcionalidades avanzadas impulsadas por IA, pero el diseño general del frontend y el catálogo es precario comparado con el sitio oficial de la clienta. Ella necesita urgentemente una página web superior que unifique todo. 

Las funcionalidades principales implementadas y **QUE NO DEBEN TOCARSE** porque ya funcionan de manera estable y son muy sensibles:
1. **Probador Virtual (`VirtualFitting.tsx`)**: Permite a los usuarios subir una foto, aislar su silueta y superponer prendas del catálogo mediante IA generativa. Es un excelente "chiche" (perk) para la usuaria.
2. **AI Studio (`VirtualTryOn.tsx`)**: Genera "Lookbooks" fotográficos súper realistas combinando una foto base de modelos digitales (Mia, Lola, etc.) con prendas del catálogo en diferentes escenografías. Esto le ahorra muchísimo tiempo de producción fotográfica a la clienta.

### ¿Cómo funcionan estas APIs? (Solo para tu contexto, NO modificar)
- Ambas funciones utilizan **Google Gemini** (`gemini-2.5-flash` para el probador y `gemini-2.5-flash-image` para AI Studio). 
- El flujo consta de transformar imágenes a Base64 y enviarlas como `inlineData` junto a prompts sumamente detallados para cuidar aspectos físicos y de texturas.
- También se integra con **Supabase Storage** (en el bucket `vto-images`) para almacenar las prendas subidas por los usuarios temporalmente y poder procesarlas.

## Claves del Proyecto (Environment y Fallbacks)
En el archivo `.env` y en código encontrarás las siguientes claves de Supabase y Gemini. **Utilízalas tal cual y no rompas la conexión:**
- `VITE_SUPABASE_PROJECT_ID="YOUR_SUPABASE_PROJECT_ID"`
- `VITE_SUPABASE_URL="https://YOUR_SUPABASE_PROJECT_ID.supabase.co"`
- `VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_PUBLISHABLE_KEY"`
- `SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"`
- Gemini API Key fallback en código: `"VITE_GEMINI_API_KEY_VALUE"`

## Tu Misión Principal
1. **Scrapeo y Unificación**: Analiza y scrapea toda la información y productos del sitio oficial actual de CLANGSTORE. Tráete toda esa data a nuestro ecosistema para poblar el e-commerce de forma robusta.
2. **Re-Diseño Extremo**: Aplica tus plugins de Figma, tus habilidades de diseño, Remotion y UI moderna para que este sitio luzca increíble, fluido y premium. 
3. Recuerda: las funcionalidades de IA (Probador y Studio) ya son el backend innovador. Lo que falta es que el contenedor (la tienda visualmente, el catálogo y la experiencia de usuario general) esté a la altura o supere a las mejores marcas de ropa del mundo. 

Comienza revisando la estructura en `/Users/francolarrarte/CLANGSTORE`, usa el gestor de paquetes actual (`bun` o `npm`), levanta el proyecto e inicia el rediseño.
