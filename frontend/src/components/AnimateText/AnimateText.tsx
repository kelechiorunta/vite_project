import './animateText.scss';
import { useEffect, useRef } from 'react';
import { animateText } from './animate';
import { Heading } from '@radix-ui/themes';

export interface animateTextProps {
  texts?: string[];
  speed?: number;
  delay?: number;
  textSize?: string;
  textHeight?: string;
}

const AnimateText = ({
  texts = [],
  speed = 100,
  delay = 5000,
  textSize = '3.65rem',
  textHeight = '30px'
}: animateTextProps) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      let isMounted = true;

      const runTypingLoop = async () => {
        let index = 0;

        while (isMounted) {
          const currentText = texts[index];

          if (textRef.current) {
            await animateText(currentText, textRef.current, speed, delay);
          }

          await new Promise((resolve) => setTimeout(resolve, 1500)); // wait before next word

          index = (index + 1) % texts.length;
          console.log(textHeight);
          console.log(textSize);
          // isMounted = false;
        }
      };

      runTypingLoop();

      return () => {
        isMounted = false;
        // textRef.current.innerHTML = '';
      };
    }
  }, [speed, delay, textRef, texts, textHeight, textSize]); // Only re-run if config changes

  return (
    <Heading
      className="m-auto"
      // style={{
      //   fontSize: textSize
      // }}
      size={{ initial: '7', xs: '7', sm: '7', md: '8', lg: '9' }}
      ref={textRef}
    ></Heading>
  );
};

export default AnimateText;
