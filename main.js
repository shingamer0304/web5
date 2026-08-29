(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;

/* background particles */
const dust=$('#dust');
if(dust&&!reduce){for(let i=0;i<(innerWidth<700?24:60);i++){const p=document.createElement('i');p.className='dust';p.style.left=Math.random()*100+'%';p.style.top=Math.random()*100+'%';p.style.opacity=.15+Math.random()*.65;p.style.animation=`drift ${6+Math.random()*14}s linear ${-Math.random()*15}s infinite`;dust.appendChild(p)}}
const sheet=document.createElement('style');sheet.textContent='@keyframes drift{0%{transform:translate3d(0,110vh,0) scale(.2)}100%{transform:translate3d('+ (Math.random()*160-80)+'px,-20vh,0) scale(1.4)}}';document.head.appendChild(sheet);

/* cinematic construction intro: CSS buildings + canvas particles */
const boot=$('#boot'),canvas=$('#buildCanvas'),ctx=canvas?.getContext('2d'),bar=$('#bootBar'),pct=$('#bootPct'),line=$('#bootLine');
let skip=false;
function resize(){if(canvas){canvas.width=innerWidth;canvas.height=innerHeight}}resize();addEventListener('resize',resize);
if(canvas&&!reduce){let stars=Array.from({length:90},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,z:Math.random()}));function draw(){if(!ctx||skip)return;ctx.clearRect(0,0,innerWidth,innerHeight);stars.forEach(s=>{s.y-=.35+s.z*.8;if(s.y<0)s.y=innerHeight;ctx.fillStyle=`rgba(255,212,0,${.15+s.z*.6})`;ctx.fillRect(s.x,s.y,1+s.z*2,1+s.z*2)});requestAnimationFrame(draw)}draw();}
function finishBoot(){skip=true;boot?.classList.add('done');document.body.style.overflow='';}
document.body.style.overflow='hidden';
let progress=0;const messages=['INITIALIZING INDUSTRIAL NODE...','ASSEMBLING STRUCTURAL GEOMETRY...','CALIBRATING HOLOGRAPHIC GRID...','CONNECTING OPERATOR PROFILE...','TACTICAL INTERFACE READY.'];
if(boot&&!reduce){const timer=setInterval(()=>{progress+=Math.random()*10+5;if(progress>=100){progress=100;clearInterval(timer);setTimeout(finishBoot,500)}bar&&(bar.style.width=progress+'%');pct&&(pct.textContent=String(Math.floor(progress)).padStart(2,'0')+'%');line&&(line.textContent=messages[Math.min(messages.length-1,Math.floor(progress/22))]);},180)}else if(boot){bar&&(bar.style.width='100%');setTimeout(finishBoot,400)}
$('#skip')?.addEventListener('click',finishBoot);

/* cursor */
const cursor=$('#cursor');let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
if(fine&&cursor){addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY});function loop(){cx+=(mx-cx)*.18;cy+=(my-cy)*.18;cursor.style.left=cx+'px';cursor.style.top=cy+'px';requestAnimationFrame(loop)}loop();$$('a,button,.project,.node,.contact-card,.tilt').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('hot'));el.addEventListener('mouseleave',()=>cursor.classList.remove('hot'))})}

/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -7% 0px'});$$('.reveal').forEach(e=>io.observe(e));

/* header state */
const header=$('header');addEventListener('scroll',()=>header?.classList.toggle('scrolled',scrollY>40),{passive:true});

/* reactive project light + tilt */
$$('.tilt,.project,.contact-card').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;el.style.setProperty('--x',x*100+'%');el.style.setProperty('--y',y*100+'%');if(fine)el.style.transform=`perspective(900px) rotateX(${(0.5-y)*7}deg) rotateY(${(x-.5)*7}deg) translateY(-8px)`});el.addEventListener('pointerleave',()=>el.style.transform='')});

/* magnetic buttons */
if(fine)$$('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-(r.left+r.width/2))*.12}px,${(e.clientY-(r.top+r.height/2))*.12}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')});

/* decrypt headings */
const glyph='01XZ#$%<>[]';$$('.decrypt').forEach(el=>{const original=el.textContent;let done=false;const d=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!done){done=true;let n=0;const t=setInterval(()=>{el.textContent=original.split('').map((c,i)=>i<n?c:c===' '?' ':glyph[Math.floor(Math.random()*glyph.length)]).join('');n++;if(n>original.length){clearInterval(t);el.textContent=original}},28);d.disconnect()}}),{threshold:.5});d.observe(el)});

/* audio feedback with WebAudio, activated by user interaction */
let audio;
function tone(f=600,d=.035,type='square',gain=.012){try{audio??=new AudioContext();const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(gain,audio.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+d);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+d)}catch{}}
$$('a,button,.node,.project').forEach(e=>e.addEventListener('mouseenter',()=>tone(720,.025)));$$('button,.btn').forEach(e=>e.addEventListener('click',()=>tone(180,.06,'sawtooth',.018)));

/* mode switch */
const mode=$('#mode');let emergency=false;mode?.addEventListener('click',()=>{emergency=!emergency;document.documentElement.style.setProperty('--y',emergency?'#ff5268':'#ffd400');document.documentElement.style.setProperty('--cyan',emergency?'#ff9a54':'#56dfff');mode.textContent=emergency?'EMERGENCY OVERRIDE':'NORMAL MODE';tone(emergency?140:700,.12,'sawtooth',.02)});

/* skill tree */
const skills={CORE:['CORE','Creative Technology / Interactive Thinking / Experimentation','85%'],WEB:['WEB','HTML / CSS / JavaScript / Responsive Interface','82%'],DESIGN:['DESIGN','Tactical UI / Motion / Visual Systems','90%'],GAME:['GAME','Game Systems / Interaction / Player Experience','72%'],AI:['AI','AI Tools / Creative Experiments / Automation','68%']};
$$('.node').forEach(n=>n.addEventListener('click',()=>{const d=skills[n.dataset.skill]||skills.CORE;$$('.node').forEach(x=>x.classList.remove('active'));n.classList.add('active');$('#skillTitle').textContent=d[0];$('#skillText').textContent=d[1];$('#skillMeter').style.width=d[2];$('#skillStatus').textContent='ACTIVE';tone(900,.06)}));

/* project classified modal */
const modal=$('#modal'),mt=$('#modalTitle'),md=$('#modalDesc');$$('.project').forEach(p=>p.addEventListener('click',()=>{mt.textContent=p.dataset.title;md.textContent=p.dataset.desc;modal.classList.add('open');tone(500,.08)}));$('#close')?.addEventListener('click',()=>modal.classList.remove('open'));modal?.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});addEventListener('keydown',e=>{if(e.key==='Escape')modal?.classList.remove('open')});

/* target acquisition mini-game */
const game=$('#game'),target=$('#target'),start=$('#start'),score=$('#score'),time=$('#time');let playing=false,points=0,seconds=20,timer;
function spawn(){if(!game||!target)return;const pad=30;target.style.left=(pad+Math.random()*(game.clientWidth-pad*2-55))+'px';target.style.top=(80+Math.random()*(game.clientHeight-140))+'px';target.style.display='block'}
start?.addEventListener('click',()=>{if(playing)return;playing=true;points=0;seconds=20;score.textContent='00';time.textContent='20';game.classList.add('active');spawn();tone(950,.1);clearInterval(timer);timer=setInterval(()=>{seconds--;time.textContent=String(seconds).padStart(2,'0');if(seconds<=0){clearInterval(timer);playing=false;target.style.display='none';game.classList.remove('active');$('#gameHint').textContent=`CALIBRATION COMPLETE // SCORE ${String(points).padStart(2,'0')}`}},1000)});target?.addEventListener('click',e=>{e.stopPropagation();if(!playing)return;points++;score.textContent=String(points).padStart(2,'0');tone(1100,.025);spawn()});

/* click pulse */
addEventListener('pointerdown',e=>{const w=document.createElement('i');w.style.cssText=`position:fixed;z-index:999;left:${e.clientX}px;top:${e.clientY}px;width:8px;height:8px;border:1px solid var(--y);border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);animation:pulseClick .55s ease-out forwards`;document.body.appendChild(w);setTimeout(()=>w.remove(),600)});
const pulse=document.createElement('style');pulse.textContent='@keyframes pulseClick{to{width:90px;height:90px;opacity:0}}';document.head.appendChild(pulse);
})();
