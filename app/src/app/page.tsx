import Button from "@/components/utils/Button";
import Spinner from "@/components/utils/Spinner";

export default function Home() {
  return (
    <section className="mt-36 flex flex-col">
      <div className="flex gap-1">
        <div className="flex w-1/2 flex-col gap-2">
          <h6>
            A Hawk Stars <Spinner />
          </h6>
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
              <Button disabled={true} type={"button"}>
                Sê um membro
              </Button>
            </div>
          </div>
        </div>
        <div className=""></div>
      </div>
      <div></div>
    </section>
  );
}
