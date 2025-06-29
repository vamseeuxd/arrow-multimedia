import { createTheme, ThemeOptions } from '@mui/material/styles';

const getTheme = (mode: 'light' | 'dark') => {
  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#2563eb' : '#3b82f6',
        light: mode === 'light' ? '#60a5fa' : '#93c5fd',
        dark: mode === 'light' ? '#1d4ed8' : '#1e40af',
      },
      secondary: {
        main: mode === 'light' ? '#7c3aed' : '#8b5cf6',
        light: mode === 'light' ? '#a78bfa' : '#c4b5fd',
        dark: mode === 'light' ? '#5b21b6' : '#6d28d9',
      },
      success: {
        main: mode === 'light' ? '#059669' : '#10b981',
        light: mode === 'light' ? '#34d399' : '#6ee7b7',
        dark: mode === 'light' ? '#047857' : '#065f46',
      },
      warning: {
        main: mode === 'light' ? '#d97706' : '#f59e0b',
        light: mode === 'light' ? '#fbbf24' : '#fcd34d',
        dark: mode === 'light' ? '#b45309' : '#92400e',
      },
      error: {
        main: mode === 'light' ? '#dc2626' : '#ef4444',
        light: mode === 'light' ? '#f87171' : '#fca5a5',
        dark: mode === 'light' ? '#b91c1c' : '#991b1b',
      },
      info: {
        main: mode === 'light' ? '#0891b2' : '#06b6d4',
        light: mode === 'light' ? '#22d3ee' : '#67e8f9',
        dark: mode === 'light' ? '#0e7490' : '#0c4a6e',
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#1e293b',
      },
      text: {
        primary: mode === 'light' ? '#1e293b' : '#f1f5f9',
        secondary: mode === 'light' ? '#64748b' : '#94a3b8',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
        lineHeight: 1.3,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            padding: '10px 20px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
              : '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
            borderRadius: 12,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'light'
              ? '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)'
              : '0 8px 25px rgba(0, 0, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      },
    },
  };

  return createTheme(themeOptions);
};

export default getTheme;