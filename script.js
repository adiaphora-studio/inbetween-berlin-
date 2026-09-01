/* =========================================================
   REMOVE CHATGPT REFERRAL PARAMETER
========================================================= */

(function () {

    const url = new URL(window.location.href);

    if (url.searchParams.has("utm_source")) {

        url.searchParams.delete("utm_source");

        window.history.replaceState(
            null,
            document.title,
            url.pathname +
            url.search +
            url.hash
        );
    }

})();


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


/* =========================================================
   OPEN LIGHTBOX
========================================================= */

function openLightbox(index) {

    currentIndex = index;

    updateLightbox();

    lightbox.classList.add("is-open");

    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "lightbox-open"
    );
}


/* =========================================================
   CLOSE LIGHTBOX
========================================================= */

function closeLightbox() {

    lightbox.classList.remove(
        "is-open"
    );

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "lightbox-open"
    );

    lightboxImage.src = "";
}


/* =========================================================
   UPDATE LIGHTBOX
========================================================= */

function updateLightbox() {

    const item =
        lightboxItems[currentIndex];

    if (!item) {
        return;
    }

    const image =
        item.querySelector("img");

    if (!image) {
        return;
    }

    lightboxImage.src =
        image.src;

    lightboxImage.alt =
        image.alt;


    const number =
        String(
            currentIndex + 1
        ).padStart(2, "0");


    const total =
        String(
            lightboxItems.length
        ).padStart(2, "0");


    lightboxCounter.textContent =
        `${number} / ${total}`;
}


/* =========================================================
   NEXT IMAGE
========================================================= */

function showNext() {

    currentIndex++;

    if (
        currentIndex >=
        lightboxItems.length
    ) {

        currentIndex = 0;
    }

    updateLightbox();
}


/* =========================================================
   PREVIOUS IMAGE
========================================================= */

function showPrevious() {

    currentIndex--;

    if (currentIndex < 0) {

        currentIndex =
            lightboxItems.length - 1;
    }

    updateLightbox();
}


/* =========================================================
   IMAGE CLICK EVENTS
========================================================= */

lightboxItems.forEach((item) => {

    item.addEventListener(
        "click",
        () => {

            const index =
                Number(
                    item.dataset.index
                );

            openLightbox(index);
        }
    );

});


/* =========================================================
   LIGHTBOX BUTTON EVENTS
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
   CLICK OUTSIDE IMAGE
========================================================= */

lightbox.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            lightbox
        ) {

            closeLightbox();
        }
    }
);


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            !lightbox.classList.contains(
                "is-open"
            )
        ) {

            return;
        }


        if (
            event.key === "Escape"
        ) {

            closeLightbox();

            return;
        }


        if (
            event.key === "ArrowRight"
        ) {

            showNext();

            return;
        }


        if (
            event.key === "ArrowLeft"
        ) {

            showPrevious();

            return;
        }

    }
);


/* =========================================================
   STORY
========================================================= */

const story =
    document.querySelector(
        ".story"
    );

const storySteps =
    Array.from(
        document.querySelectorAll(
            ".story-step"
        )
    );

const interlude =
    document.querySelector(
        ".story-interlude"
    );

const interludeText =
    interlude
        ? interlude.querySelector("p")
        : null;


/* =========================================================
   UTILITY
========================================================= */

function clamp(
    value,
    min,
    max
) {

    return Math.min(
        Math.max(
            value,
            min
        ),
        max
    );
}


function smoothstep(value) {

    value =
        clamp(
            value,
            0,
            1
        );

    return (
        value *
        value *
        (3 - 2 * value)
    );
}


/* =========================================================
   STORY ANIMATION
========================================================= */

function updateStory() {

    if (
        !story ||
        !storySteps.length
    ) {

        return;
    }


    const viewportHeight =
        window.innerHeight;

    const isMobile =
        window.innerWidth <= 700;


    storySteps.forEach(
        (step) => {

            const rect =
                step.getBoundingClientRect();


            /*
                0 = scene is below viewport
                0.5 = scene is centered
                1 = scene has moved above viewport
            */

            const progress =
                clamp(
                    (
                        viewportHeight -
                        rect.top
                    ) /
                    (
                        viewportHeight +
                        rect.height
                    ),
                    0,
                    1
                );


            /* =================================================
               IMAGE
            ================================================= */

            const image =
                step.querySelector(
                    ".story-image"
                );

            if (!image) {
                return;
            }


            let imageScale;


            if (
                step.classList.contains(
                    "story-step-final"
                )
            ) {

                imageScale =
                    1 +
                    smoothstep(
                        progress
                    ) *
                    0.16;

            } else {

                imageScale =
                    0.985 +
                    smoothstep(
                        progress
                    ) *
                    0.025;
            }


            image.style.transform =
                `scale(${imageScale})`;


       ```js
/* =================================================
   TEXT
================================================= */

const copy =
    step.querySelector(
        ".story-copy"
    );

if (!copy) {
    return;
}


/* =================================================
   TEXT FADE IN
================================================= */

const textIn =
    smoothstep(
        clamp(
            (
                progress -
                0.20
            ) /
            0.28,
            0,
            1
        )
    );


/* =================================================
   TEXT FADE OUT
================================================= */

const textOut =
    1 -
    smoothstep(
        clamp(
            (
                progress -
                0.70
            ) /
            0.25,
            0,
            1
        )
    );


/* =================================================
   TEXT OPACITY
================================================= */

const textOpacity =
    Math.min(
        textIn,
        textOut
    );


/* =================================================
   TEXT MOVEMENT
================================================= */

const baseMovement =
    isMobile
        ? 38
        : 42;

const textMovement =
    baseMovement -
    (
        textOpacity *
        baseMovement
    );


const finalTextMovement =
    isMobile
        ? textMovement * 0.72
        : textMovement;


/* =================================================
   FINAL STORY TEXT
================================================= */

if (
    step.classList.contains(
        "story-step-final"
    )
) {

    const finalMovement =
        isMobile
            ? 58
            : 80;

    copy.style.transform =
        `translate3d(
            -50%,
            ${finalMovement -
            textOpacity *
            finalMovement}px,
            0
        )`;

} else {

    copy.style.transform =
        `translate3d(
            0,
            ${finalTextMovement}px,
            0
        )`;
}


/* =================================================
   TEXT VISIBILITY
================================================= */

copy.style.opacity =
    textOpacity;


/* =================================================
   TEXT COLOR
================================================= */

copy.style.color =
    "#ffffff";
```

    /* =========================================================
       BLACK INTERLUDE
    ========================================================= */

    if (
        interlude &&
        interludeText
    ) {

        const rect =
            interlude.getBoundingClientRect();


        const progress =
            clamp(
                (
                    viewportHeight -
                    rect.top
                ) /
                (
                    viewportHeight +
                    rect.height
                ),
                0,
                1
            );


        const textIn =
            smoothstep(
                clamp(
                    (
                        progress -
                        0.28
                    ) /
                    0.25,
                    0,
                    1
                )
            );


        const textOut =
            1 -
            smoothstep(
                clamp(
                    (
                        progress -
                        0.72
                    ) /
                    0.20,
                    0,
                    1
                )
            );


        const opacity =
            Math.min(
                textIn,
                textOut
            );


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

        window.requestAnimationFrame(
            () => {

                updateStory();

                ticking = false;
            }
        );

        ticking = true;
    }
}


/* =========================================================
   SCROLL
========================================================= */

window.addEventListener(
    "scroll",
    requestStoryUpdate,
    {
        passive: true
    }
);


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    requestStoryUpdate
);


/* =========================================================
   INITIAL STATE
========================================================= */

updateStory();
