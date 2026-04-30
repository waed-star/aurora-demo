import React, { useEffect } from 'react';
import type { Preview, Decorator } from '@storybook/react-vite';
import '../src/styles/tokens.css';
import '../src/index.css';

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals as { theme?: string }).theme ?? 'light';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="bg-surface text-ink min-h-screen p-6">
      <Story />
    </div>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
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
