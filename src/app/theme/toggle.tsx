'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Palette, ChevronDown } from 'lucide-react';
import { useThemeStore, themes, type ThemeMode } from '@/app/theme';
import { cn } from '@/utils';

export function ThemeToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, setTheme, getCurrentThemeConfig } = useThemeStore();
  const currentConfig = getCurrentThemeConfig();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 클릭 외부 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleThemeChange = (theme: ThemeMode) => {
    setTheme(theme);
    setIsOpen(false);
  };

  // 드롭다운 위치 계산
  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, right: 0 };
    
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right
    };
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-base text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/20",
          "bg-gradient-to-r",
          currentConfig.colors.primary
        )}
        title="테마 변경"
      >
        <Palette className="w-5 h-5" />
        <span className="hidden sm:inline">{currentConfig.name}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          className="fixed w-48 bg-white rounded-lg shadow-2xl border border-gray-200 z-[9999] backdrop-blur-sm"
          style={{
            top: getDropdownPosition().top,
            right: getDropdownPosition().right
          }}
        >
          <div className="p-2">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key as ThemeMode)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  currentTheme === key
                    ? "bg-blue-100 text-blue-900 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <div className="font-medium">{theme.name}</div>
                <div className="text-xs text-gray-500">{theme.description}</div>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
} 