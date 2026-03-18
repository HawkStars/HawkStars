# Storybook Documentation

## Overview

This project uses [Storybook](https://storybook.js.org/) to develop and showcase Payload CMS blocks in isolation. All payload blocks used in rich text editors have corresponding Storybook stories.

## Getting Started

### Running Storybook

To start the Storybook development server:

```bash
pnpm run storybook
```

This will start Storybook on `http://localhost:6006`.

### Building Storybook

To build a static version of Storybook:

```bash
pnpm run build-storybook
```

The output will be in the `storybook-static` directory.

## Story Structure

All block stories are located in their respective block directories:

```
payload/blocks/
├── CallToAction/
│   ├── Component.tsx
│   ├── config.ts
│   └── CallToAction.stories.tsx
└── ...
```

## Available Block Stories

The following Payload CMS blocks have Storybook stories:

### Content Blocks

- **TextBlock** - Rich text content with alignment and width options
- **MediaBlock** - Image and media display block
- **VideoBlock** - YouTube, Vimeo, and direct video embeds
- **AccordionBlock** - Collapsible content sections
- **QuoteHighlightBlock** - Pull quotes with multiple style options (centered, bordered, highlighted)
- **FAQBlock** - Accordion-style frequently asked questions

### Layout Blocks

- **Hero** - Hero section with features grid
- **ContentWithImage** - Two-column layout with content and image
- **ColumnBased** - Multi-column layout with icons and lists
- **GallerySlider** - Image carousel/slider
- **TimelineBlock** - Visual timeline with vertical/horizontal orientations
- **ImageComparisonSliderBlock** - Interactive before/after image slider

### Marketing Blocks

- **CallToAction** - CTA section with globe animation
- **SimpleCTA** - Simple CTA with primary and secondary buttons
- **CardGridBlock** - Feature cards in a grid layout
- **TestimonialBlock** - Customer testimonials with various layouts
- **StatsBlock** - Statistics display with animations
- **LogosBlock** - Partner/client logo showcase
- **SocialProofBlock** - Stats display with multiple background themes
- **CTABannerBlock** - Call-to-action banners with centered/split/image-bg variants

### Fundraising & Donation Blocks

- **DonationProgressBlock** - Animated fundraising progress bar with donor count
- **PricingTableBlock** - Tiered membership/donation options with feature lists
- **StatsBlock** - Customizable statistics grid with icons, multiple column layouts, and CTA buttons
- **CampaignCountdownBlock** - Countdown timer for campaigns with theme options

### Event & Community Blocks

- **EventListBlock** - Event listings with list/grid/timeline layouts
- **TeamGridBlock** - Team member showcase with social links
- **VolunteerCalloutBlock** - Volunteer recruitment with opportunity cards
- **PartnerShowcaseBlock** - Partner logos with optional details
- **MilestoneTrackerBlock** - Project milestones with status indicators

### Interactive Blocks

- **NewsletterSignupBlock** - Email signup form with theme variants
- **MapLocationBlock** - Location map with contact information
- **ResourceDownloadBlock** - Downloadable resources with file type indicators
- **FeatureComparisonBlock** - Feature comparison tables

### Project Blocks

- **UpdatesBlock** - Blog posts/updates with categories
- **ProcessOneBlock** - Step-by-step process display

## Writing Stories

Each story follows this structure:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { BlockComponent } from './Component';

const meta: Meta<typeof BlockComponent> = {
  title: 'Payload Blocks/BlockName',
  component: BlockComponent,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof BlockComponent>;

export const Default: Story = {
  args: {
    // Block props based on Payload config
  },
};

export const Variant: Story = {
  args: {
    // Alternative configuration
  },
};
```

## Configuration

### Storybook Configuration

The main Storybook configuration is in `.storybook/main.ts`:

- **Stories**: Includes stories from `payload/blocks/**/*.stories.tsx`
- **Addons**:
  - `@chromatic-com/storybook` - Visual testing
  - `@storybook/addon-a11y` - Accessibility testing
  - `@storybook/addon-docs` - Auto-generated documentation
  - `@storybook/addon-vitest` - Testing integration
  - `@storybook/addon-onboarding` - Getting started guide
- **Framework**: `@storybook/nextjs-vite` - Next.js with Vite support
- **Alias**: Uses `@` alias pointing to project root

### Preview Configuration

The preview configuration in `.storybook/preview.ts`:

- Imports global CSS (`app/globals.css`) for Tailwind styles
- Configures background options (light/dark)
- Sets up controls for color and date matching

## Tips for Development

### Using Controls

Most stories include interactive controls in the Storybook UI. You can:

- Edit text content
- Change select options (alignment, layout, style)
- Toggle boolean flags (autoplay, show ratings)
- Modify numbers (delays, values)

### Viewing Components

1. Navigate to "Payload Blocks" in the sidebar
2. Select a block to view its stories
3. Switch between variants using the story selector
4. Use the "Docs" tab for auto-generated documentation

### Testing Accessibility

The `@storybook/addon-a11y` addon automatically checks for accessibility issues. View the "Accessibility" panel in Storybook to see violations and recommendations.

### Sample Data

All stories use realistic sample data that matches the Payload CMS configuration. Media URLs use Unsplash images as placeholders.

## Adding New Stories

When adding a new Payload block:

1. Create the block in `payload/blocks/YourBlock/`
2. Add a `YourBlock.stories.tsx` file in the same directory
3. Import the component from `Component.tsx`
4. Define the meta configuration
5. Create multiple story variants (Default, variations)
6. Include sample data matching the block's config

The new story will automatically be picked up by Storybook.

## Troubleshooting

### Storybook won't start

- Check for TypeScript errors in story files
- Ensure all imports are correct
- Verify component exports match story imports

### Component not rendering

- Check that sample data matches the TypeScript types
- Verify required props are provided
- Check browser console for errors

### Styles not loading

- Ensure `globals.css` is imported in `.storybook/preview.ts`
- Check that Tailwind CSS is properly configured
- Verify custom CSS classes are defined

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
