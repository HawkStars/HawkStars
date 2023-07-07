import { CURRENT_PARTNERS, PartnersInfo } from "./config";
import Image from "next/image";
import Link from "next/link";

const PartnersPage = () => {
  const nationalPartners = CURRENT_PARTNERS.filter(
    (partner) => partner.type == "national"
  );

  const internationalPartners = CURRENT_PARTNERS.filter(
    (partner) => partner.type == "international"
  );

  return (
    <section>
      <div className="relative lg:h-96">
        <Image fill={true} src="/partners/hero.jpg" alt="Hero Partners Page" />
      </div>
      <div className="mt-10">
        <h1 className="text-center">Parceiros</h1>
        {nationalPartners.map((partner, index) => (
          <PartnerCard {...partner} key={index} />
        ))}
      </div>
      <div className="h-5 bg-bege-light"></div>
      <div className="mt-10">
        <h1></h1>
        {internationalPartners.map((partner, index) => (
          <PartnerCard {...partner} key={index} />
        ))}
      </div>
    </section>
  );
};

const PartnerCard = ({
  title,
  image,
  description,
  contacts,
}: PartnersInfo): JSX.Element => {
  return (
    <div className="flex flex-col gap-1">
      {/* Title */}
      <h3>{title}</h3>
      {/* Image */}
      <div>
        <Image src={image} alt={`${title} logo`} width={96} height={96} />
      </div>
      {/* Description */}
      <div>{description}</div>

      <div className="flex gap-3">
        <h3>Contacts:</h3>
        {contacts.map((contact, index) => (
          <div key={index}>
            <Link href={contact.url} className="underline">
              ADD icon here
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersPage;
