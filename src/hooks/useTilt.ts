import { useEffect, type RefObject } from "react";

/**
 * Adds a smooth 3D tilt effect to an element on mouse move.
 * Disabled on touch devices and when prefers-reduced-motion is set.
 */
export function useTilt<T extends HTMLElement>(ref: RefObject<T | null>, max = 8) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduce) return;

    let raf = 0;
    let pending = false;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = -y * max;
      targetY = x * max;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      el.style.transform = `perspective(1000px) rotateX(${curX.toFixed(2)}deg) rotateY(${curY.toFixed(2)}deg)`;
      if (Math.abs(targetX - curX) > 0.05 || Math.abs(targetY - curY) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        pending = false;
      }
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(tick);
      }
    };

    el.style.transformStyle = "preserve-3d";
    el.style.willChange = "transform";
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [ref, max]);
}
