"use client";

import { useEffect, useState } from "react";

type TypewriterTextProps = {
  phrases: readonly string[];
};

export function TypewriterText({ phrases }: TypewriterTextProps) {
  const [text, setText] = useState(phrases[0] ?? "");

  useEffect(() => {
    if (phrases.length < 2) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let phraseIndex = 0;
    let characterIndex = phrases[0].length;
    let deleting = false;
    let timeoutId: number;

    function tick() {
      const phrase = phrases[phraseIndex];

      if (!deleting) {
        if (characterIndex < phrase.length) {
          characterIndex += 1;
          setText(phrase.slice(0, characterIndex));
          timeoutId = window.setTimeout(tick, 62);
        } else {
          deleting = true;
          timeoutId = window.setTimeout(tick, 1500);
        }
        return;
      }

      characterIndex -= 1;
      setText(phrase.slice(0, characterIndex));
      if (characterIndex === 0) {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        deleting = false;
        timeoutId = window.setTimeout(tick, 220);
      } else {
        timeoutId = window.setTimeout(tick, 30);
      }
    }

    timeoutId = window.setTimeout(() => {
      deleting = true;
      tick();
    }, 1700);

    return () => window.clearTimeout(timeoutId);
  }, [phrases]);

  return (
    <span aria-hidden="true" className="inline-flex min-h-[1.1em] items-baseline">
      {text}
      <span className="ml-1 inline-block h-[0.82em] w-px translate-y-[0.04em] bg-current motion-safe:animate-pulse" />
    </span>
  );
}
