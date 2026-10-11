import { useMessages } from '@/lib/i18n/use-messages';

import { Callout } from '../Callout';

export function FragileInheritanceNote() {
  const messages = useMessages();

  return (
    <Callout title={messages.solid.fragileInheritanceTitle} tone="warning">
      {messages.solid.fragileInheritanceBody}
    </Callout>
  );
}
