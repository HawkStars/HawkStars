import { allCuratorsQuery } from "@/app/[lng]/art/queries";
import { LanguageProps } from "@/components/types";
import { client } from "@/lib/sanity/sanityClient";

const getCurators = async () => {
    const response = await client.fetch(allCuratorsQuery);
    return response
}

const Curators = async ({lng}: LanguageProps) => {
    const allCurators = await getCurators();

    return <>
        <section className="grid grid-cols-2">
            {allCurators.map((curator) => {
                debugger
                return <div></div>
            })}
        </section>
        </>
}

export default Curators;