"use client"

import { animate, stagger } from "motion"
import { useEffect, useRef } from "react"

function splitTextPreserveMarkup(element) {
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const segments = node.textContent.match(/(\S+|\s+)/g)
      if (!segments) return null
      return segments.map(segment => {
        if (segment.trim() === "") {
          return document.createTextNode(segment)
        } else {
          const span = document.createElement("span")
          span.className = "split-word"
          span.textContent = segment
          return span
        }
      })
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName.toLowerCase() === "br") {
        return node.cloneNode(true)
      }
      const clone = node.cloneNode(false)
      node.childNodes.forEach(child => {
        const processed = processNode(child)
        if (Array.isArray(processed)) {
          processed.forEach(el => clone.appendChild(el))
        } else if (processed) {
          clone.appendChild(processed)
        }
      })
      return clone
    }
    return null
  }

  const newNodes = []
  element.childNodes.forEach(child => {
    const processed = processNode(child)
    if (Array.isArray(processed)) {
      newNodes.push(...processed)
    } else if (processed) {
      newNodes.push(processed)
    }
  })
  element.innerHTML = ""
  newNodes.forEach(n => element.appendChild(n))
  return element.querySelectorAll(".split-word")
}

export default function AnimatedHeadline({ children }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const h1Element = container.querySelector("h1")
    if (!h1Element) return

    const words = splitTextPreserveMarkup(h1Element)

    if (words.length > 0) {
      // Set initial opacity and translateY via JS (not CSS)
      words.forEach(word => {
        word.style.opacity = 0
        word.style.transform = "translateY(10px)"
      })

      animate(
        words,
        { opacity: 1, y: 0 },
        {
          type: "spring",
          duration: 3,
          bounce: 0,
          delay: stagger(0.08),
        }
      )
    } else {
      animate(h1Element, { opacity: [0, 1], y: [10, 0] }, { duration: 3 })
    }
  }, [])

  return (
    <div className="animated-headline-container" ref={containerRef}>
      <h1 className="page-title">{children}</h1>
      <style>{`
        .animated-headline-container {
          display: flex;
          width: 100%;
          text-align: left;
        }
        .split-word {
          display: inline-block;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  )
}
