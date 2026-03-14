'use client';

import { useState, useMemo } from 'react';
import DonationHeader from './DonationHeader';
import AmountStep from './AmountStep';
import DetailsStep from './DetailsStep';
import PaymentStep from './PaymentStep';
import ConfirmStep from './ConfirmStep';
import DoneStep from './DoneStep';
import { DonationType, DonationState, STEPS, getActiveAmount } from './types';

const STEP_TITLES: Record<number, string> = {
  1: 'Choose amount',
  2: 'Add details',
  3: 'Payment method',
  4: 'Confirm donation',
  5: 'Thank you!',
};

export default function DonationWidget() {
  const [currentStep, setCurrentStep] = useState(1);
  const [frequency, setFrequency] = useState<DonationType>('one-time');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [comment, setComment] = useState('');

  const donationState: DonationState = useMemo(
    () => ({ frequency, selectedAmount, customAmount, comment }),
    [frequency, selectedAmount, customAmount, comment]
  );

  const activeAmount = getActiveAmount(donationState);
  const canAdvance = !!(activeAmount && activeAmount > 0 && currentStep < STEPS.length);

  const handleNextStep = () => {
    if (canAdvance) setCurrentStep((s) => s + 1);
  };

  const handleBackStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFrequency('one-time');
    setSelectedAmount(null);
    setCustomAmount('');
    setComment('');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AmountStep
            frequency={frequency}
            selectedAmount={selectedAmount}
            customAmount={customAmount}
            onFrequencyChange={setFrequency}
            onPresetClick={handlePresetClick}
            onCustomAmountChange={handleCustomAmountChange}
          />
        );
      case 2:
        return (
          <DetailsStep
            comment={comment}
            onCommentChange={setComment}
            onBack={handleBackStep}
            onNext={handleNextStep}
          />
        );
      case 3:
        return <PaymentStep onBack={handleBackStep} onNext={handleNextStep} />;
      case 4:
        return (
          <ConfirmStep
            donationState={donationState}
            onBack={handleBackStep}
            onConfirm={handleNextStep}
          />
        );
      case 5:
        return <DoneStep donationState={donationState} onReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <div className='w-full max-w-105 overflow-hidden rounded-xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.12)]'>
      <DonationHeader
        title={STEP_TITLES[currentStep]}
        currentStep={currentStep}
        canAdvance={canAdvance}
        onNextStep={handleNextStep}
      />
      <div className='px-5 py-6'>{renderStep()}</div>
    </div>
  );
}
