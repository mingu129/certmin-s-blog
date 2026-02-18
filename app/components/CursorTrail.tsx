'use client';

import { useEffect } from 'react';

const SPARKLES = ['★', '✦', '✨', '⭐', '💫', '✧', '⚡', '♦', '✩', '❋', '◆', '✱'];
const COLORS = ['#FF00FF', '#FFFF00', '#00FFFF', '#FF69B4', '#00FF00', '#FF6600', '#FF0088', '#00FFAA'];

export default function CursorTrail() {
  useEffect(() => {
    let frameCount = 0;
    let lastX = 0;
    let lastY = 0;

    const createSparkle = (x: number, y: number) => {
      const el = document.createElement('span');
      el.className = 'cursor-sparkle';
      el.textContent = SPARKLES[Math.floor(Math.random() * SPARKLES.length)];
      el.style.left = `${x + (Math.random() - 0.5) * 26}px`;
      el.style.top  = `${y + (Math.random() - 0.5) * 26}px`;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.color = color;
      el.style.fontSize = `${Math.random() * 12 + 9}px`;
      el.style.textShadow = `0 0 6px ${color}`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 700);
    };

    const onMouseMove = (e: MouseEvent) => {
      frameCount++;
      if (frameCount % 3 !== 0) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (Math.sqrt(dx * dx + dy * dy) > 5) {
        createSparkle(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);

  return null;
}
