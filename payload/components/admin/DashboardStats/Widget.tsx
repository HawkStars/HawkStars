'use client';

import React from 'react';

/**
 * Shared card shell for dashboard widgets. Gives every widget a consistent
 * header, border, and padding so the dashboard reads as a grid of panels.
 */
export const Widget: React.FC<{
  title: string;
  icon?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon, action, children, className }) => (
  <section
    className={`flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 ${className ?? ''}`}
  >
    <header className='flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-3 dark:border-gray-700'>
      <h3 className='flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-100'>
        {icon && <span aria-hidden>{icon}</span>}
        {title}
      </h3>
      {action}
    </header>
    <div className='flex-1 p-5'>{children}</div>
  </section>
);

export const StatCard: React.FC<{
  label: string;
  value: string | number;
  subtitle?: string;
  highlight?: boolean;
  icon?: string;
}> = ({ label, value, subtitle, highlight, icon }) => (
  <div
    className={`flex flex-col gap-2 rounded-lg border p-4 ${
      highlight
        ? 'border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20'
        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
    }`}
  >
    <span className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
      {icon && <span aria-hidden>{icon}</span>}
      {label}
    </span>
    <span
      className={`text-2xl font-semibold ${
        highlight ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'
      }`}
    >
      {value}
    </span>
    {subtitle && <span className='text-xs text-gray-500 dark:text-gray-500'>{subtitle}</span>}
  </div>
);

export const WidgetSpinner: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <div className='flex items-center gap-3 text-sm text-gray-500'>
    <div className='h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500' />
    {label}
  </div>
);
