import { aboutObjectiveSections, missionObjectives } from "./config";
import Image from "next/image";
import { Metadata } from "next";
import Accordion from "@/components/accordion/Accordion";

export const metadata = {
  title: "Hawk Stars - About Us",
  description:
    "Hawk Stars objetives and values and main goals for the next years for the international community and local ativities",
} as Metadata;

const AboutPage = () => {
  return (
    <>
      <div className="container-hawk grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="mt-20 flex flex-col gap-5">
          <h1>A Hawk Stars tem como seus principais objetivos:</h1>
          <p className="font-body">
            {`Desenvolvimento de atividades sociais que promovam e contribuíam para o desenvolvimento social, cultural, artístico e da juventude, assim como a promoção da aprendizagem ao longo da vida, tais como: Promoção de projetos e atividades internacionais que visem a receção e integração de estrangeiros para o desenvolvimento de atividades de educação não-formal com e para o meio envolvente.`}
          </p>
        </div>
        <div className="grid-rows-7 mx-auto mt-10 grid grid-cols-2 lg:w-[500px]">
          <div className="row-span-3">
            <Image
              height={260}
              width={249}
              alt=""
              src="/about/hero/top-left.png"
            />
          </div>
          <div className="row-span-2">
            <Image
              height={150}
              width={249}
              alt=""
              src="/about/hero/top-right.png"
            />
          </div>
          <div className="row-span-4">
            <Image
              height={367}
              width={249}
              alt=""
              src="/about/hero/bottom-right.png"
            />
          </div>
          <div className="row-span-3">
            <Image
              height={260}
              width={249}
              alt=""
              src="/about/hero/bottom-left.png"
            />
          </div>
        </div>
      </div>
      <div className="container-hawk my-10 flex flex-col gap-5">
        <h2 className="flex justify-center text-center text-green">
          A Hawk Stars
        </h2>
        <h3 className="mx-auto flex justify-center text-center lg:w-3/5">{`A Hawk Stars compromete-se a desenvolver atividades com os seguintes fins e objetivos:`}</h3>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 ">
          {aboutObjectiveSections.map((section, index) => (
            <TaskComponent key={index} {...section} />
          ))}
        </div>
      </div>
      <div className="bg-bege-light p-4 lg:p-10">
        <div className="container-hawk relative grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Image
            className="absolute bottom-5 left-10 hidden lg:block"
            src="/about/mission/icon1.png"
            alt="icon1"
            height={38}
            width={38}
          />
          <Image
            className="absolute left-3 top-10 hidden lg:block"
            src="/about/mission/icon2.png"
            alt="icon2"
            height={53}
            width={53}
          />
          <Image
            className="absolute right-5 top-8 hidden lg:block"
            src="/about/mission/icon3.png"
            alt="icon3"
            height={100}
            width={100}
          />
          <div className="mx-auto lg:ml-auto">
            <Image
              src="/about/mission/img.png"
              height={697}
              width={446}
              alt="mission"
            />
          </div>
          <div className="flex flex-col gap-3">
            <h1>Nossa Missão</h1>
            {missionObjectives.map((missionOpt) => (
              <MissionTaskComponent
                text={missionOpt.text}
                index={missionOpt.id}
                key={missionOpt.id}
              />
            ))}
          </div>
        </div>
        <div className="container-hawk mt-10 flex flex-col gap-10">
          <Accordion
            title="Expansão"
            description="Desde a sua fundação que a Associação tem como propósito a expansão da sua actuação além fronteiras, replicando o seu modelo de actuação noutros países através de uma estratégia de internacionalização com os seus parceiros, de cooperação entre países e de intercâmbio de jovens e adultos através da transferência de conhecimento, fortalecendo o capital humano, a empregabilidade, a competitividade, a promoção do empreendorismo social e o desenvolvimento de competências sociais, tecnológicas e pessoais de todos os envolvidos. "
            defaultOpen={true}
          />
        </div>
      </div>
    </>
  );
};

type TaskComponentProps = {
  icon: string;
  title: string;
  description: string;
};
const TaskComponent = ({ icon, title, description }: TaskComponentProps) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-bege-light p-7">
      <div className="w-fit rounded-xl bg-bege-dark">
        <Image src={icon} height={40} width={40} alt="objetive icon" />
      </div>
      <h6 className="font-body-body">{title}</h6>
      <p className="font-body">{description}</p>
    </div>
  );
};

type MissionTaskComponentProps = {
  text: string;
  index: number;
};

const MissionTaskComponent = ({ text, index }: MissionTaskComponentProps) => {
  let formattedNumber = index.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  return (
    <div className="flex flex-col">
      <h2>{formattedNumber}.</h2>
      <p className="font-body">{text}</p>
    </div>
  );
};

export default AboutPage;
