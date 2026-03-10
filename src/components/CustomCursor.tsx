import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let rafId: number;
    let ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows instantly
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const animateRing = () => {
      // Ring follows with easing
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ring) {
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
      }
      rafId = requestAnimationFrame(animateRing);
    };
    rafId = requestAnimationFrame(animateRing);

    const onEnter = () => {
      if (!ring || !dot) return;
      ring.style.width = "52px";
      ring.style.height = "52px";
      ring.style.borderColor = "hsl(var(--primary) / 0.7)";
      dot.style.opacity = "0";
    };
    const onLeave = () => {
      if (!ring || !dot) return;
      ring.style.width = "30px";
      ring.style.height = "30px";
      ring.style.borderColor = "hsl(var(--primary) / 0.35)";
      dot.style.opacity = "1";
    };

    document.addEventListener("mousemove", onMouseMove);

    // Attach hover listeners to interactive elements
    const attachListeners = () => {
      document.querySelectorAll("a, button, [role='button'], input, label").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attachListeners();

    // Re-attach on DOM changes (for dynamic elements)
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
