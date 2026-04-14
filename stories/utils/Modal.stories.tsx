import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';

const meta: Meta = {
  title: 'Utils/Modal',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant='outline'>Open Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Modal Title</ModalTitle>
          <ModalDescription>
            This is a description of the modal content. It provides context for the user.
          </ModalDescription>
        </ModalHeader>
        <p className='text-sm'>Your modal content goes here.</p>
        <ModalFooter>
          <Button variant='outline'>Cancel</Button>
          <Button>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const VideoModal: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>▶ Watch Video</Button>
      </ModalTrigger>
      <ModalContent className='overflow-hidden p-0 sm:max-w-3xl'>
        <ModalHeader className='sr-only'>
          <ModalTitle>Video Player</ModalTitle>
          <ModalDescription>Embedded video content</ModalDescription>
        </ModalHeader>
        <div className='relative w-full' style={{ paddingBottom: '56.25%' }}>
          <iframe
            src='https://www.youtube.com/embed/dQw4w9WgXcQ'
            className='absolute top-0 left-0 h-full w-full rounded-xl'
            allow='autoplay; fullscreen; picture-in-picture'
            allowFullScreen
            title='Video Player'
          />
        </div>
      </ModalContent>
    </Modal>
  ),
};

export const WithThumbnailTrigger: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <button
          aria-label='Play video'
          className='group relative w-80 overflow-hidden rounded-xl border shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
        >
          <div className='relative aspect-video bg-neutral-900'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='flex size-16 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform group-hover:scale-110'>
                <span className='ml-1 text-2xl'>▶</span>
              </div>
            </div>
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
            <p className='absolute bottom-3 left-3 text-sm font-medium text-white'>
              HawkStars Highlights
            </p>
          </div>
        </button>
      </ModalTrigger>
      <ModalContent className='overflow-hidden p-0 sm:max-w-3xl'>
        <ModalHeader className='sr-only'>
          <ModalTitle>HawkStars Highlights</ModalTitle>
          <ModalDescription>Video player for HawkStars Highlights</ModalDescription>
        </ModalHeader>
        <div className='relative w-full' style={{ paddingBottom: '56.25%' }}>
          <iframe
            src='https://www.youtube.com/embed/dQw4w9WgXcQ'
            className='absolute top-0 left-0 h-full w-full rounded-xl'
            allow='autoplay; fullscreen; picture-in-picture'
            allowFullScreen
            title='HawkStars Highlights'
          />
        </div>
      </ModalContent>
    </Modal>
  ),
};

function ControlledModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex flex-col items-center gap-4'>
      <Button onClick={() => setOpen(true)}>Open Controlled Modal</Button>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Controlled Modal</ModalTitle>
            <ModalDescription>
              This modal is controlled via external state. You can open and close it
              programmatically.
            </ModalDescription>
          </ModalHeader>
          <p className='text-sm'>The modal is currently open.</p>
          <ModalFooter>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledModalExample />,
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant='outline'>Open (no close button)</Button>
      </ModalTrigger>
      <ModalContent showCloseButton={false}>
        <ModalHeader>
          <ModalTitle>No Close Button</ModalTitle>
          <ModalDescription>
            This modal hides the default close button. Close it via the footer action or by pressing
            Escape.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button>Done</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};
