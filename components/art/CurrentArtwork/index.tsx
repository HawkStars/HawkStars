import { allArtwork } from "@/app/[lng]/art/queries";
import { LanguageProps } from "@/components/types";
import { getServerTranslation } from "@/i18n";
import { client } from "@/lib/sanity/sanityClient";
import Link from "next/link";

const fetchLatestArtwork = async () => {
  const response = await client.fetch(allArtwork);
  return response
}


const CurrentArtwork = async ({ lng}: LanguageProps) => {
    const { t } = await getServerTranslation(lng, 'art');

    const latestArtwork = await fetchLatestArtwork();

    const artwork = latestArtwork[0] || undefined;
    return (
      <section className='mt-8'>
        <h2 className='lg:text-h1_semibold text-h2_bold text-green text-center max-lg:px-4'>{t("artwork")}</h2>
        <div className="flex justify-center lg:w-1/2 mx-auto flex-col mt-5 gap-2">
          <img src={artwork.image.url}/>
          <h3 className="lg:text-center text-h2__bold">{artwork.name}</h3>
          <Link href={`/${lng}/art/artwork/${artwork.slug.current}`} className="px-4 py-2 bg-green w-fit rounded-lg text-white lg:self-center">Ver Obra</Link>
        </div>
      </section>
    )
}

export default CurrentArtwork;