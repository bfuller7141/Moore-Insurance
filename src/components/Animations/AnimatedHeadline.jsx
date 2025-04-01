"use client"

import { animate, stagger } from "motion"
import { useEffect, useRef } from "react"

function splitTextPreserveMarkup(element) {
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const segments = node.textContent.match(/(\S+|\s+)/g);
      if (!segments) return null;
      return segments.map(segment => {
        if (segment.trim() === "") {
          return document.createTextNode(segment);
        } else {
          const span = document.createElement("span");
          span.className = "split-word";
          span.textContent = segment;
          return span;
        }
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName.toLowerCase() === "br") {
        return node.cloneNode(true);
      }
      const clone = node.cloneNode(false);
      node.childNodes.forEach(child => {
        const processed = processNode(child);
        if (Array.isArray(processed)) {
          processed.forEach(el => clone.appendChild(el));
        } else if (processed) {
          clone.appendChild(processed);
        }
      });
      return clone;
    }
    return null;
  }

  const newNodes = [];
  element.childNodes.forEach(child => {
    const processed = processNode(child);
    if (Array.isArray(processed)) {
      newNodes.push(...processed);
    } else if (processed) {
      newNodes.push(processed);
    }
  });
  element.innerHTML = "";
  newNodes.forEach(n => element.appendChild(n));
  return element.querySelectorAll(".split-word");
}

export default function AnimatedHeadline({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    console.log("AnimatedHeadline effect started");
    const container = containerRef.current;
    if (!container) {
      console.error("Container ref not found");
      return;
    }
    container.style.visibility = "visible";
    const h1Element = container.querySelector("h1");
    if (!h1Element) {
      console.error("No <h1> element found in container");
      return;
    }
    console.log("Headline text:", h1Element.textContent);
    const words = splitTextPreserveMarkup(h1Element);
    console.log("Number of split words:", words.length);
    console.log("Rebuilt h1 innerHTML:", h1Element.innerHTML);

    if (words.length > 0) {
      animate(
        words,
        { opacity: [0, 1], y: [10, 0] },
        {
          type: "spring",
          duration: 3,      // Increased duration for slower animation
          bounce: 0,
          delay: stagger(0.08)  // Increased stagger delay
        }
      );
    } else {
      console.warn("No words found; animating <h1> directly");
      animate(h1Element, { opacity: [0, 1], y: [10, 0] }, { duration: 3 });
    }
  }, []);

  return (
    <div 
      className="animated-headline-container" 
      ref={containerRef} 
      style={{ visibility: "hidden" }}
    >
      <h1 className="page-title">{children}</h1>
      <style>{`
        .animated-headline-container {
          display: flex;
          width: 100%;
          text-align: left;
          visibility: hidden;
        }
        .split-word {
          display: inline-block;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}
