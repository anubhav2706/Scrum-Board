'use client';

import { ActionIcon, useMantineTheme } from '@mantine/core';
import { Sun, Moon } from 'lucide-react';
import { useState } from 'react';

export default function ThemeToggle() {
  const theme = useMantineTheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ActionIcon
      variant="light"
      color={colorScheme === 'dark' ? 'yellow' : 'blue'}
      onClick={toggleColorScheme}
      title="Toggle color scheme"
      size="md"
    >
      {colorScheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </ActionIcon>
  );
}
