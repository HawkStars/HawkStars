import { CURRENT_PARTNERS, PartnersInfo } from "./config";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const PartnersPage = () => {
  const nationalPartners = CURRENT_PARTNERS.filter(
    (partner) => partner.type == "national"
  );

  const internationalPartners = CURRENT_PARTNERS.filter(
    (partner) => partner.type == "international"
  );

  return (
    <section>
      <div>
        <Image
          src="/partners/hero.jpg"
          alt="Hero Partners Page"
          height={400}
          width={1920}
          style={{ objectFit: "cover" }}
        />
      </div>
      <section className="container-hawk">
        <div className="mt-10">
          <h1 className="mb-5 text-center">Parceiros</h1>
          {nationalPartners.map((partner, index) => (
            <PartnerCard {...partner} key={index} />
          ))}
        </div>
        <div className="mt-10">
          <h1 className="mb-5 text-center">Cooperação Internacional</h1>
          {internationalPartners.map((partner, index) => (
            <PartnerCard {...partner} key={index} />
          ))}
        </div>
      </section>
    </section>
  );
};

const PartnerCard = ({
  title,
  image,
  description,
  contacts,
  country = undefined,
}: PartnersInfo): JSX.Element => {
  const renderers = {
    p: (props: any) => <p className="my-2 break-words">{props.children}</p>,
    h1: (props: any) => <h1 className="text-primary-500">{props.children}</h1>,
  };

  return (
    <div className="my-20 flex flex-col gap-5">
      {/* Country If exists*/}
      {country && (
        <h6 className="w-fit rounded-xl border-2 border-green p-1 font-black text-green">
          {country}
        </h6>
      )}
      {/* Title */}
      <h2>{title}</h2>

      {/* Image */}
      <div className="relative h-36 max-w-xs">
        <Image
          src={image}
          alt={`${title} logo`}
          fill={true}
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Description */}
      <div>
        <ReactMarkdown components={renderers}>{description}</ReactMarkdown>
      </div>

      {/* Contacts */}
      {contacts && contacts.length > 0 && (
        <div className="flex gap-3">
          <h6 className="font-body-bold">Contacts:</h6>
          {contacts.map((contact, index) => (
            <div key={index}>
              <Link href={contact.url} className="underline">
                ICON
              </Link>
            </div>
          ))}
        </div>
      )}
      <div className="mt-5 h-5 bg-bege-light"></div>
    </div>
  );
};

export default PartnersPage;
