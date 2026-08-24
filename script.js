/* =========================================================
   INBETWEEN BERLIN
   LIGHTBOX
========================================================= */


/*
    All photographs that can be opened in the lightbox.
*/

const lightboxItems = Array.from(
    document.querySelectorAll("[data-lightbox]")
);


/*
    Lightbox elements
*/

const lightbox = document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightbox-image");

const lightboxCounter =
    document.getElementById("lightbox-counter");

const closeButton =
    document.querySelector(".lightbox-close");

const previousButton =
    document.querySelector(".lightbox-prev");

const nextButton =
    document.querySelector(".lightbox-next");


/*
    Current image
*/

let currentIndex = 0;


/* =========================================================
   OPEN
========================================================= */

function openLightbox(index) {

    currentIndex = index;

    updateLightbox();

    lightbox.classList.add("is-open");

    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("lightbox-open");
}


/* =========================================================
   CLOSE
========================================================= */

function closeLightbox() {

    lightbox.classList.remove("is-open");

    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("lightbox-open");

    lightboxImage.src = "";
}


/* =========================================================
   UPDATE IMAGE
========================================================= */

function updateLightbox() {

    const item = lightboxItems[currentIndex];

    if (!item) {
        return;
    }


    const image = item.querySelector("img");

    if (!image) {
        return;
    }


    lightboxImage.src = image.src;

    lightboxImage.alt = image.alt;


    const number =
        String(currentIndex + 1).padStart(2, "0");

    const total =
        String(lightboxItems.length).padStart(2, "0");


    lightboxCounter.textContent =
        `${number} / ${total}`;
}


/* =========================================================
   NEXT
========================================================= */

function showNext() {

    currentIndex++;

    if (currentIndex >= lightboxItems.length) {
        currentIndex = 0;
    }

    updateLightbox();
}


/* =========================================================
   PREVIOUS
========================================================= */

function showPrevious() {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = lightboxItems.length - 1;
    }

    updateLightbox();
}


/* =========================================================
   IMAGE CLICK
========================================================= */

lightboxItems.forEach((item) => {

    item.addEventListener("click", () => {

        const index =
            Number(item.dataset.index);

        openLightbox(index);

    });

});


/* =========================================================
   BUTTONS
========================================================= */

closeButton.addEventListener(
    "click",
    closeLightbox
);


nextButton.addEventListener(
    "click",
    showNext
);


previousButton.addEventListener(
    "click",
    showPrevious
);


/* =========================================================
   BACKGROUND CLICK
========================================================= */

lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {
        closeLightbox();
    }

});


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener("keydown", (event) => {

    if (!lightbox.classList.contains("is-open")) {
        return;
    }


    if (event.key === "Escape") {

        closeLightbox();

        return;
    }


    if (event.key === "ArrowRight") {

        showNext();

        return;
    }


    if (event.key === "ArrowLeft") {

        showPrevious();

        return;
    }

});
