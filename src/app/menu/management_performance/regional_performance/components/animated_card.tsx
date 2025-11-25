'use client';

import { useEffect, useState } from 'react';

interface AnimatedCardProps {
  delay: number;
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
}

export function AnimatedCard({ delay, children, direction = 'left' }: AnimatedCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'left': return 'translate-x-[-100%]';
      case 'right': return 'translate-x-[100%]';
      case 'top': return 'translate-y-[-100%]';
      case 'bottom': return 'translate-y-[100%]';
      default: return 'translate-x-[-100%]';
    }
  };

  return (
    <div
      className={`transform transition-all duration-1000 ease-out ${
        isVisible ? 'translate-x-0 translate-y-0 opacity-100' : `${getInitialTransform()} opacity-0`
      }`}
    >
      {children}
    </div>
  );
}

