/* =========================================================
   INBETWEEN BERLIN
   LIGHTBOX + EDITORIAL SCROLL STORY
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
   STORY
========================================================= */

const story =
    document.querySelector(".story");

const storySteps =
    Array.from(
        document.querySelectorAll(".story-step")
    );

const interlude =
    document.querySelector(".story-interlude");

const interludeText =
    interlude
        ? interlude.querySelector("p")
        : null;


/* =========================================================
   UTILITY
========================================================= */

function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );
}


function smoothstep(value) {

    value = clamp(value, 0, 1);

    return value * value * (3 - 2 * value);
}


/* =========================================================
   STORY ANIMATION
========================================================= */

function updateStory() {

    if (!story || !storySteps.length) {
        return;
    }


    const viewportHeight =
        window.innerHeight;


    storySteps.forEach((step) => {

        const rect =
            step.getBoundingClientRect();


        /*
            0 = scene is below viewport
            0.5 = scene is centered
            1 = scene has moved above viewport
        */

        const progress =
            clamp(
                (viewportHeight - rect.top) /
                (viewportHeight + rect.height),
                0,
                1
            );


        /* =====================================================
           IMAGE
        ===================================================== */

        const image =
            step.querySelector(".story-image");

        if (!image) {
            return;
        }


        let imageScale;


        if (step.classList.contains("story-step-final")) {

            imageScale =
                1 +
                smoothstep(progress) * 0.16;

        } else {

            imageScale =
                0.985 +
                smoothstep(progress) * 0.025;

        }


        image.style.transform =
            `scale(${imageScale})`;


        /* =====================================================
           TEXT
        ===================================================== */

        const copy =
            step.querySelector(".story-copy");

        if (!copy) {
            return;
        }


        const textIn =
            smoothstep(
                clamp(
                    (progress - 0.25) / 0.20,
                    0,
                    1
                )
            );


        const textOut =
            1 -
            smoothstep(
                clamp(
                    (progress - 0.72) / 0.18,
                    0,
                    1
                )
            );


        const textOpacity =
            Math.min(textIn, textOut);


        /* -----------------------------------------------------
           TEXT MOVEMENT
        ----------------------------------------------------- */

        const textMovement =
            70 -
            (textOpacity * 70);


        if (
            step.classList.contains(
                "story-step-final"
            )
        ) {

            copy.style.transform =
                `translate3d(-50%, ${80 - textOpacity * 80}px, 0)`;

        } else {

            copy.style.transform =
                `translate3d(0, ${textMovement}px, 0)`;
        }


        copy.style.opacity =
            textOpacity;


        /* =====================================================
           TEXT COLOR — BLACK → WHITE
        ===================================================== */

        /*
            The text remains black while it is outside
            the image.

            As it moves across the image it gradually
            becomes white.

            This creates the feeling that the typography
            belongs to the photograph rather than sitting
            above it.
        */

        if (
            !step.classList.contains(
                "story-step-final"
            )
        ) {

            const colorProgress =
                smoothstep(
                    clamp(
                        (progress - 0.36) / 0.20,
                        0,
                        1
                    )
                );


            const r =
                Math.round(
                    21 -
                    (21 * colorProgress)
                );

            const g =
                Math.round(
                    21 -
                    (21 * colorProgress)
                );

            const b =
                Math.round(
                    21 -
                    (21 * colorProgress)
                );


            copy.style.color =
                `rgb(${r}, ${g}, ${b})`;
        }


        /* -----------------------------------------------------
           FINAL STORY TEXT
        ----------------------------------------------------- */

        if (
            step.classList.contains(
                "story-step-final"
            )
        ) {

            copy.style.color =
                "#ffffff";
        }

    });


    /* =====================================================
       BLACK INTERLUDE
    ===================================================== */

    if (interlude && interludeText) {

        const rect =
            interlude.getBoundingClientRect();


        const progress =
            clamp(
                (viewportHeight - rect.top) /
                (viewportHeight + rect.height),
                0,
                1
            );


        const textIn =
            smoothstep(
                clamp(
                    (progress - 0.28) / 0.25,
                    0,
                    1
                )
            );


        const textOut =
            1 -
            smoothstep(
                clamp(
                    (progress - 0.72) / 0.20,
                    0,
                    1
                )
            );


        const opacity =
            Math.min(textIn, textOut);


        const movement =
            50 -
            opacity * 50;


        interludeText.style.opacity =
            opacity;


        interludeText.style.transform =
            `translateY(${movement}px)`;
    }
}


/* =========================================================
   REQUEST ANIMATION FRAME
========================================================= */

let ticking = false;


function requestStoryUpdate() {

    if (!ticking) {

        window.requestAnimationFrame(() => {

            updateStory();

            ticking = false;

        });

        ticking = true;
    }
}


window.addEventListener(
    "scroll",
    requestStoryUpdate,
    { passive: true }
);


window.addEventListener(
    "resize",
    requestStoryUpdate
);


/* =========================================================
   INITIAL STATE
========================================================= */

updateStory();
