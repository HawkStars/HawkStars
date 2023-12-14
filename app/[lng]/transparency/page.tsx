import OrganizationContributionsTable from '@/components/transparency/OrganizationContributionsTable';
import OrganizationMovementsTable from '@/components/transparency/OrganizationMovementsTable';

const TransparencyPage = async () => {
  return (
    <section className='mx-10 mt-10 flex flex-col gap-5 lg:mx-14'>
      <div className='flex flex-col gap-1'>
        <h3>Current Project Contribution:</h3>
        <p className='flex justify-end'>Goal: 1.200.000,00€</p>
        <div className='relative h-6 w-full rounded-md border border-bege-dark'>
          <div className='h-full w-1/3 bg-gradient-to-r from-bege-dark from-10% to-bege-light to-90%'></div>
          <p className='absolute bottom-0 right-3 text-sm'></p>
        </div>
      </div>

      <div className='flex flex-col gap-10'>
        <OrganizationContributionsTable />
        <OrganizationMovementsTable />
      </div>
    </section>
  );
};

export default TransparencyPage;
