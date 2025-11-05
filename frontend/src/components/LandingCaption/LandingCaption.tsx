import { Card, Heading, Inset, Text } from '@radix-ui/themes';

export default function LandingCaption() {
  return (
    <Card size={'3'} m={'auto'} style={{ padding: '3rem' }}>
      <Inset clip="padding-box" side="top" pb="current">
        <Heading size={'9'} weight={'bold'} align="center" highContrast truncate>
          JUSTCHAT
        </Heading>
      </Inset>
      <Text align={'center'} size={'5'} as="div" weight={'bold'}>
        Let's Connect and Chat
      </Text>
    </Card>
  );
}
