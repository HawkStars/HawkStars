'use client';

import { useState, useMemo } from 'react';
import DonationHeader from './DonationHeader';
import AmountStep from './AmountStep';
import DetailsStep from './DetailsStep';
import PaymentStep from './PaymentStep';
import ConfirmStep from './ConfirmStep';
import DoneStep from './DoneStep';
import { DonationType, DonationState, STEPS, getActiveAmount } from './types';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

const STEP_TITLE_KEYS: Record<number, string> = {
  1: 'donation_widget.steps.choose_amount',
  2: 'donation_widget.steps.add_details',
  3: 'donation_widget.steps.payment_method',
  4: 'donation_widget.steps.confirm_donation',
  5: 'donation_widget.steps.thank_you',
};

export default function DonationWidget() {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'contribute');
  const [currentStep, setCurrentStep] = useState(1);
  const [frequency, setFrequency] = useState<DonationType>('one-time');
  const [amount, setAmount] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  const donationState: DonationState = useMemo(
    () => ({ frequency, amount, comment }),
    [frequency, amount, comment]
  );

  const activeAmount = getActiveAmount(donationState);
  const canAdvance = !!(activeAmount && activeAmount > 0 && currentStep < STEPS.length);

  const handleNextStep = () => {
    if (canAdvance) setCurrentStep((s) => s + 1);
  };

  const handleBackStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleDonationValue = (amount: number) => {
    setAmount(amount);
    handleNextStep();
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFrequency('one-time');
    setAmount(null);
    setComment('');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AmountStep
            frequency={frequency}
            selectedAmount={amount}
            onFrequencyChange={setFrequency}
            onHandleDonationValue={handleDonationValue}
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
        title={t(STEP_TITLE_KEYS[currentStep])}
        currentStep={currentStep}
        canAdvance={canAdvance}
        onNextStep={handleNextStep}
      />
      <div className='px-5 py-6'>{renderStep()}</div>
    </div>
  );
}
