import React, { useEffect } from 'react';
import type { Preview, Decorator } from '@storybook/react-vite';
import '../src/styles/tokens.css';
import '../src/styles/themes/violet.css';
import '../src/index.css';

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals as { theme?: string }).theme ?? 'light';
  const brand = (context.globals as { brand?: string }).brand ?? 'aurora';

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    if (brand === 'aurora') {
      root.removeAttribute('data-brand');
    } else {
      root.setAttribute('data-brand', brand);
    }
  }, [theme, brand]);

  return (
    <div className="bg-surface text-ink min-h-screen p-6">
      <Story />
    </div>
  );
};

const preview: Preview = {
  globalTypes: {
    brand: {
      name: 'Brand',
      description: 'Switch brand theme',
      defaultValue: 'aurora',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'aurora', title: 'Aurora',  icon: 'starhollow' },
          { value: 'violet', title: 'Violet',  icon: 'diamond' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
    theme: {
      name: 'Mode',
      description: 'Toggle light / dark mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark',  title: 'Dark',  icon: 'moon' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    layout: 'fullscreen',
  },
};

export default preview;
