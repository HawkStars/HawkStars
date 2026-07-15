import HelpButton from '@/payload/components/admin/common/HelpButton';

const CROWDFUNDING_SETTINGS_INFO_URL =
  'https://app.notion.com/p/Configura-es-Crowdfunding-Crowdfunding-Settings-35f8c9342867800ebcd1e09288294ced?source=copy_link';

const ShowCrowdfundingSettingsInfo: React.FC = () => {
  return <HelpButton url={CROWDFUNDING_SETTINGS_INFO_URL} />;
};

export default ShowCrowdfundingSettingsInfo;
