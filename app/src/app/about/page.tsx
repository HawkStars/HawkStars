import { aboutObjectiveSections } from "./config";
import Image from "next/image";

const AboutPage = () => {
  return (
    <>
      <div className="container-hawk grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="mt-10 flex flex-col gap-5">
          <h1>A Hawk Stars tem como seus principais objetivos:</h1>
          <p className="font-body">
            {`Desenvolvimento de atividades sociais que promovam e contribuíam para o desenvolvimento social, cultural, artístico e da juventude, assim como a promoção da aprendizagem ao longo da vida, tais como: Promoção de projetos e atividades internacionais que visem a receção e integração de estrangeiros para o desenvolvimento de atividades de educação não-formal com e para o meio envolvente.`}
          </p>
        </div>
        <div className="grid-rows-7 mt-10 grid w-[500px] grid-cols-2">
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
    <div className="flex flex-col gap-2 rounded-xl bg-bege-light p-3">
      <div className="w-fit rounded-xl bg-bege-dark">
        <Image src={icon} height={40} width={40} alt="objetive icon" />
      </div>
      <h6 className="font-body-body">{title}</h6>
      <p className="font-body">{description}</p>
    </div>
  );
};

export default AboutPage;
