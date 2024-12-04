import { Color } from './color.js';

const POPUP_FADE_OUT = 6000;

/**
 * Displays a colored popup with a title and content.
 *
 * @param {string} title - The title to be displayed in the popup.
 * @param {string} content - The content to be displayed in the popup.
 * @param {Color} color - An instance of the `Color` class representing the popup's background color.
 * @param {number} [fadeOutTime=6000] - The time in milliseconds to display the popup before fading out.
 *                                      Pass `0` to keep the popup visible until another popup is created.
 */
export function showPopup(title, content, color, fadeOutTime=POPUP_FADE_OUT) {
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    const popupTitle = document.getElementById('popup-title');

    popup.style.backgroundColor = color.toHex();
    popupTitle.textContent = title;
    popupContent.textContent = content;

    popup.classList.add('show');

    if(fadeOutTime !== 0) {
        setTimeout(() => {
            popup.classList.remove('show');
        }, fadeOutTime);
    }
}