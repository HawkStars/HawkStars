import LineBreaker from '@/components/utils/LineBreaker/LineBreaker';
import { LiaUsersSolid, LiaUserSolid } from 'react-icons/lia';

const DonatePage = ({ params: { lng } }: { params: { lng: string } }) => {
  return (
    <div className='container-hawk mx-auto mt-10 flex flex-col gap-5'>
      <h1 className='text-green'>Contribute to the project and the NGO</h1>

      <h2>TALVEZ LADO A LADO OU UM DE BAIXO DO OUTRO??</h2>
      <div className='flex flex-col gap-3'>
        <h3>Bank Transfer</h3>
        <p>
          Os doadores podem efetuar transferência bancária, escolhendo a
          modalidade de apoio desejada. A Hawk Stars NGO emitirá uma
          fatura/recibo de doação para todos os valores, com ou sem benefício de
          mérito, seguindo os requisitos legais para possível benefício fiscal,
          de acordo com o Decreto-Lei n.º 215/89 e legislação complementar.
        </p>
      </div>
      <div className='flex flex-col gap-2'>
        <h3>Crypto Transfer</h3>
        <p>
          os doadores em crypto moeda serão considerados para benefício de
          mérito ao doar em Bitcoin (BTC), Ethereum (ETH) – se atenderem ao
          valor mínimo -, ou em stablecoins como Tether (USDT), USD Coin (USDC),
          Euro Coin (EUROC) e Binance Dollar (BUSD). Para garantir o benefício
          de mérito, o doador deve preencher um formulário comprovando a
          transferência. Após a conversão para moeda fiduciária, a Hawk Stars
          emitirá uma fatura/recibo de doação, que o doador pode reclamar em
          crypto por meio do formulário correspondente.
        </p>

        <a href='here'>
          Form to donate does not depend on the type. maybe the text to be
          removed
        </a>
      </div>

      <div className='flex flex-col gap-3'>
        <h1 className='text-green'>
          OTHER FORMS - RELATED TO THE TRAINING CENTER
        </h1>
        <div className='flex flex-col gap-3'>
          <h3>TRAINING COURSE BUILDING BRANDING</h3>
          <h4>from 380000€</h4>
          <p>
            Parcerias financeiras do Naming do Internacional Training Center –
            negociável (Por exemplo - International Training Center;
          </p>
        </div>
        <LineBreaker />
        <div className='flex flex-col gap-3'>
          <h3>TRAINING COURSE ROOM BRANDING</h3>
          <h4>from 15000€</h4>
          <p>
            Parcerias financeiras de Naming Room para Salas de Formação,
            Reuniões, Co-working, Lounge, Gaming Hub, Estúdio de Gravação
          </p>
        </div>
        <LineBreaker />
        <div className='flex flex-col gap-10'>
          <h3>NOME NA PAREDE</h3>
          <div className='flex flex-row justify-around gap-4'>
            <div className='flex flex-col gap-2'>
              <h2>500€ Solo</h2>
              <LiaUserSolid size={62} className='mx-auto' />
            </div>
            <div className='flex flex-col gap-2'>
              <h2>1800€ Community/Company</h2>
              <LiaUsersSolid size={62} className='mx-auto' />
            </div>
          </div>
        </div>
        <LineBreaker />
        <div className='flex flex-col gap-3'></div>
      </div>
    </div>
  );
};

export default DonatePage;
