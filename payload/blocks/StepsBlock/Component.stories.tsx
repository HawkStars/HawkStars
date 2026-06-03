import StepsBlockComponent from './Component';
import { StepsBlockItem } from '@/payload-types';

const sampleSteps: StepsBlockItem = [
  {
    id: '1',
    title: 'Apply',
    description:
      'Fill out the application form and tell us about yourself and your motivation to join.',
  },
  {
    id: '2',
    title: 'Interview',
    description: 'Meet our team for a short conversation to get to know each other better.',
  },
  {
    id: '3',
    title: 'Onboarding',
    description: 'Complete the introduction sessions and get set up with everything you need.',
  },
  {
    id: '4',
    title: 'Get Involved',
    description: 'Start contributing to our projects and become part of the community.',
  },
];

const defaultComponent = {
  title: 'Blocks/Steps',
  component: StepsBlockComponent,
};

export default defaultComponent;

export const Default = () => (
  <StepsBlockComponent
    blockType='stepsBlock'
    numberOfColumnsPerRow='4'
    dotColor='blue'
    steps={sampleSteps}
  />
);

export const TwoColumns = () => (
  <StepsBlockComponent
    blockType='stepsBlock'
    numberOfColumnsPerRow='2'
    dotColor='blue'
    steps={sampleSteps}
  />
);

export const ThreeColumns = () => (
  <StepsBlockComponent
    blockType='stepsBlock'
    numberOfColumnsPerRow='3'
    dotColor='green'
    steps={sampleSteps.slice(0, 3)}
  />
);

export const FiveColumns = () => (
  <StepsBlockComponent
    blockType='stepsBlock'
    numberOfColumnsPerRow='5'
    dotColor='red'
    steps={[
      ...sampleSteps,
      {
        id: '5',
        title: 'Grow',
        description: 'Take on new responsibilities and help shape the future of the organization.',
      },
    ]}
  />
);

export const RedDots = () => (
  <StepsBlockComponent
    blockType='stepsBlock'
    numberOfColumnsPerRow='4'
    dotColor='red'
    steps={sampleSteps}
  />
);

export const GreenDots = () => (
  <StepsBlockComponent
    blockType='stepsBlock'
    numberOfColumnsPerRow='4'
    dotColor='green'
    steps={sampleSteps}
  />
);

export const YellowDots = () => (
  <StepsBlockComponent
    blockType='stepsBlock'
    numberOfColumnsPerRow='4'
    dotColor='yellow'
    steps={sampleSteps}
  />
);

export const SingleStep = () => (
  <StepsBlockComponent
    blockType='stepsBlock'
    numberOfColumnsPerRow='2'
    dotColor='blue'
    steps={[
      {
        id: '1',
        title: 'Get Started',
        description: 'Reach out to us and we will guide you through the entire process.',
      },
    ]}
  />
);
