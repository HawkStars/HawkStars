import YouTubePlayer from 'react-player/youtube';

export function YouTubePreview(props: any) {
  const { title: url } = props;

  return <div>{typeof url === 'string' ? <YouTubePlayer url={url} /> : <></>}</div>;
}
