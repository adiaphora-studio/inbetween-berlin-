/* =========================================================
   INBETWEEN BERLIN
   LIGHTBOX + SCROLL STORY
========================================================= */


/* =========================================================
   LIGHTBOX
========================================================= */

const lightboxItems = Array.from(
    document.querySelectorAll("[data-lightbox]")
);

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


let currentIndex = 0;


function openLightbox(index) {

    currentIndex = index;

    updateLightbox();

    lightbox.classList.add("is-open");

    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("lightbox-open");
}


function closeLightbox() {

    lightbox.classList.remove("is-open");

    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("lightbox-open");

    lightboxImage.src = "";
}


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


function showNext() {

    currentIndex++;

    if (currentIndex >= lightboxItems.length) {
        currentIndex = 0;
    }

    updateLightbox();
}


function showPrevious() {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = lightboxItems.length - 1;
    }

    updateLightbox();
}


lightboxItems.forEach((item) => {

    item.addEventListener("click", () => {

        const index =
            Number(item.dataset.index);

        openLightbox(index);

    });

});


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


/* =========================================================
   STORY — BEASTS WE HOLD
========================================================= */

const storySteps =
    Array.from(
        document.querySelectorAll(".story-step")
    );


/*
    Activate the story step that is currently
    passing through the central part of the viewport.
*/

if (storySteps.length) {

    const storyObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        storySteps.forEach((step) => {
                            step.classList.remove("is-active");
                        });

                        entry.target.classList.add("is-active");
                    }

                });

            },
            {
                threshold: 0.45
            }
        );


    storySteps.forEach((step) => {

        storyObserver.observe(step);

    });


    /*
        Start the first story image gently active.
    */

    storySteps[0].classList.add("is-active");

}
