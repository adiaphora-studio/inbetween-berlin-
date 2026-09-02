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


            /*
                Softer entrance.

                The text begins earlier and
                takes longer to settle into place.
            */

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


            /*
                Softer exit.

                The text remains present slightly
                longer before beginning to disappear.
            */

            const textOut =
                1 -
                smoothstep(
                    clamp(
                        (
                            progress -
                            0.78
                        ) /
                        0.22,
                        0,
                        1
                    )
                );


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
                    ? 42
                    : 42;


            const textMovement =
                baseMovement -
                (
                    textOpacity *
                    baseMovement
                );


            /*
                Mobile gets an additional reduction
                in movement so the text feels calmer
                during finger scrolling.
            */

            const finalTextMovement =
                isMobile
                    ? textMovement * 0.72
                    : textMovement;


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


            copy.style.opacity =
                textOpacity;


            /* =================================================
               TEXT COLOR
               BLACK → WHITE
            ================================================= */

            if (
                !step.classList.contains(
                    "story-step-final"
                )
            ) {

                const colorProgress =
                    smoothstep(
                        clamp(
                            (
                                progress -
                                0.36
                            ) /
                            0.20,
                            0,
                            1
                        )
                    );


                const r =
                    Math.round(
                        21 -
                        (
                            21 *
                            colorProgress
                        )
                    );


                const g =
                    Math.round(
                        21 -
                        (
                            21 *
                            colorProgress
                        )
                    );


                const b =
                    Math.round(
                        21 -
                        (
                            21 *
                            colorProgress
                        )
                    );


                copy.style.color =
                    `rgb(${r}, ${g}, ${b})`;
            }


            /* =================================================
               FINAL STORY TEXT
            ================================================= */

            if (
                step.classList.contains(
                    "story-step-final"
                )
            ) {

                copy.style.color =
                    "#ffffff";
            }

        }
    );


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
/* =========================================================
   BEASTS WE HOLD — DISCOVER PAGE
========================================================= */

(function () {

    const beastsPage = document.querySelector(".beasts-page");

    if (!beastsPage) return;


    /* =====================================================
       IMAGE FADE INS
    ===================================================== */

    const fadeElements = document.querySelectorAll(
        ".beasts-detail-image, .beasts-pair img, [data-fade]"
    );

    const fadeObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                }

            });

        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    fadeElements.forEach((element) => {
        fadeObserver.observe(element);
    });


    /* =====================================================
       FIXED BACKGROUND IMAGES
    ===================================================== */

    const fixedScenes = document.querySelectorAll(
        ".beasts-fixed-scene"
    );

    const fixedObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                const image = entry.target.querySelector(
                    "[data-fixed-image]"
                );

                if (!image) return;

                if (entry.isIntersecting) {
                    image.classList.add("is-visible");
                } else {
                    image.classList.remove("is-visible");
                }

            });

        },
        {
            threshold: 0.12
        }
    );

    fixedScenes.forEach((scene) => {
        fixedObserver.observe(scene);
    });


    /* =====================================================
       LIGHTBOX
    ===================================================== */

    const galleryItems = Array.from(
        document.querySelectorAll(".beasts-gallery-item")
    );

    const lightbox = document.getElementById(
        "beastsLightbox"
    );

    const lightboxImage = document.getElementById(
        "beastsLightboxImage"
    );

    const lightboxCounter = document.getElementById(
        "beastsLightboxCounter"
    );

    const closeButton = document.getElementById(
        "beastsLightboxClose"
    );

    const prevButton = document.getElementById(
        "beastsLightboxPrev"
    );

    const nextButton = document.getElementById(
        "beastsLightboxNext"
    );


    const galleryImages = galleryItems.map((item) => {

        const image = item.querySelector("img");

        return {
            src: image.getAttribute("src"),
            alt: image.getAttribute("alt") || ""
        };

    });


    let currentGalleryIndex = 0;


    function updateBeastsLightbox() {

        if (!galleryImages.length) return;

        const current = galleryImages[currentGalleryIndex];

        lightboxImage.src = current.src;
        lightboxImage.alt = current.alt;

        lightboxCounter.textContent =
            String(currentGalleryIndex + 1).padStart(2, "0") +
            " / " +
            String(galleryImages.length).padStart(2, "0");
    }


    function openBeastsLightbox(index) {

        currentGalleryIndex = index;

        updateBeastsLightbox();

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
    }


    function closeBeastsLightbox() {

        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";
    }


    function nextBeastsImage() {

        currentGalleryIndex =
            (currentGalleryIndex + 1) %
            galleryImages.length;

        updateBeastsLightbox();
    }


    function previousBeastsImage() {

        currentGalleryIndex =
            (currentGalleryIndex - 1 + galleryImages.length) %
            galleryImages.length;

        updateBeastsLightbox();
    }


    galleryItems.forEach((item, index) => {

        item.addEventListener("click", () => {
            openBeastsLightbox(index);
        });

    });


    closeButton.addEventListener(
        "click",
        closeBeastsLightbox
    );


    nextButton.addEventListener(
        "click",
        nextBeastsImage
    );


    prevButton.addEventListener(
        "click",
        previousBeastsImage
    );


    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {
            closeBeastsLightbox();
        }

    });


    /* =====================================================
       KEYBOARD
    ===================================================== */

    document.addEventListener("keydown", (event) => {

        if (!lightbox.classList.contains("is-open")) return;

        if (event.key === "Escape") {
            closeBeastsLightbox();
        }

        if (event.key === "ArrowRight") {
            nextBeastsImage();
        }

        if (event.key === "ArrowLeft") {
            previousBeastsImage();
        }

    });


    /* =====================================================
       LIGHTBOX SWIPE
    ===================================================== */

    let lightboxTouchStartX = 0;
    let lightboxTouchStartY = 0;


    lightbox.addEventListener(
        "touchstart",
        (event) => {

            const touch = event.changedTouches[0];

            lightboxTouchStartX = touch.clientX;
            lightboxTouchStartY = touch.clientY;

        },
        { passive: true }
    );


    lightbox.addEventListener(
        "touchend",
        (event) => {

            const touch = event.changedTouches[0];

            const deltaX =
                touch.clientX - lightboxTouchStartX;

            const deltaY =
                touch.clientY - lightboxTouchStartY;


            if (Math.abs(deltaX) < 60) return;

            if (Math.abs(deltaX) < Math.abs(deltaY)) return;


            if (deltaX < 0) {
                nextBeastsImage();
            } else {
                previousBeastsImage();
            }

        },
        { passive: true }
    );


    /* =====================================================
       MOBILE EXIT SWIPE
       ONLY ACTIVE AT THE VERY END
    ===================================================== */

    let exitTouchStartX = 0;
    let exitTouchStartY = 0;


    beastsPage.addEventListener(
        "touchstart",
        (event) => {

            const touch = event.changedTouches[0];

            exitTouchStartX = touch.clientX;
            exitTouchStartY = touch.clientY;

        },
        { passive: true }
    );


    beastsPage.addEventListener(
        "touchend",
        (event) => {

            const touch = event.changedTouches[0];

            const deltaX =
                touch.clientX - exitTouchStartX;

            const deltaY =
                touch.clientY - exitTouchStartY;


            if (window.innerWidth > 700) return;

            if (deltaX < 100) return;

            if (Math.abs(deltaX) < Math.abs(deltaY)) return;


            const scrollPosition =
                window.scrollY + window.innerHeight;

            const documentHeight =
                document.documentElement.scrollHeight;


            const isAtBottom =
                documentHeight - scrollPosition < 100;


            if (isAtBottom) {
                window.location.href = "index.html";
            }

        },
        { passive: true }
    );


    /* =====================================================
       PREVENT IMAGE DRAGGING
    ===================================================== */

    document
        .querySelectorAll(".beasts-page img")
        .forEach((image) => {

            image.addEventListener("dragstart", (event) => {
                event.preventDefault();
            });

        });


})();
