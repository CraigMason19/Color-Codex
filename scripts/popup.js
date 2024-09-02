const POPUP_FADE_OUT = 6000;

// Function to show popup with fade out effect
export default function showPopup(title, content, fadeOutTime=POPUP_FADE_OUT) {
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    const popupTitle = document.getElementById('popup-title');

    popupTitle.textContent = title;
    popupContent.textContent = content;

    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
    }, fadeOutTime);
}