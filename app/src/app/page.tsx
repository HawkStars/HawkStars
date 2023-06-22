import Avatar from "@/components/utils/Avatar";
import Button from "@/components/utils/Button";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className="flex flex-col bg-bege-light px-8 pb-5 pt-10 lg:px-14 lg:pb-10 lg:pl-20 lg:pt-40">
        <div className="flex flex-col gap-1 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-1/2">
            <h4 className="text-4xl font-black">
              Associação para Educação, Inovação e Desenvolvimento Social.
            </h4>
            <p className="text-justify">
              Grupo intergeracional cujo os seus membros são interessados no
              desenvolvimento social e humano tendo por base um trabalho na área
              da educação com a inovação a que os novos tempos obrigam, aberta a
              todos, e projetada do local para o global.
            </p>
            <div className="mt-8 flex gap-5">
              <div className="w-fit">
                <Button disabled={true} type={"button"}>
                  Doações
                </Button>
              </div>
              <div className="w-fit">
                <Button outline={true} type={"button"}>
                  Sê um membro
                </Button>
              </div>
            </div>
          </div>
          <div className="relative h-96 w-full py-20 lg:w-1/2 lg:py-0">
            <div className="absolute right-60 top-5 lg:right-32 lg:top-4">
              <Avatar url={"/frontpage/banner_2.png"} size="large" />
            </div>
            <div className="absolute left-10 top-8 lg:left-20 lg:top-8">
              <Avatar url={"/frontpage/banner_3.png"} size="large" />
            </div>
            <div className="absolute bottom-2 left-40 lg:bottom-10 lg:left-72">
              <Avatar url={"/frontpage/banner_4.png"} size="large" />
            </div>
            <div className="absolute bottom-0 right-8 lg:bottom-2 lg:right-5">
              <Avatar url={"/frontpage/banner_5.png"} size="large" />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mt-5 flex flex-col gap-10 px-8 pb-10 lg:mt-20 lg:flex-row-reverse lg:px-14 lg:pl-20">
          <div className="flex flex-col gap-2 lg:w-1/2">
            <h4 className="text-2xl font-black text-success">Quem somos</h4>
            <h4 className="text-xl font-black">
              A Hawk Stars tem como seus principais objetivos:
            </h4>
            <p className="text-justify">
              Desenvolvimento de atividades sociais que promovam e contribuíam
              para o desenvolvimento social, cultural, artístico e da juventude,
              assim como a promoção da aprendizagem ao longo da vida, tais como:
              Promoção de projetos e atividades internacionais que visem a
              receção e integração de estrangeiros para o desenvolvimento de
              atividades de educação não-formal com e para o meio envolvente.
            </p>
          </div>
          <div className="relative h-96 w-full lg:w-1/2">
            <Image
              src="/frontpage/quem_somos.png"
              alt="quem_somos"
              fill={true}
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
