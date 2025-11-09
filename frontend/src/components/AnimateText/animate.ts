// //Promise based typer API for animating texts

// const animateText = (textArg, _textLabel, speed, delay) => {
//   return new Promise((resolve) => {
//     let index = 0;
//     let span;
//     _textLabel.style.height = '100px';
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

const animateText = (textArg = '', _textLabel, speed = 100, delay = 1000) => {
  return new Promise((resolve) => {
    if (!_textLabel || !textArg) return resolve(textArg);

    // 🧹 Cancel any ongoing animation on this element
    if (_textLabel._animationState?.active) {
      clearInterval(_textLabel._animationState.typeInterval);
      clearInterval(_textLabel._animationState.deleteInterval);
      clearTimeout(_textLabel._animationState.timeoutId);
    }

    // 🧩 Mark this label as actively animating
    _textLabel._animationState = { active: true };

    // Reset the element (remove old spans)
    _textLabel.textContent = '';
    // _textLabel.style.height = '100px';

    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < textArg.length) {
        const span = document.createElement('span');
        span.classList.add('animate');
        span.textContent = textArg.charAt(index) === ' ' ? '\u00A0' : textArg.charAt(index);
        _textLabel.appendChild(span);
        index++;
      } else {
        clearInterval(typeInterval);

        // 🕐 Wait before starting delete effect
        const timeoutId = setTimeout(() => {
          let deleteIndex = textArg.length - 1;
          const deleteInterval = setInterval(() => {
            if (deleteIndex >= 0) {
              _textLabel.children[deleteIndex].remove();
              deleteIndex--;
            } else {
              clearInterval(deleteInterval);
              resolve(textArg);
              _textLabel._animationState = { active: false }; // ✅ Mark as done
            }
          }, speed / 2);
          _textLabel._animationState.deleteInterval = deleteInterval;
        }, delay * 2);

        // Save references so they can be cleared if restarted
        _textLabel._animationState.timeoutId = timeoutId;
      }
    }, speed);

    _textLabel._animationState.typeInterval = typeInterval;
  });
};

export { animateText };
