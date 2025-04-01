"use client"

import { useEffect, useRef } from "react";
import { animate } from "motion";

export default function FadeInUp({ children, delay = 0, duration = 1, fromY = 20 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Trigger the animation when element enters viewport
            animate(
              element,
              { opacity: [0, 1], y: [fromY, 0] },
              { duration, delay, ease: "easeOut" }
            );
            observerInstance.disconnect();
          }
        });
      },
      { threshold: 0.3 } // Adjust threshold as needed
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [delay, duration, fromY]);

  return (
    <div ref={containerRef} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
