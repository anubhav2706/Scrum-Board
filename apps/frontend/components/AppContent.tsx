'use client';

import { useEffect } from 'react';
import { 
  MantineProvider, 
  AppShell,
  createTheme,
  MantineColorsTuple
} from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ClientWrapper from "./ClientWrapper";
import ErrorBoundary from "./ErrorBoundary";
import ClientOnly from "./ClientOnly";
import AuthGate from "./AuthGate";

// Enhanced theme with professional colors and typography
const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, Monaco, Consolas, monospace',
  
  // Enhanced color palette
  colors: {
    brand: [
      '#eff6ff', // 50
      '#dbeafe', // 100
      '#bfdbfe', // 200
      '#93c5fd', // 300
      '#60a5fa', // 400
      '#3b82f6', // 500
      '#2563eb', // 600
      '#1d4ed8', // 700
      '#1e40af', // 800
      '#1e3a8a', // 900
      '#172554'  // 950
    ] as MantineColorsTuple,
    
    gray: [
      '#f9fafb', // 50
      '#f3f4f6', // 100
      '#e5e7eb', // 200
      '#d1d5db', // 300
      '#9ca3af', // 400
      '#6b7280', // 500
      '#4b5563', // 600
      '#374151', // 700
      '#1f2937', // 800
      '#111827', // 900
      '#030712'  // 950
    ] as MantineColorsTuple,
    
    success: [
      '#f0fdf4', // 50
      '#dcfce7', // 100
      '#bbf7d0', // 200
      '#86efac', // 300
      '#4ade80', // 400
      '#22c55e', // 500
      '#16a34a', // 600
      '#15803d', // 700
      '#166534', // 800
      '#14532d', // 900
      '#052e16'  // 950
    ] as MantineColorsTuple,
    
    warning: [
      '#fffbeb', // 50
      '#fef3c7', // 100
      '#fde68a', // 200
      '#fcd34d', // 300
      '#fbbf24', // 400
      '#f59e0b', // 500
      '#d97706', // 600
      '#b45309', // 700
      '#92400e', // 800
      '#78350f', // 900
      '#451a03'  // 950
    ] as MantineColorsTuple,
    
    error: [
      '#fef2f2', // 50
      '#fee2e2', // 100
      '#fecaca', // 200
      '#fca5a5', // 300
      '#f87171', // 400
      '#ef4444', // 500
      '#dc2626', // 600
      '#b91c1c', // 700
      '#991b1b', // 800
      '#7f1d1d', // 900
      '#450a0a'  // 950
    ] as MantineColorsTuple,
  },

  // Enhanced typography scale
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },

  // Enhanced spacing scale
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
  },

  // Enhanced border radius
  radius: {
    xs: '0.125rem',   // 2px
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
  },

  // Enhanced shadows
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Enhanced breakpoints for better responsive design
  breakpoints: {
    xs: '36em',   // 576px
    sm: '48em',   // 768px
    md: '62em',   // 992px
    lg: '75em',   // 1200px
    xl: '88em',   // 1408px
    '2xl': '96em', // 1536px
  },

  // Enhanced component styles
  components: {
    AppShell: {
      styles: {
        main: {
          background: 'var(--mantine-color-dashboard-bg)',
          minHeight: '100vh',
        },
        navbar: {
          background: 'var(--mantine-color-navbar)',
          borderRight: '1px solid var(--mantine-color-border)',
          boxShadow: 'var(--mantine-shadow-sm)',
        },
        header: {
          background: 'var(--mantine-color-header)',
          borderBottom: '1px solid var(--mantine-color-border)',
          boxShadow: 'var(--mantine-shadow-sm)',
        },
      },
    },
    
    Card: {
      styles: {
        root: {
          background: 'var(--mantine-color-card)',
          border: '1px solid var(--mantine-color-border)',
          borderRadius: 'var(--mantine-radius-xl)',
          boxShadow: 'var(--mantine-shadow-sm)',
          transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: 'var(--mantine-shadow-lg)',
            background: 'var(--mantine-color-hover)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    Divider: {
      styles: {
        root: {
          borderColor: 'var(--mantine-color-divider)',
        },
      },
    },
    // Typography styles for headings, body, muted, etc.
    Title: {
      styles: {
        root: {
          color: 'var(--mantine-text-heading)',
          fontWeight: 700,
        },
      },
    },
    Text: {
      styles: {
        root: {
          color: 'var(--mantine-text-body)',
        },
      },
    },
    // Add subheading, muted, placeholder, and link text styles
    // Subheading (for custom use)
    Subheading: {
      styles: {
        root: {
          color: 'var(--mantine-text-subheading)',
          fontWeight: 500,
        },
      },
    },
    // Muted text (for custom use)
    Muted: {
      styles: {
        root: {
          color: 'var(--mantine-text-muted)',
        },
      },
    },
    // Placeholder text (for custom use)
    Placeholder: {
      styles: {
        root: {
          color: 'var(--mantine-text-placeholder)',
        },
      },
    },
    // Link text
    Anchor: {
      styles: {
        root: {
          color: 'var(--mantine-text-link)',
          fontWeight: 500,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },

    Button: {
      styles: {
        root: {
          fontWeight: 500,
          borderRadius: 'var(--mantine-radius-lg)',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: 'var(--mantine-shadow-md)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
      },
    },

    Input: {
      styles: {
        input: {
          borderRadius: 'var(--mantine-radius-lg)',
          border: '1px solid var(--mantine-color-gray-300)',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:focus': {
            borderColor: 'var(--mantine-color-blue-500)',
            boxShadow: '0 0 0 3px rgb(59 130 246 / 0.1)',
          },
        },
      },
    },

    Badge: {
      styles: {
        root: {
          borderRadius: 'var(--mantine-radius-full)',
          fontWeight: 500,
          textTransform: 'none',
        },
      },
    },

    Avatar: {
      styles: {
        root: {
          borderRadius: 'var(--mantine-radius-full)',
        },
      },
    },

    Progress: {
      styles: {
        root: {
          borderRadius: 'var(--mantine-radius-full)',
        },
        bar: {
          borderRadius: 'var(--mantine-radius-full)',
          transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },

    Modal: {
      styles: {
        content: {
          borderRadius: 'var(--mantine-radius-xl)',
          boxShadow: 'var(--mantine-shadow-2xl)',
        },
      },
    },

    Menu: {
      styles: {
        dropdown: {
          borderRadius: 'var(--mantine-radius-lg)',
          boxShadow: 'var(--mantine-shadow-lg)',
          border: '1px solid var(--mantine-color-gray-200)',
        },
        item: {
          borderRadius: 'var(--mantine-radius-md)',
          margin: '2px',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'var(--mantine-color-gray-50)',
          },
        },
      },
    },

    Tooltip: {
      styles: {
        tooltip: {
          borderRadius: 'var(--mantine-radius-md)',
          boxShadow: 'var(--mantine-shadow-lg)',
          fontSize: 'var(--mantine-font-size-xs)',
          fontWeight: 500,
        },
      },
    },

    Notification: {
      styles: {
        root: {
          borderRadius: 'var(--mantine-radius-lg)',
          boxShadow: 'var(--mantine-shadow-lg)',
          border: '1px solid var(--mantine-color-gray-200)',
        },
      },
    },

    Tabs: {
      styles: {
        tab: {
          borderRadius: 'var(--mantine-radius-lg)',
          fontWeight: 500,
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'var(--mantine-color-gray-50)',
          },
        },
        panel: {
          padding: 'var(--mantine-spacing-lg)',
        },
      },
    },

    NavLink: {
  styles: {
    root: {
      borderRadius: 'var(--mantine-radius-lg)',
      margin: '2px 0',
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        background: 'var(--mantine-color-gray-50)',
        color: 'var(--mantine-color-gray-700)', // 👈 label + icon color on hover
      },
      '&[dataActive]': {
        background: 'var(--mantine-color-blue-50)',
        color: 'var(--primary-950)',
        fontWeight: 600,
      },
    },
    leftSection: {
      color: 'inherit', // ensures icon inherits color
    },
  },
},

    ActionIcon: {
      styles: {
        root: {
          borderRadius: 'var(--mantine-radius-lg)',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },

    TextInput: {
      styles: {
        input: {
          borderRadius: 'var(--mantine-radius-lg)',
          border: '1px solid var(--mantine-color-gray-300)',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:focus': {
            borderColor: 'var(--mantine-color-blue-500)',
            boxShadow: '0 0 0 3px rgb(59 130 246 / 0.1)',
          },
        },
      },
    },

    Textarea: {
      styles: {
        input: {
          borderRadius: 'var(--mantine-radius-lg)',
          border: '1px solid var(--mantine-color-gray-300)',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:focus': {
            borderColor: 'var(--mantine-color-blue-500)',
            boxShadow: '0 0 0 3px rgb(59 130 246 / 0.1)',
          },
        },
      },
    },

    Select: {
      styles: {
        input: {
          borderRadius: 'var(--mantine-radius-lg)',
          border: '1px solid var(--mantine-color-gray-300)',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:focus': {
            borderColor: 'var(--mantine-color-blue-500)',
            boxShadow: '0 0 0 3px rgb(59 130 246 / 0.1)',
          },
        },
        dropdown: {
          borderRadius: 'var(--mantine-radius-lg)',
          boxShadow: 'var(--mantine-shadow-lg)',
          border: '1px solid var(--mantine-color-gray-200)',
        },
      },
    },

    ScrollArea: {
      styles: {
        scrollbar: {
          '&[dataOrientation="vertical"]': {
            width: '8px',
          },
          '&[dataOrientation="horizontal"]': {
            height: '8px',
          },
        },
        thumb: {
          borderRadius: 'var(--mantine-radius-full)',
          background: 'var(--mantine-color-gray-300)',
          '&:hover': {
            background: 'var(--mantine-color-gray-400)',
          },
        },
      },
    },
  },
});

function AppContentInner({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useLocalStorage<'light' | 'dark'>({
    key: 'color-scheme',
    defaultValue: 'light',
  });

  const toggleColorScheme = (value?: 'light' | 'dark') =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  // Update HTML data attribute when color scheme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-mantine-color-scheme', colorScheme);
    }
  }, [colorScheme]);

  return (
    <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
      <AuthGate>
        <AuthProvider>
          <SocketProvider>
            <ErrorBoundary>
              <ClientWrapper>
                <AppShell
                  header={{ height: 60 }}
                  navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: true } }}
                  padding="md"
                >
                  <AppShell.Header>
                    <Topbar />
                  </AppShell.Header>

                  <AppShell.Navbar p="md">
                    <Sidebar />
                  </AppShell.Navbar>

                  <AppShell.Main>
                    {children}
                  </AppShell.Main>
                </AppShell>
              </ClientWrapper>
            </ErrorBoundary>
          </SocketProvider>
        </AuthProvider>
      </AuthGate>
    </MantineProvider>
  );
}

export default function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly fallback={
      <MantineProvider theme={theme} defaultColorScheme="light">
        <AuthProvider>
          <SocketProvider>
            <ErrorBoundary>
              <ClientWrapper>
                <AppShell
                  header={{ height: 60 }}
                  navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: true } }}
                  padding="md"
                >
                  <AppShell.Header>
                    <Topbar />
                  </AppShell.Header>

                  <AppShell.Navbar p="md">
                    <Sidebar />
                  </AppShell.Navbar>

                  <AppShell.Main>
                    {children}
                  </AppShell.Main>
                </AppShell>
              </ClientWrapper>
            </ErrorBoundary>
          </SocketProvider>
        </AuthProvider>
      </MantineProvider>
    }>
      <AppContentInner>
        {children}
      </AppContentInner>
    </ClientOnly>
  );
} 