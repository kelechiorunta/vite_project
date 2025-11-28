import React, { forwardRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, wrap, usePresenceData } from 'motion/react';
import { Button, Card, Flex } from '@radix-ui/themes';
// import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { FaFastBackward, FaFastForward } from 'react-icons/fa';

const Slide = forwardRef(function Slide(
  { color, id, toggleHover }: { color: string; id: number; toggleHover: (value: boolean) => void },
  ref: React.Ref<HTMLDivElement>
) {
  const direction = usePresenceData();
  const slides = [
    '/assets/happy1.png',
    '/assets/happy2.png',
    '/assets/happy3.png',
    '/assets/happy4.png',
    '/assets/happy5.png',
    '/assets/happy6.png',
    '/assets/happy7.png',
    '/assets/happy8.png'
  ];

  console.log(direction);
  return (
    <motion.div
      onHoverStart={() => toggleHover(true)}
      onHoverEnd={() => toggleHover(false)}
      ref={ref}
      initial={{ opacity: 1, x: direction * 100 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: {
          delay: 0.2,
          type: 'spring',
          visualDuration: 0.3,
          bounce: 0.4
        }
      }}
      exit={{ opacity: 1, x: direction * -100 }}
      style={{
        // backgroundColor: color,
        maxHeight: '100px',
        maxWidth: '100px',

        width: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%'
      }}
    >
      <img
        src={slides[id]}
        alt={color[0]}
        width={'100px'}
        height={'100px'}
        style={{ maxWidth: '100px', borderRadius: '50%' }}
        // style={{ borderRadius: '50%' }}
      />
    </motion.div>
  );
});

export default function Slider({ buttonVisible }: { buttonVisible: boolean }) {
  const items = [0, 1, 2, 3, 4, 5, 6, 7];
  const colors = ['blue', 'green', 'red', 'yellow', 'purple', 'grey', 'orange', 'pink'];

  const [direction, setDirection] = useState<-1 | 1>(1);
  const [selectedItem, setSelectedItem] = useState(items[0]);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleSlide = useCallback(
    (newDirection: -1 | 1) => {
      const nextItem = wrap(0, items.length, selectedItem + newDirection);
      setSelectedItem(nextItem);
      setDirection(newDirection);
      console.log(nextItem);
    },
    [items.length, selectedItem]
  );

  const toggleHover = (value: boolean) => {
    setIsHovered(value);
  };

  useEffect(() => {
    const slideInterval = setInterval(() => {
      if (!isHovered) handleSlide(direction);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [direction, handleSlide, isHovered]);

  const color = colors[selectedItem];
  return (
    <Flex align={'center'} gap={'0'}>
      {/* <motion.button
        initial={false}
        // animate={{ backgroundColor: color }}
        aria-label="Previous"
        style={{ maxHeight: '50px' }}
        onClick={() => handleSlide(1)}
        whileFocus={{ outline: `2px solid ${color}` }}
        whileTap={{ scale: 0.9 }}
      > */}

      {buttonVisible && (
        <Button
          onClick={() => handleSlide(1)}
          highContrast
          variant="classic"
          style={{
            position: 'absolute',
            zIndex: 60,
            left: 0,
            maxWidth: '30px',
            maxHeight: '30px',
            borderRadius: '50%'
          }}
        >
          <FaFastBackward />
        </Button>
      )}

      {/* </motion.button> */}
      <Card
        style={{
          maxWidth: '200px',
          maxHeight: '200px',
          borderRadius: '50%',
          overflow: 'hidden'
        }}
      >
        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          <Slide key={selectedItem} color={color} id={selectedItem} toggleHover={toggleHover} />
        </AnimatePresence>
      </Card>
      {/* <motion.button
        initial={false}
        // animate={{ backgroundColor: color }}
        aria-label="Previous"
        style={{ maxHeight: '50px' }}
        whileFocus={{ outline: `2px solid ${color}` }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleSlide(-1)}
      > */}
      {buttonVisible && (
        <Button
          onClick={() => handleSlide(-1)}
          highContrast
          variant="classic"
          style={{
            position: 'absolute',
            maxWidth: '30px',
            maxHeight: '30px',
            zIndex: 60,
            right: 0,
            borderRadius: '50%'
          }}
        >
          <FaFastForward />
        </Button>
      )}
      {/* </motion.button> */}
    </Flex>
  );
}
