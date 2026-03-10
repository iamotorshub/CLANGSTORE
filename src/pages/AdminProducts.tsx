import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Save, Trash2, Edit2, MessageCircle, X, Check, Upload, Loader2 } from "lucide-react";
import { useDBProducts, useInsertProduct, useUpdateProduct, useDeleteProduct, DBProduct } from "@/hooks/useProducts";
import { formatPrice, categories } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import ShareButtons from "@/components/ShareButtons";
import Footer from "@/components/Footer";

export default function AdminProducts() {
  const { data: productList = [], isLoading } = useDBProducts();
  const insertProduct = useInsertProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<DBProduct>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: 0, category: "Vestidos", description: "" });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (p: DBProduct) => {
    setEditingId(p.id);
    setEditValues({ name: p.name, price: p.price, description: p.description, category: p.category });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateProduct.mutateAsync({ id: editingId, ...editValues });
    setEditingId(null);
    setEditValues({});
  };

  const removeProduct = (id: string) => deleteProduct.mutate(id);

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    setSaving(true);
    try {
      let imageUrl: string | null = null;
      if (newImage) {
        const fileName = `products/${Date.now()}-${newProduct.name.toLowerCase().replace(/\s+/g, "-")}.jpg`;
        const { error: uploadErr } = await supabase.storage.from("ai-assets").upload(fileName, newImage, { contentType: newImage.type });
        if (!uploadErr) {
          const { data } = supabase.storage.from("ai-assets").getPublicUrl(fileName);
          imageUrl = data.publicUrl;
        }
      }
      const slug = newProduct.name.toLowerCase().replace(/\s+/g, "-");
      await insertProduct.mutateAsync({
        name: newProduct.name,
        slug,
        price: newProduct.price,
        category: newProduct.category,
        description: newProduct.description || null,
        image_url: imageUrl,
        original_price: null,
        sizes: [],
        colors: [],
        is_featured: false,
        is_new: true,
        free_shipping: true,
      });
      setNewProduct({ name: "", price: 0, category: "Vestidos", description: "" });
      setNewImage(null);
      setShowAdd(false);
    } finally {
      setSaving(false);
    }
  };

  const shareProduct = (p: DBProduct) => {
    const msg = `🛍️ *${p.name}*\n💰 ${formatPrice(p.price)}\n${p.description || ""}\n\n👉 Ver en CLANG Store`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <main className="pt-28 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-foreground">Gestión de Productos</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">{productList.length} productos</p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body text-xs tracking-widest uppercase transition-colors"
          >
            <Plus size={14} /> Nuevo
          </button>
        </div>

        {/* Add form */}
        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="border border-primary/30 bg-card p-6 mb-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-body text-sm text-foreground tracking-wider uppercase">Nuevo Producto</h3>
              <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Nombre" className="bg-secondary border border-border px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <input type="number" value={newProduct.price || ""} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} placeholder="Precio" className="bg-secondary border border-border px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="bg-secondary border border-border px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary">
                {categories.filter((c) => c !== "Todos").map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Descripción" className="bg-secondary border border-border px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <label className="col-span-2 flex items-center gap-2 px-3 py-2 border border-border cursor-pointer hover:border-primary transition-colors">
                <Upload size={14} className="text-muted-foreground" />
                <span className="font-body text-sm text-muted-foreground">{newImage ? newImage.name : "Imagen del producto"}</span>
                <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files?.[0] || null)} className="hidden" />
              </label>
            </div>
            <button onClick={addProduct} disabled={saving} className="bg-primary text-primary-foreground px-6 py-2 font-body text-xs tracking-widest uppercase hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : "Agregar"}
            </button>
          </motion.div>
        )}

        {/* Product list */}
        {isLoading ? (
          <div className="text-center py-10"><Loader2 size={24} className="animate-spin text-primary mx-auto" /></div>
        ) : (
          <div className="space-y-2">
            {productList.map((p) => (
              <motion.div key={p.id} layout className="border border-border bg-card flex items-center gap-4 p-3">
                <img src={p.image_url || "/placeholder.svg"} alt={p.name} className="w-16 h-16 object-cover flex-shrink-0" />
                
                {editingId === p.id ? (
                  <div className="flex-1 grid grid-cols-4 gap-2">
                    <input value={editValues.name} onChange={(e) => setEditValues({ ...editValues, name: e.target.value })} className="bg-secondary border border-border px-2 py-1 font-body text-sm text-foreground focus:outline-none focus:border-primary" />
                    <input type="number" value={editValues.price} onChange={(e) => setEditValues({ ...editValues, price: Number(e.target.value) })} className="bg-secondary border border-border px-2 py-1 font-body text-sm text-foreground focus:outline-none focus:border-primary" />
                    <select value={editValues.category} onChange={(e) => setEditValues({ ...editValues, category: e.target.value })} className="bg-secondary border border-border px-2 py-1 font-body text-sm text-foreground focus:outline-none focus:border-primary">
                      {categories.filter((c) => c !== "Todos").map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="flex gap-1">
                      <button onClick={saveEdit} className="px-2 py-1 bg-primary text-primary-foreground text-xs"><Check size={12} /></button>
                      <button onClick={() => setEditingId(null)} className="px-2 py-1 border border-border text-xs text-muted-foreground"><X size={12} /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-foreground truncate">{p.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{p.category} — {formatPrice(p.price)}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => startEdit(p)} className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"><Edit2 size={13} /></button>
                      <button onClick={() => shareProduct(p)} className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"><MessageCircle size={13} /></button>
                      <button onClick={() => removeProduct(p.id)} className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
