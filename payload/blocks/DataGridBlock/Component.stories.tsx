import { DataGridBlock } from './Component';

const defaultComponent = {
  title: 'Content/DataGridBlock',
  component: DataGridBlock,
};

export default defaultComponent;

export const Default = () => (
  <DataGridBlock
    blockType='dataGridBlock'
    title='Financial Overview'
    columnOneHeader='Area'
    columnTwoHeader='Meta'
    rows={[
      { id: '1', columnOne: 'Income', columnTwo: '50k' },
      { id: '2', columnOne: 'Profit Margin', columnTwo: '30%' },
      { id: '3', columnOne: 'Revenue Growth', columnTwo: '12%' },
      { id: '4', columnOne: 'Operating Costs', columnTwo: '€18,500' },
    ]}
  />
);

export const TeamStats = () => (
  <DataGridBlock
    blockType='dataGridBlock'
    title='Team Statistics'
    columnOneHeader='Department'
    columnTwoHeader='Members'
    rows={[
      { id: '1', columnOne: 'Engineering', columnTwo: '12' },
      { id: '2', columnOne: 'Design', columnTwo: '5' },
      { id: '3', columnOne: 'Marketing', columnTwo: '8' },
    ]}
  />
);

export const SingleRow = () => (
  <DataGridBlock
    blockType='dataGridBlock'
    title='Quick Fact'
    columnOneHeader='Metric'
    columnTwoHeader='Value'
    rows={[{ id: '1', columnOne: 'Total Contributions', columnTwo: '€125,000' }]}
  />
);
