import { TitleDescriptionBlock } from './Component';

const defaultComponent = {
  title: 'Text/TitleDescriptionBlock',
  component: TitleDescriptionBlock,
};

export default defaultComponent;

export const Default = () => (
  <TitleDescriptionBlock
    blockType='titleDescriptionBlock'
    title='Our Mission'
    description='We are dedicated to preserving and promoting cultural heritage through innovative programs and community engagement.'
  />
);

export const TitleOnly = () => (
  <TitleDescriptionBlock blockType='titleDescriptionBlock' title='Welcome to HawkStars' />
);

export const LongDescription = () => (
  <TitleDescriptionBlock
    blockType='titleDescriptionBlock'
    title='About Our Organization'
    description='Founded with a vision to bridge cultures and create meaningful connections, our organization has been at the forefront of cultural preservation for over two decades. We believe in the power of storytelling, art, and community to transform lives and build bridges across generations.'
  />
);
