import { format } from 'date-fns';
import RichText from '@/payload/components/RichText';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import Image from 'next/image';

interface BlogPostData {
  title: string;
  image: string;
  pubDate: Date;
  description?: string;
  content?: DefaultTypedEditorState;
}

const Post = ({ title, image, pubDate, description, content }: BlogPostData) => {
  return (
    <section className='py-32'>
      <div className='container mx-auto'>
        <div className='mx-auto flex max-w-5xl flex-col items-center gap-4 text-center'>
          <h1 className='max-w-3xl text-5xl font-semibold text-pretty md:text-6xl'>{title}</h1>
          {description && (
            <h3 className='text-muted-foreground max-w-3xl text-lg md:text-xl'>{description}</h3>
          )}
          <div className='flex items-center gap-3 text-sm md:text-base'>
            <span className='ml-1'>on {format(pubDate, 'MMMM d, yyyy')}</span>
          </div>

          <Image
            src={image}
            alt='placeholder'
            className='mt-4 mb-8 aspect-video w-full rounded-lg border object-cover'
          />
        </div>
      </div>
      {content && <RichText data={content} />}
    </section>
  );
};

export default Post;
