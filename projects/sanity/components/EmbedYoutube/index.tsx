import ReactPlayer from 'react-player';

export function YouTubePreview(props: any) {
  const { title: url } = props;

  return <div>{typeof url === 'string' ? <ReactPlayer src={url} /> : <></>}</div>;
}
