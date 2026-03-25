'use client';

import { useState, useMemo } from 'react';
import DonationHeader from './DonationHeader';
import AmountStep from './AmountStep';
import DetailsStep from './DetailsStep';
import PaymentStep from './PaymentStep';
import ConfirmStep from './ConfirmStep';
import DoneStep from './DoneStep';
import { DonationType, DonationState, STEPS, getActiveAmount, PaymentMethodOption } from './types';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneIndicative, setPhoneIndicative] = useState('+351');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<Record<string, unknown> | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const donationState: DonationState = useMemo(
    () => ({
      frequency,
      amount,
      comment,
      name,
      email,
      phone_number: phoneNumber,
      phone_indicative: phoneIndicative,
      paymentMethod,
    }),
    [frequency, amount, comment, name, email, phoneNumber, phoneIndicative, paymentMethod]
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
    setName('');
    setEmail('');
    setPhoneNumber('');
    setPhoneIndicative('+351');
    setPaymentMethod(null);
    setIsSubmitting(false);
    setPaymentResponse(null);
    setSubmitError(null);
  };

  const handleConfirm = async () => {
    if (!activeAmount || !paymentMethod || !name || !email) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const isSubscription = frequency === 'monthly';
      const endpoint = isSubscription ? '/api/subscription' : '/api/donate';

      const payload: Record<string, unknown> = {
        value: activeAmount,
        name,
        email,
        currency: 'EUR',
        reason: comment || undefined,
        phone_number: phoneNumber || undefined,
        phone_indicative: phoneIndicative || undefined,
      };

      if (isSubscription) {
        payload.frequency = '1M';
        payload.capture_now = true;
        payload.unlimited_payments = true;
      } else {
        payload.paymentType = paymentMethod;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      setPaymentResponse(data);
      setCurrentStep(5);
    } catch (error) {
      console.error('Payment error:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
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
            name={name}
            email={email}
            phoneNumber={phoneNumber}
            phoneIndicative={phoneIndicative}
            comment={comment}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPhoneNumberChange={setPhoneNumber}
            onPhoneIndicativeChange={setPhoneIndicative}
            onCommentChange={setComment}
            onBack={handleBackStep}
            onNext={handleNextStep}
          />
        );
      case 3:
        return (
          <PaymentStep
            frequency={frequency}
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
            onBack={handleBackStep}
            onNext={handleNextStep}
          />
        );
      case 4:
        return (
          <ConfirmStep
            donationState={donationState}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onBack={handleBackStep}
            onConfirm={handleConfirm}
          />
        );
      case 5:
        return (
          <DoneStep
            donationState={donationState}
            paymentResponse={paymentResponse}
            onReset={handleReset}
          />
        );
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
