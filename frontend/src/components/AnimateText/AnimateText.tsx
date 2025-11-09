import './animateText.scss';
import { useEffect, useRef } from 'react';
import { animateText } from './animate';

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
          // isMounted = false;
        }
      };

      runTypingLoop();

      return () => {
        isMounted = false;
        // textRef.current.innerHTML = '';
      };
    }
  }, [speed, delay, textRef, texts]); // Only re-run if config changes

  return (
    <div
      className="m-auto"
      style={{
        fontSize: textSize
      }}
      ref={textRef}
    ></div>
  );
};

export default AnimateText;
