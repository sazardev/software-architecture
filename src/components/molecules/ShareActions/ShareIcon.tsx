const strokeIcons = {
  comment: 'M4 5h16v11H9l-5 4V5ZM8 9.5h8M8 12.5h5',
  copy: 'M8 8h11v12H8zM5 16V4h11',
  email: 'M3 6.5h18v11H3zM3 7l9 6.5L21 7',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  quote: 'M5 17V13a5 5 0 0 1 5-5M13 17v-4a5 5 0 0 1 5-5M5 13h4v4H5zM13 13h4v4h-4z',
  share: 'M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v7.5h14V12',
  top: 'M12 19V5M6 11l6-6 6 6',
} as const;

const fillIcons = {
  linkedin:
    'M4.98 3.5a2.5 2.5 0 1 1-.01 5 2.5 2.5 0 0 1 .01-5ZM3 9.75h4V21H3V9.75Zm6.75 0h3.83v1.54h.06c.53-1 1.84-2.07 3.79-2.07 4.05 0 4.8 2.67 4.8 6.14V21h-4v-5.05c0-1.2-.02-2.75-1.67-2.75-1.68 0-1.94 1.31-1.94 2.66V21h-4V9.75Z',
  x: 'M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-7-6.2 7H1.4l8.1-9.3L1 2h7.1l4.9 6.4L18.9 2Zm-1.2 18h1.9L6.4 3.9H4.3L17.7 20Z',
} as const;

export type ShareIconName = keyof typeof fillIcons | keyof typeof strokeIcons;

type ShareIconProps = Readonly<{
  name: ShareIconName;
}>;

export function ShareIcon({ name }: ShareIconProps) {
  const fillPath = (fillIcons as Record<string, string | undefined>)[name];

  if (fillPath !== undefined) {
    return (
      <svg
        aria-hidden="true"
        className="h-[1.05rem] w-[1.05rem]"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d={fillPath} />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="h-[1.05rem] w-[1.05rem]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      viewBox="0 0 24 24"
    >
      <path d={strokeIcons[name as keyof typeof strokeIcons]} />
    </svg>
  );
}
