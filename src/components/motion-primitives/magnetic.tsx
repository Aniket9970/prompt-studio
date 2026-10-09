'use client';

import React, { useRef, useEffect } from 'react';

export type MagneticProps = {
  children: React.ReactNode;
  intensity?: number;
  range?: number;
  actionArea?: 'self' | 'parent' | 'global';
  className?: string;
};

export function Magnetic({
  children,
  intensity = 0.35,
  range = 90,
  actionArea = 'self',
  className,
}: MagneticProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rafId = useRef<number | null>(null);
  const isHoveredRef = useRef(false);

  const animate = () => {
    // Lerp smoothing factor for 144Hz
    const ease = 0.22;
    currentX.current += (targetX.current - currentX.current) * ease;
    currentY.current += (targetY.current - currentY.current) * ease;

    if (containerRef.current) {
      containerRef.current.style.transform = `translate3d(${currentX.current.toFixed(2)}px, ${currentY.current.toFixed(2)}px, 0)`;
    }

    const diff = Math.abs(targetX.current - currentX.current) + Math.abs(targetY.current - currentY.current);
    if (diff > 0.05) {
      rafId.current = requestAnimationFrame(animate);
    } else {
      currentX.current = targetX.current;
      currentY.current = targetY.current;
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${currentX.current.toFixed(2)}px, ${currentY.current.toFixed(2)}px, 0)`;
      }
      rafId.current = null;
    }
  };

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!isHoveredRef.current && actionArea !== 'global') {
        if (targetX.current !== 0 || targetY.current !== 0) {
          targetX.current = 0;
          targetY.current = 0;
          if (!rafId.current) rafId.current = requestAnimationFrame(animate);
        }
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const absoluteDistance = Math.hypot(distanceX, distanceY);

      if (absoluteDistance <= range) {
        const scale = 1 - absoluteDistance / range;
        targetX.current = distanceX * intensity * scale;
        targetY.current = distanceY * intensity * scale;
      } else {
        targetX.current = 0;
        targetY.current = 0;
      }

      if (!rafId.current) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [actionArea, intensity, range]);

  useEffect(() => {
    if (actionArea === 'parent' && containerRef.current?.parentElement) {
      const parent = containerRef.current.parentElement;
      const onEnter = () => { isHoveredRef.current = true; };
      const onLeave = () => {
        isHoveredRef.current = false;
        targetX.current = 0;
        targetY.current = 0;
        if (!rafId.current) rafId.current = requestAnimationFrame(animate);
      };
      parent.addEventListener('pointerenter', onEnter);
      parent.addEventListener('pointerleave', onLeave);
      return () => {
        parent.removeEventListener('pointerenter', onEnter);
        parent.removeEventListener('pointerleave', onLeave);
      };
    } else if (actionArea === 'global') {
      isHoveredRef.current = true;
    }
  }, [actionArea]);

  const handlePointerEnter = () => {
    if (actionArea === 'self') {
      isHoveredRef.current = true;
    }
  };

  const handlePointerLeave = () => {
    if (actionArea === 'self') {
      isHoveredRef.current = false;
      targetX.current = 0;
      targetY.current = 0;
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(animate);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      onPointerEnter={actionArea === 'self' ? handlePointerEnter : undefined}
      onPointerLeave={actionArea === 'self' ? handlePointerLeave : undefined}
      style={{
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      {children}
    </div>
  );
}


