import { aboutObjectiveSections } from "./config";
import Image from "next/image";

const AboutPage = () => {
  return (
    <>
      <div className="m-7 flex flex-col gap-3">
        <h6 className="mt-3 flex justify-center text-3xl">Quem Somos?</h6>
        <p className="mt-3">
          {`A HAWK STARS – Associação para Educação, Inovação e Desenvolvimento
          Social é um grupo intergeracional cujo os seus membros são
          interessados no desenvolvimento social e humano tendo por base um
          trabalho na área da educação com a inovação a que os novos tempos
          obrigam, aberta a todos, e projetada do local para o global.`}
        </p>
        <p>
          {`A Hawk Stars tem como seus principais objetivos o desenvolvimento de
          atividades sociais que promovam e contribuíam para o desenvolvimento
          social, cultural, artístico e da juventude, assim como a promoção da
          aprendizagem ao longo da vida, tais como: Promoção de projetos e
          atividades internacionais que visem a receção e integração de
          estrangeiros para o desenvolvimento de atividades de educação
          não-formal com e para o meio envolvente.`}
        </p>
      </div>
      <div className="container-hawk mb-10 flex flex-col gap-5">
        <h2 className="flex justify-center text-center text-green">
          A Hawk Stars
        </h2>
        <h3 className="flex justify-center text-center">{`A Hawk Stars compromete-se a desenvolver atividades com os seguintes fins e objetivos:`}</h3>
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
    <div className="flex flex-col gap-1 rounded-xl bg-bege-light p-3">
      <div className="w-fit rounded-xl bg-bege-dark">
        <Image src={icon} height={32} width={32} alt="objetive icon" />
      </div>
      <h6 className="font-body-body">{title}</h6>
      <p className="font-body">{description}</p>
    </div>
  );
};

export default AboutPage;
