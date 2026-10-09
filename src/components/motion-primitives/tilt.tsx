'use client';

import React, { useRef, useEffect } from 'react';

export type TiltProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  rotationFactor?: number;
  isRevese?: boolean;
};

export function Tilt({
  children,
  className,
  style,
  rotationFactor = 8,
  isRevese = false,
}: TiltProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rafId = useRef<number | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

  // Smooth lerp loop that runs at the display's exact native refresh rate (144Hz)
  const animate = () => {
    // Lerp smoothing factor: 0.18 gives snappy, zero-lag response at 144Hz
    const ease = 0.18;
    currentX.current += (targetX.current - currentX.current) * ease;
    currentY.current += (targetY.current - currentY.current) * ease;

    if (containerRef.current) {
      const rotFactor = isRevese ? -rotationFactor : rotationFactor;
      const rotX = currentY.current * rotFactor * 2;
      const rotY = -currentX.current * rotFactor * 2;
      
      containerRef.current.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(3)}deg) rotateY(${rotY.toFixed(3)}deg) translateZ(0)`;
    }

    const diff = Math.abs(targetX.current - currentX.current) + Math.abs(targetY.current - currentY.current);
    if (diff > 0.0005) {
      rafId.current = requestAnimationFrame(animate);
    } else {
      currentX.current = targetX.current;
      currentY.current = targetY.current;
      if (containerRef.current) {
        const rotFactor = isRevese ? -rotationFactor : rotationFactor;
        const rotX = currentY.current * rotFactor * 2;
        const rotY = -currentX.current * rotFactor * 2;
        containerRef.current.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(3)}deg) rotateY(${rotY.toFixed(3)}deg) translateZ(0)`;
      }
      rafId.current = null;
    }
  };

  const handlePointerEnter = () => {
    if (containerRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!rectRef.current && containerRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    targetX.current = mouseX / rect.width - 0.5;
    targetY.current = mouseY / rect.height - 0.5;

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(animate);
    }
  };

  const handlePointerLeave = () => {
    rectRef.current = null;
    targetX.current = 0;
    targetY.current = 0;
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style,
      }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  );
}


