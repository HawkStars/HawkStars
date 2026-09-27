'use client';

import { ComponentProps } from 'react';
import { LuMessageCircleQuestion } from 'react-icons/lu';
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import QuestionForm from './QuestionForm';

type QuestionDialogProps = ComponentProps<typeof QuestionForm> & {
  triggerLabel: string;
  title: string;
  description: string;
};

/** "Colocar dúvida sobre esta obra" button on the artwork page. */
export default function QuestionDialog({
  triggerLabel,
  title,
  description,
  ...formProps
}: QuestionDialogProps) {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button type='button' variant='art-outline' size='art' className='w-full'>
          <LuMessageCircleQuestion aria-hidden />
          {triggerLabel}
        </Button>
      </ModalTrigger>
      <ModalContent className='border-art-line bg-art-wall text-art-text [&>button]:text-art-text rounded-none sm:max-w-xl'>
        <ModalHeader>
          <ModalTitle className='font-art-serif text-2xl font-normal'>{title}</ModalTitle>
          <ModalDescription className='art-justify text-art-text-2'>{description}</ModalDescription>
        </ModalHeader>
        <QuestionForm {...formProps} />
      </ModalContent>
    </Modal>
  );
}
