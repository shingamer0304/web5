/* =========================================================
   SHIN ENDFIELD
   INTERACTIVE PORTFOLIO ENGINE
   PART 3 — MAIN JAVASCRIPT
========================================================= */

import * as THREE from "three";

/* =========================================================
   INITIAL SETUP
========================================================= */

document.documentElement.classList.add("js-enabled");

gsap.registerPlugin(ScrollTrigger);

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* =========================================================
   GLOBAL STATE
========================================================= */

const state = {

    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,

    normalizedX: 0,
    normalizedY: 0,

    cursorX: window.innerWidth / 2,
    cursorY: window.innerHeight / 2,

    introFinished: false,

    audioEnabled: false,

    scrollVelocity: 0,

    lastScrollY: window.scrollY,

    time: 0

};


/* =========================================================
   UTILITY
========================================================= */

const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

const lerp = (a, b, t) =>
    a + (b - a) * t;

const random = (min, max) =>
    Math.random() * (max - min) + min;


/* =========================================================
   PARTICLE DOM FIELD
========================================================= */

function createParticles(){

    const container = $("#particles");

    if(!container) return;

    const count =
        window.innerWidth < 600
            ? 35
            : 75;

    const fragment =
        document.createDocumentFragment();

    for(let i = 0; i < count; i++){

        const particle =
            document.createElement("span");

        particle.className =
            "particle";

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.animationDuration =
            `${random(5, 15)}s`;

        particle.style.animationDelay =
            `${random(-15, 0)}s`;

        particle.style.opacity =
            random(.15, .7);

        const size =
            random(1, 3.5);

        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;

        fragment.appendChild(particle);

    }

    container.appendChild(fragment);

}

createParticles();


/* =========================================================
   ADD CINEMATIC FX ELEMENTS
========================================================= */

function createFilmFX(){

    if(!document.querySelector(".film-grain")){

        const grain =
            document.createElement("div");

        grain.className =
            "film-grain";

        document.body.appendChild(grain);

    }

    if(!document.querySelector(".scanlines")){

        const scanlines =
            document.createElement("div");

        scanlines.className =
            "scanlines";

        document.body.appendChild(scanlines);

    }

}

createFilmFX();


/* =========================================================
   HUD SYSTEM
========================================================= */

function createHUD(){

    const sections =
        $$(".panel");

    sections.forEach((section, index) => {

        const positions = [
            "hud-top-left",
            "hud-top-right",
            "hud-bottom-left",
            "hud-bottom-right"
        ];

        positions.forEach(position => {

            const corner =
                document.createElement("div");

            corner.className =
                `hud-corner ${position}`;

            section.appendChild(corner);

        });

        const label =
            document.createElement("div");

        label.className =
            "hud-label";

        label.style.top =
            `${110 + index * 3}px`;

        label.style.left =
            "clamp(30px, 7vw, 120px)";

        label.textContent =
            `SECTOR ${String(index + 1).padStart(2, "0")} // ONLINE`;

        section.appendChild(label);

    });

}

createHUD();


/* =========================================================
   DATA PARTICLES
========================================================= */

function createDataParticles(){

    const sections =
        $$(".panel");

    const symbols = [
        "0101",
        "SYNC",
        "SYS",
        "NODE",
        "DATA",
        "ONLINE",
        "07",
        "X-01",
        "CORE",
        "ACTIVE"
    ];

    sections.forEach(section => {

        for(let i = 0; i < 5; i++){

            const item =
                document.createElement("div");

            item.className =
                "data-particle";

            item.textContent =
                symbols[
                    Math.floor(
                        Math.random() * symbols.length
                    )
                ];

            item.style.left =
                `${random(5, 95)}%`;

            item.style.top =
                `${random(10, 90)}%`;

            item.style.animationDelay =
                `${random(-5, 0)}s`;

            section.appendChild(item);

        }

    });

}

createDataParticles();


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursor =
    $("#cursor");

const cursorCore =
    $(".cursor-core");

const cursorRing =
    $(".cursor-ring");

if(cursor){

    window.addEventListener(
        "pointermove",
        event => {

            state.mouseX =
                event.clientX;

            state.mouseY =
                event.clientY;

            state.normalizedX =
                (event.clientX / window.innerWidth) * 2 - 1;

            state.normalizedY =
                (event.clientY / window.innerHeight) * 2 - 1;

        },
        { passive: true }
    );

}


/* =========================================================
   CURSOR ANIMATION LOOP
========================================================= */

function updateCursor(){

    state.cursorX =
        lerp(
            state.cursorX,
            state.mouseX,
            .24
        );

    state.cursorY =
        lerp(
            state.cursorY,
            state.mouseY,
            .24
        );

    if(cursorCore){

        cursorCore.style.transform =
            `translate(
                ${state.mouseX}px,
                ${state.mouseY}px
            ) translate(-50%, -50%)`;

    }

    if(cursorRing){

        cursorRing.style.transform =
            `translate(
                ${state.cursorX}px,
                ${state.cursorY}px
            ) translate(-50%, -50%)`;

    }

    requestAnimationFrame(updateCursor);

}

updateCursor();


/* =========================================================
   CURSOR HOVER STATES
========================================================= */

function bindCursorInteractions(){

    const interactive =
        $$(
            "a, button, .hero-button, .launch-button, .orb-card, .info-item, [data-tilt], .magnetic"
        );

    interactive.forEach(element => {

        element.addEventListener(
            "mouseenter",
            () => {

                cursor?.classList.add(
                    "cursor-active"
                );

            }
        );

        element.addEventListener(
            "mouseleave",
            () => {

                cursor?.classList.remove(
                    "cursor-active"
                );

            }
        );

    });

}

bindCursorInteractions();


/* =========================================================
   CURSOR PARTICLE TRAIL
========================================================= */

let lastParticleTime = 0;

window.addEventListener(
    "pointermove",
    event => {

        const now =
            performance.now();

        if(now - lastParticleTime < 35)
            return;

        lastParticleTime = now;

        if(
            Math.abs(
                state.mouseX -
                state.cursorX
            ) < 3
        ){

            return;

        }

        const particle =
            document.createElement("span");

        particle.className =
            "cursor-particle";

        particle.style.left =
            `${event.clientX}px`;

        particle.style.top =
            `${event.clientY}px`;

        document.body.appendChild(
            particle
        );

        setTimeout(
            () => particle.remove(),
            700
        );

    },
    { passive:true }
);


/* =========================================================
   MAGNETIC ELEMENTS
========================================================= */

function setupMagnetic(){

    if(
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ){

        return;

    }

    const elements =
        $$(".magnetic, .hero-button, .launch-button");

    elements.forEach(element => {

        element.addEventListener(
            "pointermove",
            event => {

                const rect =
                    element.getBoundingClientRect();

                const x =
                    event.clientX -
                    (rect.left + rect.width / 2);

                const y =
                    event.clientY -
                    (rect.top + rect.height / 2);

                const strength = 0.18;

                element.style.transform =
                    `translate(
                        ${x * strength}px,
                        ${y * strength}px
                    )`;

            }
        );

        element.addEventListener(
            "pointerleave",
            () => {

                element.style.transform =
                    "";

            }
        );

    });

}

setupMagnetic();


/* =========================================================
   3D TILT
========================================================= */

function setupTilt(){

    if(
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ){

        return;

    }

    const elements =
        $$(
            "[data-tilt], .orb-card, .info-item, .contact-panel"
        );

    elements.forEach(element => {

        element.addEventListener(
            "pointermove",
            event => {

                const rect =
                    element.getBoundingClientRect();

                const px =
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width;

                const py =
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height;

                const rotateY =
                    (px - .5) * 12;

                const rotateX =
                    (.5 - py) * 10;

                element.style.transform =
                    `perspective(1000px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateZ(8px)`;

                element.style.setProperty(
                    "--mouse-x",
                    `${px * 100}%`
                );

                element.style.setProperty(
                    "--mouse-y",
                    `${py * 100}%`
                );

            }
        );

        element.addEventListener(
            "pointerleave",
            () => {

                element.style.transform =
                    "";

            }
        );

    });

}

setupTilt();


/* =========================================================
   REACTIVE LIGHT
========================================================= */

function setupReactiveLights(){

    const elements =
        $$(
            ".orb-card, .info-item, .contact-panel, .timeline .content"
        );

    elements.forEach(element => {

        if(
            !element.querySelector(
                ".reactive-light"
            )
        ){

            const light =
                document.createElement("div");

            light.className =
                "reactive-light";

            element.appendChild(light);

        }

        element.addEventListener(
            "pointermove",
            event => {

                const rect =
                    element.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;

                element.style.setProperty(
                    "--mouse-x",
                    `${x}px`
                );

                element.style.setProperty(
                    "--mouse-y",
                    `${y}px`
                );

            }
        );

    });

}

setupReactiveLights();


/* =========================================================
   CLICK SHOCKWAVE
========================================================= */

function createShockwave(x, y){

    const wave =
        document.createElement("div");

    wave.className =
        "shockwave";

    wave.style.left =
        `${x}px`;

    wave.style.top =
        `${y}px`;

    document.body.appendChild(
        wave
    );

    setTimeout(
        () => wave.remove(),
        800
    );

}


function createClickFlash(x, y){

    const flash =
        document.createElement("div");

    flash.className =
        "click-flash";

    flash.style.setProperty(
        "--click-x",
        `${x}px`
    );

    flash.style.setProperty(
        "--click-y",
        `${y}px`
    );

    document.body.appendChild(
        flash
    );

    setTimeout(
        () => flash.remove(),
        400
    );

}


window.addEventListener(
    "pointerdown",
    event => {

        createShockwave(
            event.clientX,
            event.clientY
        );

        createClickFlash(
            event.clientX,
            event.clientY
        );

    }
);


/* =========================================================
   SCROLL VELOCITY
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        const current =
            window.scrollY;

        state.scrollVelocity =
            current -
            state.lastScrollY;

        state.lastScrollY =
            current;

    },
    { passive:true }
);


/* =========================================================
   SCROLL REVEAL
========================================================= */

function setupReveal(){

    const elements =
        $$(".reveal");

    if(!elements.length)
        return;

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if(
                            entry.isIntersecting
                        ){

                            entry.target.classList.add(
                                "active"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold:.12,
                rootMargin:
                    "0px 0px -8% 0px"
            }
        );

    elements.forEach(
        element =>
            observer.observe(element)
    );

}

setupReveal();


/* =========================================================
   GSAP SECTION ANIMATIONS
========================================================= */

function setupGSAP(){

    gsap.utils.toArray(
        ".section-title"
    ).forEach(title => {

        gsap.fromTo(
            title,
            {
                opacity:0,
                x:-80,
                filter:"blur(15px)"
            },
            {
                opacity:1,
                x:0,
                filter:"blur(0px)",
                duration:1.2,
                ease:"power4.out",
                scrollTrigger:{
                    trigger:title,
                    start:"top 85%",
                    once:true
                }
            }
        );

    });


    gsap.utils.toArray(
        ".timeline-item"
    ).forEach((item, index) => {

        gsap.fromTo(
            item,
            {
                opacity:0,
                x:index % 2 === 0
                    ? -70
                    : 70
            },
            {
                opacity:1,
                x:0,
                duration:1,
                ease:"power4.out",
                scrollTrigger:{
                    trigger:item,
                    start:"top 82%",
                    once:true
                }
            }
        );

    });


    gsap.utils.toArray(
        ".orb-card"
    ).forEach((card, index) => {

        gsap.fromTo(
            card,
            {
                opacity:0,
                y:100,
                rotateX:12
            },
            {
                opacity:1,
                y:0,
                rotateX:0,
                duration:1.1,
                delay:index * .08,
                ease:"power4.out",
                scrollTrigger:{
                    trigger:card,
                    start:"top 85%",
                    once:true
                }
            }
        );

    });

}

setupGSAP();


/* =========================================================
   HERO MOUSE PARALLAX
========================================================= */

const heroContent =
    $(".hero-content");

if(heroContent){

    window.addEventListener(
        "pointermove",
        () => {

            const x =
                state.normalizedX;

            const y =
                state.normalizedY;

            gsap.to(
                heroContent,
                {
                    x:x * 18,
                    y:y * 12,
                    rotateY:x * 3,
                    rotateX:-y * 2,
                    duration:.8,
                    ease:"power3.out",
                    overwrite:true
                }
            );

        },
        { passive:true }
    );

}


/* =========================================================
   SECTION PARALLAX
========================================================= */

function setupParallax(){

    gsap.utils.toArray(
        ".panel"
    ).forEach(section => {

        const children =
            section.querySelectorAll(
                ".section-title, .data-particle, .hud-label"
            );

        children.forEach(
            child => {

                const speed =
                    random(-25,25);

                gsap.to(
                    child,
                    {
                        y:speed,
                        ease:"none",
                        scrollTrigger:{
                            trigger:section,
                            start:"top bottom",
                            end:"bottom top",
                            scrub:1.5
                        }
                    }
                );

            }
        );

    });

}

setupParallax();


/* =========================================================
   HERO ENTRY
========================================================= */

function heroEntry(){

    const timeline =
        gsap.timeline();

    timeline
        .from(
            ".hero-sub",
            {
                opacity:0,
                x:-40,
                duration:.8,
                ease:"power4.out"
            }
        )
        .from(
            ".hero-title",
            {
                opacity:0,
                y:100,
                scale:.9,
                filter:"blur(20px)",
                duration:1.4,
                ease:"power4.out"
            },
            "-=.4"
        )
        .from(
            ".hero-desc",
            {
                opacity:0,
                y:30,
                duration:.8
            },
            "-=.6"
        )
        .from(
            ".hero-button",
            {
                opacity:0,
                y:25,
                scale:.9,
                duration:.7
            },
            "-=.4"
        )
        .from(
            ".scroll-indicator",
            {
                opacity:0,
                y:20,
                duration:.6
            },
            "-=.2"
        );

}

heroEntry();


/* =========================================================
   NAVIGATION ACTIVE STATE
========================================================= */

function setupNavigation(){

    const links =
        $$("nav a");

    const sections =
        $$(
            "section[id]"
        );

    sections.forEach(section => {

        ScrollTrigger.create({

            trigger:section,

            start:"top 45%",
            end:"bottom 45%",

            onEnter:() =>
                activate(section.id),

            onEnterBack:() =>
                activate(section.id)

        });

    });


    function activate(id){

        links.forEach(link => {

            const target =
                link.getAttribute("href");

            link.classList.toggle(
                "active",
                target === `#${id}`
            );

        });

    }

}

setupNavigation();


/* =========================================================
   SMOOTH NAVIGATION
========================================================= */

$$("a[href^='#']").forEach(link => {

    link.addEventListener(
        "click",
        event => {

            const href =
                link.getAttribute("href");

            const target =
                $(href);

            if(!target)
                return;

            event.preventDefault();

            const offset =
                window.innerWidth < 600
                    ? 20
                    : 0;

            window.scrollTo({

                top:
                    target.offsetTop -
                    offset,

                behavior:"smooth"

            });

        }
    );

});


/* =========================================================
   BUTTON RIPPLE
========================================================= */

$$(
    ".hero-button, .launch-button"
).forEach(button => {

    button.addEventListener(
        "pointerdown",
        event => {

            const rect =
                button.getBoundingClientRect();

            const ripple =
                document.createElement(
                    "span"
                );

            ripple.style.position =
                "absolute";

            ripple.style.left =
                `${event.clientX - rect.left}px`;

            ripple.style.top =
                `${event.clientY - rect.top}px`;

            ripple.style.width =
                "10px";

            ripple.style.height =
                "10px";

            ripple.style.borderRadius =
                "50%";

            ripple.style.background =
                "rgba(255,255,255,.35)";

            ripple.style.transform =
                "translate(-50%,-50%) scale(0)";

            ripple.style.pointerEvents =
                "none";

            button.appendChild(
                ripple
            );

            gsap.to(
                ripple,
                {
                    scale:30,
                    opacity:0,
                    duration:.7,
                    ease:"power2.out",
                    onComplete:() =>
                        ripple.remove()
                }
            );

        }
    );

});


/* =========================================================
   DYNAMIC BUTTON LIGHT
========================================================= */

$$(
    ".hero-button, .launch-button"
).forEach(button => {

    button.addEventListener(
        "pointermove",
        event => {

            const rect =
                button.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left;

            const y =
                event.clientY -
                rect.top;

            button.style.setProperty(
                "--mx",
                `${x}px`
            );

            button.style.setProperty(
                "--my",
                `${y}px`
            );

        }
    );

});


/* =========================================================
   SCROLL SPEED VISUAL EFFECT
========================================================= */

let scrollFXRunning = false;

function scrollFX(){

    if(
        Math.abs(
            state.scrollVelocity
        ) > 1
    ){

        const intensity =
            clamp(
                Math.abs(
                    state.scrollVelocity
                ) / 30,
                0,
                1
            );

        document.documentElement.style.setProperty(
            "--scroll-intensity",
            intensity
        );

    }

    state.scrollVelocity *= .85;

    requestAnimationFrame(
        scrollFX
    );

}

scrollFX();


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        state.mouseX =
            clamp(
                state.mouseX,
                0,
                window.innerWidth
            );

        state.mouseY =
            clamp(
                state.mouseY,
                0,
                window.innerHeight
            );

        ScrollTrigger.refresh();

    }
);


/* =========================================================
   PAGE LOAD
========================================================= */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "page-enter"
        );

    }
);


/* =========================================================
   THREE.JS INTRO
   Construction Scene
========================================================= */

const introCanvas =
    $("#introCanvas");

const loader =
    $("#loader");

const progressBar =
    $(".loader-progress");

const loadingText =
    $("#loadingText");

const skipIntro =
    $("#skipIntro");


let introScene;
let introCamera;
let introRenderer;

let buildingGroup;

let introAnimationFrame;

let constructionProgress = 0;


/* =========================================================
   CREATE INTRO SCENE
========================================================= */

function createIntroScene(){

    if(!introCanvas)
        return;

    introScene =
        new THREE.Scene();

    introScene.fog =
        new THREE.FogExp2(
            0x02050a,
            .045
        );


    introCamera =
        new THREE.PerspectiveCamera(
            55,
            window.innerWidth /
            window.innerHeight,
            .1,
            1000
        );

    introCamera.position.set(
        9,
        7,
        14
    );


    introRenderer =
        new THREE.WebGLRenderer({
            canvas:introCanvas,
            antialias:true,
            alpha:true,
            powerPreference:
                "high-performance"
        });

    introRenderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    introRenderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    introRenderer.outputColorSpace =
        THREE.SRGBColorSpace;


    /* Lighting */

    const ambient =
        new THREE.AmbientLight(
            0x77ccff,
            1.5
        );

    introScene.add(
        ambient
    );


    const keyLight =
        new THREE.DirectionalLight(
            0x66ddff,
            4
        );

    keyLight.position.set(
        5,
        12,
        8
    );

    introScene.add(
        keyLight
    );


    const rimLight =
        new THREE.PointLight(
            0x7755ff,
            18,
            30
        );

    rimLight.position.set(
        -6,
        5,
        -5
    );

    introScene.add(
        rimLight
    );


    /* Building */

    buildingGroup =
        new THREE.Group();

    introScene.add(
        buildingGroup
    );


    createConstructionBuilding();

    createConstructionGrid();

    createConstructionParticles();

    renderIntro();

}

createIntroScene();


/* =========================================================
   BUILDING
========================================================= */

function createConstructionBuilding(){

    const material =
        new THREE.MeshStandardMaterial({

            color:0x102536,

            metalness:.8,

            roughness:.25,

            emissive:0x062b42,

            emissiveIntensity:.6

        });


    const glassMaterial =
        new THREE.MeshStandardMaterial({

            color:0x174c66,

            metalness:.9,

            roughness:.12,

            transparent:true,

            opacity:.8,

            emissive:0x0c536f,

            emissiveIntensity:.8

        });


    const floors = 9;


    for(let i = 0; i < floors; i++){

        const width =
            2.8 -
            i * .12;

        const depth =
            2.5 -
            i * .08;

        const height =
            .65;

        const geometry =
            new THREE.BoxGeometry(
                width,
                height,
                depth
            );

        const materialToUse =
            i % 2 === 0
                ? material
                : glassMaterial;

        const mesh =
            new THREE.Mesh(
                geometry,
                materialToUse
            );

        mesh.position.y =
            i * .72;

        mesh.userData.targetY =
            mesh.position.y;

        mesh.position.y -= 8;

        mesh.scale.set(
            .05,
            .05,
            .05
        );

        mesh.rotation.y =
            random(-.8,.8);

        mesh.userData.targetRotation =
            mesh.rotation.y;

        mesh.userData.index =
            i;

        buildingGroup.add(
            mesh
        );


        /* vertical energy line */

        const lineGeometry =
            new THREE.BoxGeometry(
                .035,
                height * 1.3,
                .035
            );

        const lineMaterial =
            new THREE.MeshBasicMaterial({
                color:0x33d6ff
            });

        const line =
            new THREE.Mesh(
                lineGeometry,
                lineMaterial
            );

        line.position.set(
            width / 2,
            mesh.userData.targetY,
            depth / 2
        );

        line.scale.y = .01;

        line.userData.targetY =
            mesh.userData.targetY;

        buildingGroup.add(
            line
        );

    }

}


/* =========================================================
   CONSTRUCTION GRID
========================================================= */

function createConstructionGrid(){

    const grid =
        new THREE.GridHelper(
            35,
            35,
            0x33d6ff,
            0x173247
        );

    grid.position.y =
        -3.3;

    grid.material.transparent =
        true;

    grid.material.opacity =
        .22;

    introScene.add(
        grid
    );

}


/* =========================================================
   CONSTRUCTION PARTICLES
========================================================= */

let constructionParticles;


function createConstructionParticles(){

    const count = 700;

    const positions =
        new Float32Array(
            count * 3
        );

    for(let i = 0; i < count; i++){

        positions[i * 3] =
            random(-10,10);

        positions[i * 3 + 1] =
            random(-5,10);

        positions[i * 3 + 2] =
            random(-10,10);

    }


    const geometry =
        new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            color:0x55ddff,

            size:.025,

            transparent:true,

            opacity:.8,

            blending:
                THREE.AdditiveBlending

        });


    constructionParticles =
        new THREE.Points(
            geometry,
            material
        );

    introScene.add(
        constructionParticles
    );

}


/* =========================================================
   INTRO RENDER LOOP
========================================================= */

function renderIntro(){

    if(!introRenderer)
        return;

    introAnimationFrame =
        requestAnimationFrame(
            renderIntro
        );


    state.time += .01;


    /* building */

    if(buildingGroup){

        buildingGroup.rotation.y =
            Math.sin(
                state.time * .35
            ) * .08;

        buildingGroup.rotation.x =
            Math.sin(
                state.time * .22
            ) * .025;

    }


    /* particles */

    if(constructionParticles){

        constructionParticles.rotation.y =
            state.time * .015;

    }


    /* camera movement */

    const cameraTargetX =
        9 +
        state.normalizedX * 2;

    const cameraTargetY =
        7 +
        state.normalizedY * 1.5;

    introCamera.position.x =
        lerp(
            introCamera.position.x,
            cameraTargetX,
            .025
        );

    introCamera.position.y =
        lerp(
            introCamera.position.y,
            cameraTargetY,
            .025
        );

    introCamera.lookAt(
        0,
        2,
        0
    );


    introRenderer.render(
        introScene,
        introCamera
    );

}


/* =========================================================
   CONSTRUCTION SEQUENCE
========================================================= */

function startConstruction(){

    if(!buildingGroup)
        return;

    const pieces =
        buildingGroup.children.filter(
            object =>
                object.userData &&
                object.userData.index !== undefined
        );

    const duration = 2.8;

    pieces.forEach(
        (piece,index) => {

            gsap.to(
                piece.position,
                {
                    y:
                        piece.userData.targetY,

                    duration:.7,

                    delay:
                        index * .14,

                    ease:
                        "back.out(1.7)"
                }
            );

            gsap.to(
                piece.rotation,
                {
                    y:
                        piece.userData.targetRotation,

                    duration:1,

                    delay:
                        index * .14,

                    ease:
                        "power3.out"
                }
            );

            gsap.to(
                piece.scale,
                {
                    x:1,
                    y:1,
                    z:1,

                    duration:.65,

                    delay:
                        index * .14,

                    ease:
                        "back.out(2)"
                }
            );

        }
    );


    gsap.to(
        { value:0 },
        {
            value:100,

            duration,

            ease:"power2.inOut",

            onUpdate:function(){

                constructionProgress =
                    this.targets()[0].value;

                if(progressBar){

                    progressBar.style.width =
                        `${constructionProgress}%`;

                }

                if(loadingText){

                    if(constructionProgress < 25){

                        loadingText.textContent =
                            "GENERATING FOUNDATION";

                    }
                    else if(constructionProgress < 50){

                        loadingText.textContent =
                            "ASSEMBLING STRUCTURE";

                    }
                    else if(constructionProgress < 75){

                        loadingText.textContent =
                            "CALIBRATING ENERGY GRID";

                    }
                    else if(constructionProgress < 95){

                        loadingText.textContent =
                            "INITIALIZING CITY SYSTEM";

                    }
                    else{

                        loadingText.textContent =
                            "SYSTEM ONLINE";

                    }

                }

            },

            onComplete(){

                finishIntro();

            }

        }
    );

}


/* =========================================================
   FINISH INTRO
========================================================= */

function finishIntro(){

    if(state.introFinished)
        return;

    state.introFinished =
        true;

    const timeline =
        gsap.timeline();

    timeline.to(
        ".loader-center",
        {
            opacity:0,
            y:-30,
            duration:.5,
            ease:"power3.in"
        }
    );

    timeline.to(
        loader,
        {
            clipPath:
                "polygon(0 0, 100% 0, 100% 0, 0 0)",
            duration:1.1,
            ease:"power4.inOut",

            onComplete(){

                loader.style.display =
                    "none";

                if(introAnimationFrame){

                    cancelAnimationFrame(
                        introAnimationFrame
                    );

                }

                heroEntry();

            }

        },
        "-=.15"
    );

}


/* =========================================================
   SKIP INTRO
========================================================= */

if(skipIntro){

    skipIntro.addEventListener(
        "click",
        () => {

            finishIntro();

        }
    );

}


/* =========================================================
   START INTRO AFTER DOM READY
========================================================= */

function bootIntro(){

    if(!loader){

        return;

    }

    gsap.fromTo(
        ".loader-title",
        {
            opacity:0,
            y:30,
            letterSpacing:"20px"
        },
        {
            opacity:1,
            y:0,
            letterSpacing:"8px",
            duration:1.2,
            ease:"power4.out"
        }
    );


    gsap.delayedCall(
        .7,
        () => {

            startConstruction();

        }
    );

}

bootIntro();


/* =========================================================
   THREE RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if(
            !introCamera ||
            !introRenderer
        ){

            return;

        }

        introCamera.aspect =
            window.innerWidth /
            window.innerHeight;

        introCamera.updateProjectionMatrix();

        introRenderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

window.addEventListener(
    "keydown",
    event => {

        if(
            event.key === "Escape" &&
            !state.introFinished
        ){

            finishIntro();

        }

    }
);


/* =========================================================
   VISIBILITY OPTIMIZATION
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if(
            document.hidden
        ){

            document.body.classList.add(
                "page-hidden"
            );

        }
        else{

            document.body.classList.remove(
                "page-hidden"
            );

        }

    }
);


/* =========================================================
   FINAL BOOT
========================================================= */

console.log(
    "%cSHIN ENDFIELD // SYSTEM ONLINE",
    "color:#33d6ff;font-size:16px;font-weight:bold;"
);

console.log(
    "%cInteractive portfolio engine initialized.",
    "color:#94a3b8;font-size:11px;"
);
