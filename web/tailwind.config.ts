import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        card: 'var(--color-card)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)'
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'calc(var(--radius) + 2px)',
        md: 'calc(var(--radius) - 2px)'
      },
      boxShadow: {
        soft: 'var(--shadow-soft)'
      }
    }
  },
  plugins: []
};

export default config;
