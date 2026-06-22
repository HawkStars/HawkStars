import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const donations = [
  { id: 'INV001', donor: 'Maria Silva', method: 'Credit Card', amount: '€250.00' },
  { id: 'INV002', donor: 'João Costa', method: 'Bank Transfer', amount: '€150.00' },
  { id: 'INV003', donor: 'Ana Pereira', method: 'PayPal', amount: '€350.00' },
  { id: 'INV004', donor: 'Pedro Santos', method: 'Credit Card', amount: '€450.00' },
];

export const Default: Story = {
  render: () => (
    <Table className='w-[640px]'>
      <TableCaption>A list of recent donations.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Donor</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className='text-right'>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {donations.map((donation) => (
          <TableRow key={donation.id}>
            <TableCell className='font-medium'>{donation.id}</TableCell>
            <TableCell>{donation.donor}</TableCell>
            <TableCell>{donation.method}</TableCell>
            <TableCell className='text-right'>{donation.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Table className='w-[640px]'>
      <TableHeader>
        <TableRow>
          <TableHead>Donor</TableHead>
          <TableHead className='text-right'>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {donations.map((donation) => (
          <TableRow key={donation.id}>
            <TableCell>{donation.donor}</TableCell>
            <TableCell className='text-right'>{donation.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className='text-right'>€1,200.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const SelectedRow: Story = {
  render: () => (
    <Table className='w-[640px]'>
      <TableHeader>
        <TableRow>
          <TableHead>Donor</TableHead>
          <TableHead className='text-right'>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Maria Silva</TableCell>
          <TableCell className='text-right'>€250.00</TableCell>
        </TableRow>
        <TableRow data-state='selected'>
          <TableCell>João Costa</TableCell>
          <TableCell className='text-right'>€150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Ana Pereira</TableCell>
          <TableCell className='text-right'>€350.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
