"use client"

import { useEffect, useRef } from "react";
import { animate } from "motion";

export default function FadeInUp({ children, delay = 0, duration = 1, fromY = 20 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Adjust options: lower threshold and add a rootMargin so the animation triggers earlier.
    const options = {
      threshold: 0.1,
      rootMargin: "0px 0px -20% 0px"
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        console.log("FadeInUp entry:", entry);
        if (entry.isIntersecting) {
          animate(
            element,
            { opacity: [0, 1], y: [fromY, 0] },
            { duration, delay, ease: "easeOut" }
          );
          observerInstance.disconnect();
        }
      });
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, duration, fromY]);

  return (
    <div ref={containerRef} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
