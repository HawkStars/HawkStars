import { ReactNode } from 'react';
import type { IconType } from 'react-icons';

type PaymentDetail = { label: string; value: string };

type PaymentMethodCardProps = {
  icon: IconType;
  title: string;
  description: ReactNode;
  details: PaymentDetail[];
};

/** A way to give outside the online form: icon, short explanation, account details to copy. */
const PaymentMethodCard = ({ icon: Icon, title, description, details }: PaymentMethodCardProps) => (
  <div className='card border-bege-dark flex flex-col gap-4 border p-6 lg:p-8'>
    <span className='bg-bege-dark text-green flex size-12 items-center justify-center rounded-full'>
      <Icon aria-hidden='true' className='size-6' />
    </span>
    <h3 className='text-h2_bold'>{title}</h3>
    <p className='text-body_regular leading-relaxed text-black/70'>{description}</p>
    <dl className='mt-auto flex flex-col gap-3'>
      {details.map(({ label, value }) => (
        <div key={label} className='bg-bege-light rounded-lg px-4 py-3'>
          <dt className='text-eyebrow text-black/50'>{label}</dt>
          {/* select-all: one tap/click selects the whole value for copying */}
          <dd className='mt-1 font-mono text-sm font-semibold break-all select-all'>{value}</dd>
        </div>
      ))}
    </dl>
  </div>
);

export default PaymentMethodCard;
