import { Share2, MessageCircle, Instagram } from "lucide-react";

const WA_NUMBER = "5492916452291";

interface ShareButtonsProps {
  title: string;
  text?: string;
  url?: string;
  imageUrl?: string;
}

export default function ShareButtons({ title, text, url, imageUrl }: ShareButtonsProps) {
  const shareUrl = url || window.location.href;
  const shareText = text || title;

  const handleWhatsApp = () => {
    const msg = `${shareText}\n\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleInstagram = () => {
    // Instagram doesn't have a direct share URL API for web
    // Download the image and prompt user to share manually
    if (imageUrl) {
      const a = document.createElement("a");
      a.href = imageUrl;
      a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.png`;
      a.click();
      alert("Imagen descargada. Abrí Instagram y compartila desde tu galería.");
    }
    window.open("https://instagram.com/clang.store", "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
      } catch {}
    } else {
      handleWhatsApp();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-1.5 px-3 py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary font-body text-[11px] tracking-wider uppercase transition-colors"
      >
        <MessageCircle size={13} /> WhatsApp
      </button>
      <button
        onClick={handleInstagram}
        className="flex items-center gap-1.5 px-3 py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary font-body text-[11px] tracking-wider uppercase transition-colors"
      >
        <Instagram size={13} /> Instagram
      </button>
      {typeof navigator.share === "function" && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1.5 px-3 py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary font-body text-[11px] tracking-wider uppercase transition-colors"
        >
          <Share2 size={13} /> Compartir
        </button>
      )}
    </div>
  );
}
