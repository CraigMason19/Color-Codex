import { Color } from './color.js';

// <!-- Popup HTML-->
// <div class="popup">
//     <p class="popup-title"></p>
//     <p></p>
// </div>

const POPUP_FADE_OUT = 6000;

/**
 * Displays a colored popup with a title and content.
 * Dynamically adds a popup to the main body element of the DOM.
 *
 * @param {string} title - The title to be displayed in the popup.
 * @param {string} content - The content to be displayed in the popup.
 * @param {Color} color - An instance of the `Color` class representing the popup's background color.
 * @param {number} [fadeOutTime=6000] - The time in milliseconds to display the popup before fading out.
 *                                      Pass `0` to keep the popup visible indefinitely.
 */
export function showPopup(title, content, color, fadeOutTime = POPUP_FADE_OUT) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.style.backgroundColor = color.toHex();
 
    const popupTitle = document.createElement('p');
    popupTitle.classList.add('popup-title');
    popupTitle.textContent = title;
    popup.appendChild(popupTitle);

    const popupContent = document.createElement('p');
    popupContent.textContent = content;
    popup.appendChild(popupContent);

    document.body.appendChild(popup);

    // Trigger reflow to ensure the transition starts
    requestAnimationFrame(() => {
        popup.classList.add('show');
    });

    if (fadeOutTime !== 0) {
        setTimeout(() => {
            popup.classList.remove('show');

            // Remove the popup after the fade-out transition ends
            const transitionDuration = parseFloat(getComputedStyle(popup).transitionDuration) * 1000;
            setTimeout(() => popup.remove(), transitionDuration);
        }, fadeOutTime);
    }
}