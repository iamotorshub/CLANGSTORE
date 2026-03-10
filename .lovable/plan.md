

# Plan: Base de Datos para Productos, Modelos y Generacion de Books

## Resumen

Crear tablas en la base de datos para persistir productos y modelos de fotos, construir una seccion de asignacion producto-modelo con generacion de book configurable (cantidad de fotos y locaciones), y asegurar que el Probador Virtual y todo el flujo funcione end-to-end.

---

## Esquema de Base de Datos

Se crean 3 tablas principales:

### Tabla `products`
| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | auto-generado |
| name | text | NOT NULL |
| slug | text | UNIQUE, NOT NULL |
| price | integer | NOT NULL, en centavos ARS |
| original_price | integer | nullable, para descuentos |
| category | text | NOT NULL |
| description | text | nullable |
| image_url | text | URL de la imagen del producto |
| sizes | text[] | array de talles |
| colors | text[] | array de colores |
| is_featured | boolean | default false |
| is_new | boolean | default false |
| free_shipping | boolean | default true |
| created_at | timestamptz | default now() |

Se insertan los 10 productos actuales como datos iniciales.

### Tabla `ai_models`
| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | auto-generado |
| name | text | NOT NULL, ej: "Sofia Editorial" |
| photo_url | text | URL de la foto de referencia en storage |
| prompt_description | text | prompt descriptivo para la IA |
| tags | text[] | tags seleccionados |
| created_at | timestamptz | default now() |

### Tabla `ai_books`
| Columna | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | auto-generado |
| product_id | uuid (FK -> products) | prenda asignada |
| model_id | uuid (FK -> ai_models) | modelo asignada |
| photo_count | integer | cantidad de fotos a generar |
| locations | text[] | locaciones seleccionadas |
| status | text | 'pending', 'generating', 'done' |
| result_photos | jsonb | array de URLs/base64 de fotos generadas |
| created_at | timestamptz | default now() |

### RLS
- Todas las tablas: SELECT publico (para que el probador virtual y el shop lean productos)
- INSERT/UPDATE/DELETE: sin restriccion por ahora (no hay auth real, es MVP con login falso). Se usa `anon` key para todo.

---

## Nueva Seccion: Asignacion Producto + Modelo + Book

### Ruta: `/admin/books` (protegida con AdminGuard)

### Flujo UI:
1. **Panel izquierdo**: Lista de productos desde la DB con imagen y nombre
2. **Panel derecho**: Al seleccionar un producto, muestra:
   - **Selector de modelo**: Dropdown/grilla de modelos guardadas en `ai_models`, con foto y nombre
   - **Cantidad de fotos**: Selector numerico (2, 4, 6, 8)
   - **Locaciones**: Checkboxes con las locaciones disponibles (Estudio Blanco, Balcon Parisino, Callejon Urbano, Loft Industrial)
   - **Boton "Generar Book"**: Lanza la generacion via `ai-generate-lookbook`
3. **Resultado**: Grilla de fotos generadas con opcion de descargar y compartir

### Seccion de Gestion de Modelos (dentro de `/admin/books` o como tab):
- **Lista de modelos guardadas** con foto y nombre
- **Boton "Nueva Modelo"**: Upload de foto + nombre + descripcion/prompt
- La foto se sube al bucket `ai-assets` y se guarda la URL en `ai_models`

---

## Cambios en Admin Products (`/admin/productos`)

Conectar con la tabla `products` de la DB:
- Al cargar la pagina, hacer `SELECT * FROM products`
- Al agregar producto: `INSERT INTO products`
- Al editar: `UPDATE products SET ... WHERE id = ...`
- Al eliminar: `DELETE FROM products WHERE id = ...`
- "Actualizar Todo": batch update de todos los cambios pendientes
- Upload de imagen de producto al bucket `ai-assets`

---

## Cambios en el Probador Virtual

Conectar con la tabla `products` para leer las prendas desde la DB en lugar del archivo estatico. Mantener fallback al archivo local si la DB esta vacia.

---

## Cambios en el Shop / Catalogo

Mismo approach: leer desde DB con fallback a datos locales, para que los cambios del admin se reflejen inmediatamente.

---

## Cambios Tecnicos Detallados

### 1. Migracion SQL
- Crear tablas `products`, `ai_models`, `ai_books`
- INSERT de los 10 productos iniciales
- RLS policies permisivas para MVP
- Las imagenes de productos iniciales se referencian desde los assets locales

### 2. Hooks de datos
Crear hooks con TanStack Query:
- `useProducts()` - lee productos de la DB
- `useAIModels()` - lee modelos
- `useAIBooks()` - lee books generados
- Mutaciones correspondientes para CRUD

### 3. Archivos a crear/modificar

| Archivo | Accion |
|---|---|
| `src/hooks/useProducts.ts` | Nuevo - hook CRUD productos |
| `src/hooks/useAIModels.ts` | Nuevo - hook CRUD modelos IA |
| `src/hooks/useAIBooks.ts` | Nuevo - hook CRUD books |
| `src/pages/AdminBooks.tsx` | Nuevo - seccion asignacion + generacion |
| `src/pages/AdminProducts.tsx` | Modificar - conectar a DB |
| `src/pages/VirtualFitting.tsx` | Modificar - leer productos de DB |
| `src/pages/Products.tsx` | Modificar - leer productos de DB |
| `src/App.tsx` | Agregar ruta `/admin/books` |
| `src/components/Navbar.tsx` | Agregar link a Books en menu admin |
| `src/data/products.ts` | Mantener como fallback/seed |
| Migracion SQL | Crear tablas + seed data + RLS |

### 4. Edge function `ai-generate-lookbook`
- Agregar soporte para `photoCount` parametro (actualmente fijo en 4)
- Permitir multiples locaciones en modo studio

