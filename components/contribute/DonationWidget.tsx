'use client';

import React, { useState } from 'react';

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

const STEPS = [
  { id: 1, label: 'Amount' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Confirm' },
  { id: 5, label: 'Done' },
];

export default function DonationWidget() {
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const activeAmount = selectedAmount || (customAmount ? Number(customAmount) : null);

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(val);
    setSelectedAmount(null);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Choose amount</h2>
        <div style={styles.stepIndicator}>
          <span style={styles.lockIcon}>
            <svg
              width='14'
              height='14'
              viewBox='0 0 24 24'
              fill='none'
              stroke='white'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
              <path d='M7 11V7a5 5 0 0 1 10 0v4' />
            </svg>
          </span>
          {STEPS.map((step, i) => (
            <span
              key={step.id}
              style={{
                ...styles.dot,
                backgroundColor: i < currentStep ? '#fff' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
          <button
            style={styles.nextArrow}
            onClick={() => {
              if (activeAmount && activeAmount > 0 && currentStep < 5) {
                setCurrentStep(currentStep + 1);
              }
            }}
            disabled={!activeAmount || activeAmount <= 0}
            aria-label='Next step'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='white'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <polyline points='9 18 15 12 9 6' />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {/* Description */}
        <p style={styles.description}>
          Your donation to <strong>HawkStars</strong> is crucial in supporting our mission to
          promote art, culture, and community projects. Every contribution makes a difference. Thank
          you for your generosity.
        </p>

        {/* Frequency Toggle */}
        <div style={styles.frequencyToggle}>
          <button
            onClick={() => setFrequency('one-time')}
            style={{
              ...styles.frequencyButton,
              ...(frequency === 'one-time' ? styles.frequencyActive : styles.frequencyInactive),
            }}
          >
            One-time
          </button>
          <button
            onClick={() => setFrequency('monthly')}
            style={{
              ...styles.frequencyButton,
              ...(frequency === 'monthly' ? styles.frequencyActive : styles.frequencyInactive),
            }}
          >
            Monthly
          </button>
        </div>

        {/* Preset Amounts */}
        <div style={styles.amountGrid}>
          {PRESET_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => handlePresetClick(amount)}
              style={{
                ...styles.amountButton,
                ...(selectedAmount === amount
                  ? styles.amountButtonActive
                  : styles.amountButtonInactive),
              }}
            >
              €{amount}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div style={styles.customAmountWrapper}>
          <span style={styles.currencySymbol}>€</span>
          <input
            type='text'
            placeholder='Custom Amount'
            value={customAmount}
            onChange={handleCustomChange}
            style={styles.customInput}
            aria-label='Custom donation amount'
          />
        </div>

        {/* Comment Toggle */}
        <div style={styles.commentSection}>
          <label style={styles.commentLabel}>
            <input
              type='checkbox'
              checked={showComment}
              onChange={(e) => setShowComment(e.target.checked)}
              style={styles.checkbox}
            />
            <span style={styles.commentText}>Write us a comment</span>
          </label>
          {showComment && (
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Your message (optional)'
              rows={3}
              style={styles.commentTextarea}
            />
          )}
        </div>

        {/* Donate Button */}
        <button
          style={{
            ...styles.donateButton,
            opacity: activeAmount && activeAmount > 0 ? 1 : 0.5,
            cursor: activeAmount && activeAmount > 0 ? 'pointer' : 'not-allowed',
          }}
          disabled={!activeAmount || activeAmount <= 0}
        >
          Donate{activeAmount ? ` €${activeAmount}` : ''}
          {frequency === 'monthly' ? ' / month' : ''}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    maxWidth: '420px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    background: '#fff',
  },
  header: {
    background: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)',
    padding: '18px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 600,
    margin: 0,
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  lockIcon: {
    marginRight: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
    display: 'inline-block',
  },
  nextArrow: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    marginLeft: '4px',
  },
  body: {
    padding: '24px 20px',
  },
  description: {
    fontSize: '15px',
    lineHeight: 1.6,
    color: '#333',
    textAlign: 'center' as const,
    margin: '0 0 24px 0',
  },
  frequencyToggle: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    borderRadius: '6px',
    overflow: 'hidden' as const,
    border: '1px solid #c0392b',
    width: 'fit-content',
    margin: '0 auto 20px auto',
  },
  frequencyButton: {
    padding: '8px 24px',
    fontSize: '14px',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  frequencyActive: {
    background: '#c0392b',
    color: '#fff',
  },
  frequencyInactive: {
    background: '#fff',
    color: '#c0392b',
  },
  amountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginBottom: '12px',
  },
  amountButton: {
    padding: '14px 0',
    fontSize: '16px',
    fontWeight: 500,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  amountButtonActive: {
    background: '#c0392b',
    color: '#fff',
    border: '2px solid #c0392b',
  },
  amountButtonInactive: {
    background: '#fff',
    color: '#333',
    border: '1px solid #ddd',
  },
  customAmountWrapper: {
    position: 'relative' as const,
    marginBottom: '16px',
  },
  currencySymbol: {
    position: 'absolute' as const,
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999',
    fontSize: '16px',
    fontWeight: 500,
  },
  customInput: {
    width: '100%',
    padding: '14px 14px 14px 32px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    color: '#333',
    transition: 'border-color 0.15s',
  },
  commentSection: {
    marginBottom: '20px',
  },
  commentLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#c0392b',
    cursor: 'pointer',
  },
  commentText: {
    fontSize: '14px',
    color: '#555',
  },
  commentTextarea: {
    width: '100%',
    marginTop: '10px',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  },
  donateButton: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)',
    border: 'none',
    borderRadius: '8px',
    transition: 'opacity 0.2s, transform 0.1s',
  },
};
