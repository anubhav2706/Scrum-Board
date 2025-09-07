'use client';

import { Box, Text } from '@mantine/core';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: '1rem',
      }}
    >
      <Box
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--mantine-color-gray-200)',
          borderTop: '3px solid var(--mantine-color-blue-500)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <Text size="sm" c="var(--mantine-text-subheading)">
        {message}
      </Text>
    </Box>
  );
} 