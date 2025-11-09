import { Avatar, Card, Flex, Heading, Inset, Text } from '@radix-ui/themes';
import AnimateText from '../AnimateText/AnimateText';

export default function LandingCaption() {
  return (
    <Card size={'3'} m={'auto'} style={{ padding: '4rem' }}>
      <Inset clip="padding-box" side="top" pb="current">
        <Heading
          style={{ position: 'relative', padding: 5, zIndex: 3 }}
          size={'9'}
          weight={'bold'}
          align="center"
          highContrast
        >
          {/* <div style={{ position: 'relative', top: 0, left: 0 }}> */}
          <div style={{ position: 'absolute', top: 2.5, left: 3 }}>
            <AnimateText texts={['JUSTCHAT']} />
          </div>
          JUSTCHAT
          {/* </div> */}
        </Heading>
        <div style={{ zIndex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <Avatar
            width={'500px'}
            style={{ objectFit: 'cover', position: 'absolute', top: 30, zIndex: -1, left: 0 }}
            src={'/assets/portfolio.jpeg'}
            fallback="/assets/client3.jpg"
            size={'9'}
          />
          <div
            style={{
              width: '160px',
              height: '160px',
              position: 'absolute',
              top: 30,
              left: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // adjust opacity
              zIndex: -1,
              borderRadius: '50%' // match avatar shape
            }}
          ></div>
        </div>
      </Inset>
      <Flex justify={'end'}>
        <Text align={'center'} size={'2'} as="div" weight={'bold'} style={{ zIndex: 5 }}>
          Let's Connect and Chat
        </Text>
      </Flex>
    </Card>
  );
}
