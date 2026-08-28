/* =========================================================
   SHIN ENDFIELD
   INTERACTIVE PORTFOLIO ENGINE
   PART 4 — AUDIO / MINI GAME / SPECIAL FX
========================================================= */


/* =========================================================
   AUDIO ENGINE
   Web Audio API
========================================================= */

const AudioEngine = {

    context: null,
    master: null,
    ambience: null,
    enabled: false,

    init(){

        if(this.context)
            return;

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if(!AudioContext)
            return;

        this.context =
            new AudioContext();

        this.master =
            this.context.createGain();

        this.master.gain.value =
            .045;

        this.master.connect(
            this.context.destination
        );

        this.enabled = true;

        this.createAmbient();

    },


    resume(){

        if(!this.context)
            this.init();

        if(
            this.context &&
            this.context.state === "suspended"
        ){

            this.context.resume();

        }

    },


    tone(
        frequency = 440,
        duration = .08,
        type = "sine",
        volume = .035
    ){

        if(!this.context)
            return;

        const now =
            this.context.currentTime;

        const oscillator =
            this.context.createOscillator();

        const gain =
            this.context.createGain();

        oscillator.type =
            type;

        oscillator.frequency.setValueAtTime(
            frequency,
            now
        );

        gain.gain.setValueAtTime(
            0.0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            volume,
            now + .01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + duration
        );

        oscillator.connect(gain);
        gain.connect(this.master);

        oscillator.start(now);
        oscillator.stop(
            now + duration + .02
        );

    },


    sweep(){

        if(!this.context)
            return;

        const now =
            this.context.currentTime;

        const oscillator =
            this.context.createOscillator();

        const gain =
            this.context.createGain();

        oscillator.type =
            "sawtooth";

        oscillator.frequency.setValueAtTime(
            100,
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            900,
            now + .35
        );

        gain.gain.setValueAtTime(
            .0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            .035,
            now + .03
        );

        gain.gain.exponentialRampToValueAtTime(
            .0001,
            now + .4
        );

        oscillator.connect(gain);
        gain.connect(this.master);

        oscillator.start(now);
        oscillator.stop(now + .42);

    },


    click(){

        this.tone(
            680,
            .045,
            "square",
            .025
        );

        this.tone(
            1100,
            .065,
            "sine",
            .012
        );

    },


    hover(){

        this.tone(
            420,
            .055,
            "sine",
            .012
        );

    },


    success(){

        this.tone(
            520,
            .12,
            "sine",
            .025
        );

        setTimeout(
            () =>
                this.tone(
                    780,
                    .18,
                    "sine",
                    .03
                ),
            70
        );

        setTimeout(
            () =>
                this.tone(
                    1040,
                    .25,
                    "sine",
                    .035
                ),
            150
        );

    },


    error(){

        this.tone(
            180,
            .2,
            "sawtooth",
            .025
        );

        this.tone(
            130,
            .25,
            "square",
            .012
        );

    },


    createAmbient(){

        if(!this.context)
            return;

        const oscillator =
            this.context.createOscillator();

        const gain =
            this.context.createGain();

        oscillator.type =
            "sine";

        oscillator.frequency.value =
            48;

        gain.gain.value =
            .006;

        oscillator.connect(gain);
        gain.connect(this.master);

        oscillator.start();

        this.ambience =
            oscillator;

    }

};


/* =========================================================
   AUDIO UNLOCK
========================================================= */

function unlockAudio(){

    AudioEngine.init();

    AudioEngine.resume();

    state.audioEnabled =
        true;

    document.documentElement.classList.add(
        "audio-enabled"
    );

}

window.addEventListener(
    "pointerdown",
    unlockAudio,
    {
        once:true,
        passive:true
    }
);

window.addEventListener(
    "keydown",
    unlockAudio,
    {
        once:true
    }
);


/* =========================================================
   UI AUDIO
========================================================= */

function setupUIAudio(){

    const interactive =
        $$(
            "button, a, .hero-button, .launch-button, .orb-card, .magnetic"
        );

    interactive.forEach(element => {

        element.addEventListener(
            "mouseenter",
            () => {

                AudioEngine.resume();

                AudioEngine.hover();

            }
        );

        element.addEventListener(
            "click",
            () => {

                AudioEngine.resume();

                AudioEngine.click();

            }
        );

    });

}

setupUIAudio();


/* =========================================================
   SOUND TOGGLE
========================================================= */

function createSoundToggle(){

    if(
        document.querySelector(
            ".sound-toggle"
        )
    )
        return;

    const button =
        document.createElement("button");

    button.className =
        "sound-toggle";

    button.type =
        "button";

    button.innerHTML = `
        <span class="sound-bars">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
        </span>
        <span class="sound-label">
            AUDIO
        </span>
    `;

    Object.assign(
        button.style,
        {
            position:"fixed",
            right:"25px",
            bottom:"25px",
            zIndex:"9995",
            display:"flex",
            alignItems:"center",
            gap:"10px",
            padding:"10px 14px",
            background:"rgba(3,8,14,.65)",
            border:"1px solid rgba(51,214,255,.25)",
            color:"rgba(180,235,255,.8)",
            fontFamily:"monospace",
            fontSize:"9px",
            letterSpacing:"3px",
            cursor:"pointer",
            backdropFilter:"blur(12px)"
        }
    );

    document.body.appendChild(
        button
    );


    button.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            unlockAudio();

            AudioEngine.master.gain.value =
                AudioEngine.master.gain.value > 0
                    ? 0
                    : .045;

            button.classList.toggle(
                "muted"
            );

        }
    );

}

createSoundToggle();


/* =========================================================
   SPECIAL SCREEN EFFECT
========================================================= */

function systemPulse(){

    const pulse =
        document.createElement("div");

    pulse.className =
        "system-pulse";

    Object.assign(
        pulse.style,
        {
            position:"fixed",
            inset:"0",
            pointerEvents:"none",
            zIndex:"9996",
            background:
                "radial-gradient(circle, rgba(51,214,255,.12), transparent 45%)",
            opacity:"0"
        }
    );

    document.body.appendChild(
        pulse
    );

    gsap.to(
        pulse,
        {
            opacity:1,
            duration:.12,
            yoyo:true,
            repeat:1,
            onComplete(){
                pulse.remove();
            }
        }
    );

}


/* =========================================================
   RANDOM AMBIENT FX
========================================================= */

function ambientGlitch(){

    if(
        document.hidden ||
        Math.random() > .55
    ){

        return;

    }

    const elements =
        $$(".glitch");

    if(!elements.length)
        return;

    const target =
        elements[
            Math.floor(
                Math.random() *
                elements.length
            )
        ];

    target.classList.add(
        "forced-glitch"
    );

    setTimeout(
        () =>
            target.classList.remove(
                "forced-glitch"
            ),
        random(100,350)
    );

}

setInterval(
    ambientGlitch,
    3200
);


/* =========================================================
   PARTICLE BURST
========================================================= */

function particleBurst(
    x,
    y,
    amount = 24
){

    for(let i = 0; i < amount; i++){

        const particle =
            document.createElement(
                "span"
            );

        particle.className =
            "burst-particle";

        document.body.appendChild(
            particle
        );

        const angle =
            Math.random() *
            Math.PI *
            2;

        const distance =
            random(40,180);

        const size =
            random(1,4);

        Object.assign(
            particle.style,
            {
                position:"fixed",
                left:`${x}px`,
                top:`${y}px`,
                width:`${size}px`,
                height:`${size}px`,
                borderRadius:"50%",
                background:"#33d6ff",
                boxShadow:
                    "0 0 12px #33d6ff",
                pointerEvents:"none",
                zIndex:"99999"
            }
        );

        gsap.to(
            particle,
            {
                x:
                    Math.cos(angle) *
                    distance,

                y:
                    Math.sin(angle) *
                    distance,

                opacity:0,

                scale:.1,

                duration:
                    random(.5,1),

                ease:"power3.out",

                onComplete(){
                    particle.remove();
                }

            }
        );

    }

}


/* =========================================================
   CLICK BURST
========================================================= */

window.addEventListener(
    "pointerdown",
    event => {

        particleBurst(
            event.clientX,
            event.clientY,
            window.innerWidth < 600
                ? 10
                : 18
        );

    },
    {
        passive:true
    }
);


/* =========================================================
   MINI GAME
   CORE HUNT
========================================================= */

const MiniGame = {

    active:false,

    score:0,

    target:null,

    timer:null,

    timeLeft:20,

    container:null,

    scoreElement:null,

    timerElement:null,


    init(){

        this.createUI();

        this.bind();

    },


    createUI(){

        if(
            document.querySelector(
                "#coreGame"
            )
        ){

            this.container =
                $("#coreGame");

            return;

        }


        const section =
            document.createElement(
                "section"
            );

        section.id =
            "coreGame";

        section.className =
            "core-game";

        section.innerHTML = `

            <div class="core-game-bg"></div>

            <div class="core-game-interface">

                <div class="core-game-header">

                    <span>
                        SYSTEM TRAINING
                    </span>

                    <span>
                        CORE HUNT / 01
                    </span>

                </div>

                <div class="core-game-title">
                    LOCATE THE ENERGY CORE
                </div>

                <div class="core-game-status">

                    <span>
                        SCORE:
                        <strong id="coreScore">
                            0
                        </strong>
                    </span>

                    <span>
                        TIME:
                        <strong id="coreTimer">
                            20
                        </strong>
                    </span>

                </div>

                <div
                    class="core-game-field"
                    id="coreField"
                ></div>

                <button
                    type="button"
                    class="core-game-start"
                    id="coreStart"
                >
                    INITIALIZE TRAINING
                </button>

                <div
                    class="core-game-message"
                    id="coreMessage"
                >
                    SYSTEM STANDBY
                </div>

            </div>
        `;


        const contact =
            $(
                "#contact"
            );

        if(contact){

            contact.before(
                section
            );

        }
        else{

            document.body.appendChild(
                section
            );

        }


        this.container =
            section;

        this.scoreElement =
            $("#coreScore");

        this.timerElement =
            $("#coreTimer");

    },


    bind(){

        const start =
            $("#coreStart");

        if(!start)
            return;

        start.addEventListener(
            "click",
            () => {

                AudioEngine.resume();

                this.start();

            }
        );

    },


    start(){

        if(this.active)
            return;

        this.active = true;

        this.score = 0;

        this.timeLeft = 20;

        this.updateUI();

        const field =
            $("#coreField");

        if(!field)
            return;

        field.innerHTML = "";

        const button =
            $("#coreStart");

        button.textContent =
            "TRAINING ACTIVE";

        button.disabled =
            true;

        this.spawnCore();

        this.timer =
            setInterval(
                () => {

                    this.timeLeft--;

                    this.updateUI();

                    if(
                        this.timeLeft <= 0
                    ){

                        this.end();

                    }

                },
                1000
            );

        systemPulse();

    },


    spawnCore(){

        const field =
            $("#coreField");

        if(!field)
            return;

        if(this.target)
            this.target.remove();

        const core =
            document.createElement(
                "button"
            );

        core.type =
            "button";

        core.className =
            "energy-core";

        core.setAttribute(
            "aria-label",
            "Energy Core"
        );

        const rect =
            field.getBoundingClientRect();

        const size = 38;

        const x =
            random(
                5,
                Math.max(
                    10,
                    95 - (size / rect.width * 100)
                )
            );

        const y =
            random(
                8,
                90
            );

        core.style.left =
            `${x}%`;

        core.style.top =
            `${y}%`;


        core.innerHTML = `
            <span></span>
            <i></i>
        `;


        field.appendChild(
            core
        );

        this.target =
            core;


        core.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                this.score++;

                AudioEngine.success();

                particleBurst(
                    event.clientX,
                    event.clientY,
                    28
                );

                systemPulse();

                this.updateUI();

                this.spawnCore();

            }
        );


        gsap.fromTo(
            core,
            {
                scale:0,
                opacity:0
            },
            {
                scale:1,
                opacity:1,
                duration:.35,
                ease:"back.out(2)"
            }
        );

    },


    updateUI(){

        if(this.scoreElement){

            this.scoreElement.textContent =
                this.score;

        }

        if(this.timerElement){

            this.timerElement.textContent =
                this.timeLeft;

        }

    },


    end(){

        clearInterval(
            this.timer
        );

        this.timer =
            null;

        this.active =
            false;

        if(this.target){

            this.target.remove();

            this.target =
                null;

        }

        const button =
            $("#coreStart");

        const message =
            $("#coreMessage");

        if(button){

            button.disabled =
                false;

            button.textContent =
                "RESTART TRAINING";

        }

        if(message){

            message.textContent =
                `TRAINING COMPLETE // SCORE ${this.score}`;

        }

        if(this.score >= 10){

            AudioEngine.success();

            systemPulse();

        }
        else{

            AudioEngine.error();

        }

    }

};

MiniGame.init();


/* =========================================================
   GAME CSS
========================================================= */

const gameStyle =
document.createElement("style");

gameStyle.textContent = `

.core-game{

    position:relative;

    min-height:720px;

    overflow:hidden;

    background:
        radial-gradient(
            circle at center,
            rgba(51,214,255,.08),
            transparent 45%
        ),
        #02060b;

    border-top:
        1px solid rgba(51,214,255,.12);

    border-bottom:
        1px solid rgba(51,214,255,.12);

}

.core-game-bg{

    position:absolute;

    inset:0;

    background:

        linear-gradient(
            rgba(51,214,255,.035) 1px,
            transparent 1px
        ),

        linear-gradient(
            90deg,
            rgba(51,214,255,.035) 1px,
            transparent 1px
        );

    background-size:
        55px 55px;

    animation:
        gameGridMove 10s linear infinite;

}

@keyframes gameGridMove{

    to{
        background-position:
            55px 55px;
    }

}

.core-game-interface{

    position:relative;

    z-index:2;

    width:
        min(1100px, 90%);

    margin:auto;

    padding:
        100px 0;

}

.core-game-header{

    display:flex;

    justify-content:space-between;

    font-family:monospace;

    font-size:9px;

    letter-spacing:3px;

    color:
        rgba(150,225,255,.5);

}

.core-game-title{

    margin-top:30px;

    font-size:
        clamp(28px, 5vw, 70px);

    font-weight:800;

    letter-spacing:
        -.04em;

}

.core-game-status{

    display:flex;

    gap:35px;

    margin-top:20px;

    font-family:monospace;

    font-size:10px;

    letter-spacing:2px;

    color:
        rgba(255,255,255,.5);

}

.core-game-status strong{

    color:#33d6ff;

}

.core-game-field{

    position:relative;

    height:380px;

    margin-top:45px;

    overflow:hidden;

    border:
        1px solid rgba(51,214,255,.16);

    background:
        rgba(2,8,14,.65);

}

.energy-core{

    position:absolute;

    width:38px;

    height:38px;

    padding:0;

    border:0;

    background:transparent;

    cursor:pointer;

    transform:
        translate(-50%,-50%);

}

.energy-core span{

    position:absolute;

    inset:7px;

    border-radius:50%;

    background:#33d6ff;

    box-shadow:
        0 0 10px #33d6ff,
        0 0 30px #33d6ff,
        0 0 60px rgba(51,214,255,.7);

    animation:
        corePulse .8s ease-in-out infinite;

}

.energy-core i{

    position:absolute;

    inset:0;

    border:
        1px solid #33d6ff;

    border-radius:50%;

    animation:
        coreSpin 2s linear infinite;

}

@keyframes corePulse{

    50%{
        transform:scale(.65);
    }

}

@keyframes coreSpin{

    to{
        transform:
            rotate(360deg)
            scale(1.25);
    }

}

.core-game-start{

    margin-top:25px;

    padding:15px 25px;

    background:
        rgba(51,214,255,.06);

    border:
        1px solid rgba(51,214,255,.4);

    color:#b9edff;

    font-family:monospace;

    font-size:10px;

    letter-spacing:3px;

    cursor:pointer;

    transition:
        .3s ease;

}

.core-game-start:hover{

    background:
        rgba(51,214,255,.16);

    box-shadow:
        0 0 30px rgba(51,214,255,.18);

}

.core-game-start:disabled{

    opacity:.5;

    cursor:default;

}

.core-game-message{

    margin-top:18px;

    font-family:monospace;

    font-size:9px;

    letter-spacing:2px;

    color:
        rgba(255,255,255,.35);

}

.sound-bars{

    display:flex;

    align-items:center;

    gap:2px;

    height:12px;

}

.sound-bars i{

    display:block;

    width:2px;

    height:7px;

    background:#33d6ff;

    animation:
        soundBar .8s ease-in-out infinite;

}

.sound-bars i:nth-child(2){

    animation-delay:.15s;

}

.sound-bars i:nth-child(3){

    animation-delay:.3s;

}

.sound-bars i:nth-child(4){

    animation-delay:.45s;

}

.sound-toggle.muted .sound-bars i{

    animation:none;

    height:2px;

}

@keyframes soundBar{

    50%{
        height:12px;
    }

}

.forced-glitch::before{

    opacity:.8 !important;

    animation:
        glitchTop .15s steps(2) infinite !important;

}

.forced-glitch::after{

    opacity:.8 !important;

    animation:
        glitchBottom .12s steps(2) infinite !important;

}

@media(max-width:600px){

    .core-game{

        min-height:650px;

    }

    .core-game-interface{

        padding:70px 0;

    }

    .core-game-field{

        height:330px;

    }

    .core-game-header{

        flex-direction:column;

        gap:8px;

    }

    .sound-toggle{

        right:12px !important;

        bottom:12px !important;

    }

}

`;

document.head.appendChild(
    gameStyle
);


/* =========================================================
   RANDOM ENERGY NODES
========================================================= */

function createEnergyNodes(){

    const sections =
        $$(".panel");

    sections.forEach(
        section => {

            const amount =
                window.innerWidth < 600
                    ? 2
                    : 4;

            for(
                let i = 0;
                i < amount;
                i++
            ){

                const node =
                    document.createElement(
                        "span"
                    );

                node.className =
                    "energy-node";

                node.style.left =
                    `${random(5,95)}%`;

                node.style.top =
                    `${random(10,90)}%`;

                node.style.animationDelay =
                    `${random(-4,0)}s`;

                section.appendChild(
                    node
                );

            }

        }
    );

}

createEnergyNodes();


/* =========================================================
   ENERGY NODE CSS
========================================================= */

const nodeStyle =
document.createElement("style");

nodeStyle.textContent = `

.energy-node{

    position:absolute;

    width:3px;

    height:3px;

    border-radius:50%;

    background:#33d6ff;

    box-shadow:
        0 0 8px #33d6ff,
        0 0 20px rgba(51,214,255,.5);

    pointer-events:auto;

    animation:
        nodeFloat 3s ease-in-out infinite;

    cursor:pointer;

}

.energy-node::before{

    content:"";

    position:absolute;

    inset:-8px;

    border:
        1px solid rgba(51,214,255,.2);

    border-radius:50%;

    animation:
        nodeRing 2s linear infinite;

}

@keyframes nodeFloat{

    0%,
    100%{

        transform:
            translateY(0)
            scale(1);

    }

    50%{

        transform:
            translateY(-15px)
            scale(1.5);

    }

}

@keyframes nodeRing{

    to{

        transform:
            rotate(360deg)
            scale(1.5);

        opacity:0;

    }

}

`;

document.head.appendChild(
    nodeStyle
);


/* =========================================================
   NODE INTERACTION
========================================================= */

$$(".energy-node").forEach(
    node => {

        node.addEventListener(
            "mouseenter",
            () => {

                AudioEngine.hover();

                gsap.to(
                    node,
                    {
                        scale:4,
                        duration:.2
                    }
                );

            }
        );

        node.addEventListener(
            "mouseleave",
            () => {

                gsap.to(
                    node,
                    {
                        scale:1,
                        duration:.3
                    }
                );

            }
        );

        node.addEventListener(
            "click",
            event => {

                AudioEngine.success();

                particleBurst(
                    event.clientX,
                    event.clientY,
                    14
                );

                node.remove();

            }
        );

    }
);


/* =========================================================
   KONAMI / SECRET INTERACTION
========================================================= */

const secretSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight"
];

let secretInput = [];

window.addEventListener(
    "keydown",
    event => {

        secretInput.push(
            event.key
        );

        if(
            secretInput.length >
            secretSequence.length
        ){

            secretInput.shift();

        }

        const matched =
            secretSequence.every(
                (key,index) =>
                    secretInput[index] === key
            );

        if(matched){

            secretInput = [];

            activateSecretMode();

        }

    }
);


/* =========================================================
   SECRET MODE
========================================================= */

function activateSecretMode(){

    document.body.classList.add(
        "secret-mode"
    );

    AudioEngine.success();

    systemPulse();

    $$("body *").forEach(
        element => {

            if(
                element.children.length === 0 &&
                element.textContent.trim()
            ){

                element.dataset.originalText =
                    element.textContent;

                element.textContent =
                    scrambleText(
                        element.textContent
                    );

            }

        }
    );

    setTimeout(
        () => {

            document.body.classList.remove(
                "secret-mode"
            );

        },
        5000
    );

}


/* =========================================================
   TEXT SCRAMBLE
========================================================= */

function scrambleText(text){

    const chars =
        "01XZ#$%<>";

    return text
        .split("")
        .map(
            char =>
                char === " "
                    ? " "
                    : chars[
                        Math.floor(
                            Math.random() *
                            chars.length
                        )
                    ]
        )
        .join("");

}


/* =========================================================
   MOUSE DISTORTION
========================================================= */

function mouseDistortion(){

    const intensity =
        clamp(
            Math.abs(
                state.normalizedX
            ) * .8,
            0,
            1
        );

    document.documentElement.style.setProperty(
        "--mouse-intensity",
        intensity
    );

    requestAnimationFrame(
        mouseDistortion
    );

}

mouseDistortion();


/* =========================================================
   SYSTEM HEARTBEAT
========================================================= */

setInterval(
    () => {

        if(
            document.hidden
        )
            return;

        const pulse =
            document.documentElement;

        pulse.style.setProperty(
            "--heartbeat",
            "1"
        );

        setTimeout(
            () => {

                pulse.style.setProperty(
                    "--heartbeat",
                    "0"
                );

            },
            100

        );

    },
    2400
);


/* =========================================================
   FINAL
========================================================= */

console.log(
    "%cAUDIO ENGINE: READY",
    "color:#33d6ff"
);

console.log(
    "%cCORE HUNT: READY",
    "color:#33d6ff"
);

console.log(
    "%cSPECIAL INTERACTIONS: READY",
    "color:#33d6ff"
);
