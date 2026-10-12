import { BlueprintFrame, Container, Eyebrow, Reveal } from '@/components/atoms';
import { useMessages } from '@/lib/i18n/use-messages';

const icons = [
  <path key="clarity" d="M4 20 20 4M7 4h13v13M4 14v6h6" />,
  <path
    key="diagram"
    d="M5 7a2 2 0 1 0 0-.01M19 7a2 2 0 1 0 0-.01M12 19a2 2 0 1 0 0-.01M7 7h10M6.5 8.5l4.5 9M17.5 8.5l-4.5 9"
  />,
  <path
    key="reading"
    d="M4 5.5C6 4 9 4 12 6c3-2 6-2 8-.5V19c-2-1.5-5-1.5-8 .5-3-2-6-2-8-.5V5.5ZM12 6v13.5"
  />,
];

export function PrinciplesBand() {
  const messages = useMessages();
  const { items, title } = messages.home.principles;

  return (
    <Container className="pt-24 sm:pt-32">
      <BlueprintFrame className="border-brand-950 dark:border-brand-950">
        <section className="bp-panel px-6 py-14 sm:px-12 sm:py-20">
          <Reveal>
            <Eyebrow className="text-accent-300">{messages.home.eyebrow}</Eyebrow>
            <h2 className="mt-5 max-w-2xl font-display text-4xl leading-[1.1] font-medium tracking-[-0.025em] text-balance sm:text-5xl">
              {title}
            </h2>
          </Reveal>
          <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {items.map((item, index) => (
              <li key={item.title}>
                <Reveal delay={index * 140}>
                  <span className="flex h-12 w-12 items-center justify-center border border-white/30 text-accent-300">
                    <svg
                      aria-hidden="true"
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.4"
                      viewBox="0 0 24 24"
                    >
                      {icons[index]}
                    </svg>
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-medium tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-serif text-lg leading-relaxed text-neutral-300">
                    {item.body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      </BlueprintFrame>
    </Container>
  );
}
