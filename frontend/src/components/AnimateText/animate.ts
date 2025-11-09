// //Promise based typer API for animating texts

import type { HTMLElementType } from 'react';

// const animateText = (textArg, textLabel, speed, delay) => {
//   return new Promise((resolve) => {
//     let index = 0;
//     let span;
//     textLabel.style.height = '100px';
//     // Typing Effect: Add characters one by one
//     if (textLabel && textArg) {
//       const typeInterval = setInterval(() => {
//         if (index < textArg.length) {
//           span = document.createElement('span');
//           span.classList.add('animate');
//           // Handle space characters with visible spacing
//           span.textContent = textArg.charAt(index) === ' ' ? '\u00A0' : textArg.charAt(index);
//           textLabel.append(span);
//           index++;
//         } else {
//           clearInterval(typeInterval); // Stop typing

//           // Wait before starting the delete effect
//           const timeoutId = setTimeout(() => {
//             let deleteIndex = textArg.length - 1;

//             // Deleting Effect: Remove characters one by one
//             const deleteInterval = setInterval(() => {
//               if (deleteIndex >= 0) {
//                 textLabel.children[deleteIndex].remove();
//                 deleteIndex--;
//               } else {
//                 clearInterval(deleteInterval); // Stop deleting
//                 resolve(); // Move to next text animation
//                 clearTimeout(timeoutId);
//               }
//             }, speed / 2); // Delete speed (faster than typing)
//           }, delay * 2);
//         }
//       }, speed);
//     }
//   });
// };

// export { animateText };

// Promise-based typer API for animating texts safely

const animateText = (textArg = '', textLabel, speed = 100, delay = 1000) => {
  return new Promise((resolve) => {
    if (!textLabel || !textArg) return resolve(textArg);

    // 🧹 Cancel any ongoing animation on this element
    if (textLabel._animationState?.active) {
      clearInterval(textLabel._animationState.typeInterval);
      clearInterval(textLabel._animationState.deleteInterval);
      clearTimeout(textLabel._animationState.timeoutId);
    }

    // 🧩 Mark this label as actively animating
    textLabel._animationState = { active: true };

    // Reset the element (remove old spans)
    textLabel.textContent = '';
    // textLabel.style.height = '100px';

    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < textArg.length) {
        const span = document.createElement('span');
        span.classList.add('animate');
        span.textContent = textArg.charAt(index) === ' ' ? '\u00A0' : textArg.charAt(index);
        textLabel.appendChild(span);
        index++;
      } else {
        clearInterval(typeInterval);

        // 🕐 Wait before starting delete effect
        const timeoutId = setTimeout(() => {
          let deleteIndex = textArg.length - 1;
          const deleteInterval = setInterval(() => {
            if (deleteIndex >= 0) {
              textLabel.children[deleteIndex].remove();
              deleteIndex--;
            } else {
              clearInterval(deleteInterval);
              resolve(textArg);
              textLabel._animationState = { active: false }; // ✅ Mark as done
            }
          }, speed / 2);
          textLabel._animationState.deleteInterval = deleteInterval;
        }, delay * 2);

        // Save references so they can be cleared if restarted
        textLabel._animationState.timeoutId = timeoutId;
      }
    }, speed);

    textLabel._animationState.typeInterval = typeInterval;
  });
};

export { animateText };
