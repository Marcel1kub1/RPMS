'use client';

import Button from '@/components/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button classoverride='h-9 w-9 rounded-xl p-0'>
        <span className='sr-only'>Toggle theme</span>
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      classoverride='h-9 w-9 rounded-xl p-0'
    >
      {isDark ? <SunIcon className='h-5 w-5' /> : <MoonIcon className='h-5 w-5' />}
    </Button>
  );
}
