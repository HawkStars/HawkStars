import YouTubePlayer from 'react-player/youtube';

export function YouTubePreview(props: PreviewProps) {
  const { title: url } = props;

  return <div>{typeof url === 'string' ? <YouTubePlayer url={url} /> : <span>{props}</span>}</div>;
}
