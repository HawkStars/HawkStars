# Testing Strategy

## Testing Philosophy

The HawkStars project emphasizes practical testing that ensures reliability without overwhelming the development workflow. Focus on testing critical user journeys, internationalization edge cases, and CMS integration points.

## Testing Stack

```json
// Recommended testing dependencies
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  }
}
```

## Component Testing

### Testing with Internationalization

```typescript
// tests/utils/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { AppProvider } from '@/utils/contexts/AppProvider';
import { Language } from '@/i18n/settings';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  lng?: Language;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  { lng = 'pt', ...renderOptions }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppProvider lng={lng}>
      {children}
    </AppProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything
export * from '@testing-library/react';
export { renderWithProviders as render };
```

### Component Test Examples

```typescript
// components/__tests__/Button.test.tsx
import { render, screen } from '@/tests/utils/test-utils';
import Button from '@/components/utils/Button';

describe('Button Component', () => {
  it('renders with correct variant styling', () => {
    render(
      <Button type="button" variant="success">
        Test Button
      </Button>
    );

    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toHaveClass('bg-green'); // Based on variant
  });

  it('shows loading state correctly', () => {
    render(
      <Button type="button" loading={true}>
        Submit
      </Button>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Button type="button" onClick={handleClick}>
        Click me
      </Button>
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Internationalized Components

```typescript
// components/__tests__/HomeHeroSection.test.tsx
import { render, screen } from '@/tests/utils/test-utils';
import HomeHeroSection from '@/components/home/HomeHeroSection';

describe('HomeHeroSection', () => {
  it('renders Portuguese content by default', () => {
    render(<HomeHeroSection />, { lng: 'pt' });

    // Assuming translation keys exist
    expect(screen.getByText(/título em português/i)).toBeInTheDocument();
  });

  it('renders English content when language is English', () => {
    render(<HomeHeroSection />, { lng: 'en' });

    expect(screen.getByText(/title in english/i)).toBeInTheDocument();
  });

  it('generates correct localized URLs', () => {
    render(<HomeHeroSection />, { lng: 'en' });

    const donateLink = screen.getByRole('link', { name: /donate/i });
    expect(donateLink).toHaveAttribute('href', '/en/contribute');
  });
});
```

## API Route Testing

### Testing Custom Endpoints

```typescript
// lib/payload/endpoints/__tests__/totalContributions.test.ts
import { createMockPayloadRequest } from '@/tests/mocks/payload';
import totalContributioValueQuery from '../totalContributioValueQuery';

describe('Total Contributions Endpoint', () => {
  it('calculates sum of all contributions correctly', async () => {
    const mockRequest = createMockPayloadRequest({
      mockData: {
        contributions: [{ value: 100 }, { value: 250 }, { value: 75 }],
      },
    });

    const response = await totalContributioValueQuery(mockRequest);
    const data = await response.json();

    expect(data.sum).toBe(425);
  });

  it('handles empty contributions gracefully', async () => {
    const mockRequest = createMockPayloadRequest({
      mockData: { contributions: [] },
    });

    const response = await totalContributioValueQuery(mockRequest);
    const data = await response.json();

    expect(data.sum).toBe(0);
  });
});
```

### Mocking Payload CMS

```typescript
// tests/mocks/payload.ts
export const createMockPayloadRequest = (
  options: {
    mockData?: Record<string, any[]>;
    user?: any;
  } = {}
) => {
  const { mockData = {}, user = null } = options;

  return {
    payload: {
      find: jest.fn().mockImplementation(({ collection }) => {
        const docs = mockData[collection] || [];
        return Promise.resolve({
          docs,
          totalDocs: docs.length,
          hasNextPage: false,
          hasPrevPage: false,
        });
      }),
      findByID: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user,
  };
};
```

## Integration Testing

### Testing Page Components

```typescript
// app/[lng]/__tests__/page.test.tsx
import { render, screen } from '@/tests/utils/test-utils';
import HomePage from '../page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('Home Page', () => {
  it('renders main sections correctly', () => {
    render(<HomePage />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText(/hawkstars/i)).toBeInTheDocument();
  });

  it('includes navigation links', () => {
    render(<HomePage />);

    expect(screen.getByRole('link', { name: /gallery/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /events/i })).toBeInTheDocument();
  });
});
```

### Testing Forms

```typescript
// components/__tests__/ContactForm.test.tsx
import { render, screen, waitFor } from '@/tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import ContactForm from '@/components/forms/ContactForm';

// Mock fetch for form submission
global.fetch = jest.fn();

describe('ContactForm', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), 'João Silva');
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello there!');

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'João Silva',
          email: 'joao@example.com',
          message: 'Hello there!'
        })
      });
    });
  });

  it('shows validation errors for invalid inputs', async () => {
    const user = userEvent.setup();

    render(<ContactForm />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });
});
```

## Visual Regression Testing

### Storybook Setup (Optional)

```typescript
// .storybook/main.ts
export default {
  stories: ['../components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
};

// components/utils/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    type: 'button',
    variant: 'success',
    children: 'Primary Button',
  },
};

export const Loading: Story = {
  args: {
    type: 'button',
    loading: true,
    children: 'Loading Button',
  },
};
```

## E2E Testing Considerations

### Critical User Journeys to Test

1. **Language switching**: Verify content changes between pt/en
2. **Gallery navigation**: Browse artwork, view details
3. **Event listing**: View events, navigate to details
4. **Form submissions**: Contact forms, membership applications
5. **CMS admin**: Login, create/edit content, publish
6. **Mobile responsive**: Test key flows on mobile devices

### Playwright Setup (Recommended for E2E)

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});

// e2e/language-switching.spec.ts
import { test, expect } from '@playwright/test';

test('language switching works correctly', async ({ page }) => {
  await page.goto('/');

  // Should redirect to /pt by default
  await expect(page).toHaveURL('/pt');

  // Switch to English
  await page.click('[data-testid="language-switcher"]');
  await page.click('[data-testid="language-en"]');

  // Verify URL and content change
  await expect(page).toHaveURL('/en');
  await expect(page.locator('h1')).toContainText('Welcome'); // English title
});
```

## Test Configuration

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/*.stories.{js,jsx,ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

### Jest Setup File

```typescript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/pt',
}));

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Return key as translation for tests
    i18n: {
      changeLanguage: jest.fn(),
      language: 'pt',
    },
  }),
}));
```

## Testing Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- Button.test.tsx

# Run E2E tests
npx playwright test

# Run E2E tests in UI mode
npx playwright test --ui
```

## Testing Best Practices

1. **Test behavior, not implementation**: Focus on what users experience
2. **Use meaningful test descriptions**: Describe what the test verifies
3. **Keep tests isolated**: Each test should be independent
4. **Mock external dependencies**: Don't rely on actual API calls in unit tests
5. **Test accessibility**: Include basic a11y checks in component tests
6. **Test internationalization**: Verify both language versions work correctly
7. **Test error states**: Verify error handling and user feedback
8. **Test responsive design**: Ensure mobile compatibility in key components

This testing strategy ensures the HawkStars application remains reliable while maintaining development velocity.
