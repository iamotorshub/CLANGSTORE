import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WA_NUMBER = "5492916452291";

export default function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola! Estoy interesado/a en los productos de CLANG Store 🛍️")}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      style={{ background: "#25D366" }}
      aria-label="Chat por WhatsApp"
    >
      <MessageCircle size={24} className="text-white" />
    </motion.a>
  );
}
