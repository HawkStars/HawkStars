import Link from 'next/link';

const FEATURED_GAMES = [
  { name: 'Valorant', tag: 'FPS', color: '#ff4655' },
  { name: 'League of Legends', tag: 'MOBA', color: '#c8aa6e' },
  { name: 'Rocket League', tag: 'Sports', color: '#0078f2' },
  { name: 'CS2', tag: 'FPS', color: '#de9b35' },
];

const STATS = [
  { value: '12+', label: 'Active Players' },
  { value: '3', label: 'Game Titles' },
  { value: '2025', label: 'Founded' },
  { value: 'Pinhel', label: 'Base' },
];

const GamingIndexPage = async () => {
  return (
    <div className='flex flex-col'>
      {/* Hero */}
      <section className='relative flex min-h-[70vh] flex-col items-center justify-center px-4 text-center'>
        <div className='flex flex-col items-center gap-6'>
          <span className='border-gaming-accent/20 bg-gaming-accent/10 text-gaming-accent rounded-full border px-4 py-1.5 text-xs font-medium tracking-widest uppercase'>
            Hawk Stars NGO Gaming Division
          </span>
          <h1 className='font-magistral max-w-4xl text-5xl leading-tight tracking-wider text-white uppercase md:text-7xl lg:text-8xl'>
            The <span className='gaming-glow text-gaming-accent'>Hawkis</span>
            <br />
            E-Sports Team
          </h1>
          <p className='text-gaming-text-muted max-w-xl text-lg leading-relaxed'>
            Competing, training, and building a community of gamers from the heart of Portugal. Part
            of The Global Village Project by Hawk Stars NGO.
          </p>
          <div className='mt-4 flex flex-wrap justify-center gap-4'>
            <Link
              href='#games'
              className='font-magistral gaming-gradient-border bg-gaming-surface text-gaming-accent hover:bg-gaming-surface-light rounded-lg px-8 py-3 text-sm tracking-wider uppercase transition-all duration-300'
            >
              Our Games
            </Link>
            <Link
              href='#about'
              className='border-gaming-border text-gaming-text hover:border-gaming-text-muted hover:bg-gaming-surface rounded-lg border bg-transparent px-8 py-3 text-sm font-medium transition-all duration-300'
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className='border-gaming-border bg-gaming-surface/50 border-y'>
        <div className='mx-auto grid max-w-5xl grid-cols-2 md:grid-cols-4'>
          {STATS.map((stat, _) => (
            <div
              key={stat.label}
              className='border-gaming-border flex flex-col items-center gap-1 px-6 py-8 [&:not(:last-child)]:border-r'
            >
              <span className='font-magistral text-gaming-accent text-3xl tracking-wider'>
                {stat.value}
              </span>
              <span className='text-gaming-text-muted text-xs tracking-widest uppercase'>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Games section */}
      <section id='games' className='mx-auto w-full max-w-7xl px-4 py-20 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='font-magistral text-3xl tracking-wider text-white uppercase md:text-4xl'>
            Our <span className='text-gaming-accent'>Games</span>
          </h2>
          <p className='text-gaming-text-muted mt-3'>Titles where The Hawkis compete and train</p>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {FEATURED_GAMES.map((game) => (
            <div
              key={game.name}
              className='gaming-card gaming-card-hover group flex flex-col items-center gap-4 p-8 text-center'
            >
              <div
                className='flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110'
                style={{ backgroundColor: `${game.color}20` }}
              >
                <span className='text-2xl font-bold' style={{ color: game.color }}>
                  {game.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className='font-magistral text-lg tracking-wide text-white'>{game.name}</h3>
                <span className='bg-gaming-surface-light text-gaming-text-muted mt-1 inline-block rounded-full px-3 py-0.5 text-xs'>
                  {game.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About / CTA */}
      <section id='about' className='border-gaming-border bg-gaming-surface/30 border-t py-20'>
        <div className='mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 text-center'>
          <h2 className='font-magistral text-3xl tracking-wider text-white uppercase md:text-4xl'>
            Gaming <span className='gaming-glow-purple text-gaming-accent-secondary'>Academy</span>
          </h2>
          <p className='text-gaming-text-muted max-w-2xl text-lg leading-relaxed'>
            The Hawkis Gaming Academy is part of Hawk Stars NGO&rsquo;s International Training
            Center in Pinhel. We provide structured training, mentoring, and competitive
            opportunities for aspiring e-sports players.
          </p>
          <div className='grid gap-4 sm:grid-cols-3'>
            {['Structured Coaching', 'Team Scrims', 'Tournament Entry'].map((item) => (
              <div key={item} className='gaming-card rounded-xl px-6 py-5'>
                <span className='text-gaming-text text-sm font-medium'>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GamingIndexPage;
