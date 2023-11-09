"use client";
import InstagramEmbed from "react-instagram-embed";

const InstagramFeed = () => {
  return (
    <InstagramEmbed
      url="https://www.instagram.com/hawk.starsngo"
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
  );
};

export default InstagramFeed;
