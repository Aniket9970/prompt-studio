'use client';
import { ReactNode, useRef, useState, useEffect } from 'react';
import {
  motion,
  useInView,
  Variant,
  Transition,
  UseInViewOptions,
} from 'motion/react';

export type InViewProps = {
  children: ReactNode;
  variants?: {
    hidden: Variant;
    visible: Variant;
  };
  transition?: Transition;
  viewOptions?: UseInViewOptions;
  as?: React.ElementType;
  className?: string;
  once?: boolean;
};

const defaultVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function InView({
  children,
  variants = defaultVariants,
  transition,
  viewOptions = { once: true, margin: '-50px' },
  as = 'div',
  className,
  once = true,
}: InViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewOptions);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    if (isInView && !hasBeenInView) {
      setHasBeenInView(true);
    }
  }, [isInView, hasBeenInView]);

  const MotionComponent = motion[as as keyof typeof motion] as typeof as;
  const isVisible = once ? (hasBeenInView || isInView) : isInView;

  return (
    <MotionComponent
      ref={ref}
      initial='hidden'
      className={className}
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
    >
      {children}
    </MotionComponent>
  );
}

