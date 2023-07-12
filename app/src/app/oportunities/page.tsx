"use client";

import HawkMetadata from "@/components/head";
import InstagramEmbed from "react-instagram-embed";

const OportunitiesPage = () => {
  return (
    <>
      <HawkMetadata
        title="Opportunities"
        description="Available opportunities for the youth and all the people interested in the social ativities"
      />
      <div className="container-hawk mx-auto">
        <InstagramEmbed
          url="https://www.instagram.com/hawk.starsngo  "
          clientAccessToken="587514600199844|99a91438ea5d31ac83c5aba1c7b38e59"
          maxWidth={320}
          hideCaption={false}
          containerTagName="div"
          protocol=""
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
      </div>
    </>
  );
};

export default OportunitiesPage;
