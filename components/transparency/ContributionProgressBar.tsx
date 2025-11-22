const ContributionProgressBar = ({
  sumContributions,
  projectGoal,
}: {
  sumContributions: number;
  projectGoal: number;
}) => {
  const normalizedGoal = (sumContributions || 0) / projectGoal;
  const goalAsPercentage = (normalizedGoal * 100).toFixed(2);
  const loadingWidth = Math.round((window?.innerWidth || 0) * normalizedGoal) + 'px';

  return (
    <div className='border-green relative mt-5 h-6 w-full rounded-xs border'>
      <div
        className={`from-bege-dark to-bege-light h-full bg-linear-to-r from-10% to-95%`}
        style={{ width: loadingWidth }}
      >
        <p className='absolute my-auto flex w-full justify-center'>
          {sumContributions}€ ({goalAsPercentage}%)
        </p>
      </div>
    </div>
  );
};

export default ContributionProgressBar;
