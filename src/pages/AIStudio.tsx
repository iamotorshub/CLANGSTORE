import React from "react";
import Footer from "@/components/Footer";
import { VirtualTryOn } from "@/components/VirtualTryOn";

export default function AIStudio() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/4 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/3 blur-[120px]" />
      </div>

      <main className="pt-24 pb-12 relative z-10 w-full min-h-screen">
        <VirtualTryOn />
      </main>

      <Footer />
    </div>
  );
}
