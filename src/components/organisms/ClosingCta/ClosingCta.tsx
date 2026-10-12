import { Link } from '@tanstack/react-router';

import { BlueprintFrame, Container, Eyebrow, Reveal, buttonVariants } from '@/components/atoms';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';

import { AgentSystemDiagram } from '../AgentSystemDiagram';

export function ClosingCta() {
  const locale = useLocale();
  const messages = useMessages();
  const { body, diagram, eyebrow, title } = messages.home.cta;

  return (
    <section className="py-24 sm:py-32">
      <Container size="narrow">
        <Reveal className="text-center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-5 font-display text-4xl leading-[1.08] font-medium tracking-[-0.03em] text-balance text-neutral-950 sm:text-6xl dark:text-neutral-50">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-serif text-xl leading-relaxed text-neutral-600 dark:text-neutral-300">
            {body}
          </p>
        </Reveal>
      </Container>

      <Container className="mt-14 sm:mt-20">
        <Reveal>
          <BlueprintFrame className="border-brand-950 dark:border-brand-950">
            <figure className="bp-panel px-5 py-10 sm:px-10 sm:py-14">
              <h3 className="mx-auto max-w-3xl text-center font-display text-3xl leading-[1.12] font-medium tracking-[-0.02em] text-balance sm:text-4xl">
                {diagram.headline}
              </h3>
              <div className="mt-10 overflow-x-auto">
                <AgentSystemDiagram labels={diagram} />
              </div>
              <ul className="mt-10 grid gap-8 border-t border-white/20 pt-8 md:grid-cols-3">
                {diagram.takeaways.map((item) => (
                  <li key={item.title}>
                    <p className="font-display text-xl font-medium text-accent-300">{item.title}</p>
                    <p className="mt-2 font-serif text-base leading-relaxed text-neutral-300">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
              <figcaption className="mt-8 font-mono text-[0.68rem] tracking-[0.14em] text-neutral-400 uppercase">
                {messages.blueprint.figure} 02 — {diagram.caption}
              </figcaption>
            </figure>
          </BlueprintFrame>
        </Reveal>
        <div className="mt-12 flex justify-center">
          <Link className={buttonVariants({ size: 'lg' })} params={{ locale }} to="/$locale/docs">
            {messages.home.start}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
