(() => {
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

function initBoot(){
  const boot=$("#boot"); if(!boot) return;
  const key="shin_boot_seen";
  if(sessionStorage.getItem(key)){boot.classList.add("done");return}
  const log=$("#bootLog");
  const lines=["INITIALIZING ENDPOINT_OS...","CHECKING IDENTITY NODE...","LOADING OPERATOR PROFILE...","SYNCING ARCHIVE MODULES...","CALIBRATING MOTION SYSTEM...","SIGNAL: STABLE","ACCESS GRANTED."];
  let i=0;
  const tick=()=>{if(i<lines.length){log.innerHTML+=`<div>> ${lines[i++]}</div>`;setTimeout(tick,130)}else{setTimeout(()=>boot.classList.add("done"),500);sessionStorage.setItem(key,"1")}};
  tick();
}
function initReveal(){
  const els=$$(".reveal"); if(!els.length)return;
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");io.unobserve(e.target)}}),{threshold:.12});
  els.forEach(e=>io.observe(e));
}
function initMode(){
 const b=$("#modeBtn");if(!b)return;
 b.addEventListener("click",()=>{document.body.classList.toggle("emergency");b.textContent=document.body.classList.contains("emergency")?"SYSTEM: OVERRIDE":"SYSTEM: ONLINE"});
}
function initProjects(){
 const modal=$("#projectModal");if(!modal)return;
 const title=$("#modalTitle"),text=$("#modalText");
 const data={
  "01":["ENDPOINT UI","ระบบอินเทอร์เฟซพอร์ตโฟลิโอจำลอง เน้น HUD, data panels, navigation และ motion feedback"],
  "02":["TACTICAL HUD","การทดลองออกแบบ visual language แบบ industrial futurism ด้วยเส้น, grid, scanner และ status indicators"],
  "03":["WEB LAB","พื้นที่ทดลองสำหรับ interaction, animation และแนวคิดเว็บที่ตอบสนองต่อการเลื่อนและการชี้เมาส์"]
 };
 $$(".project").forEach(p=>p.addEventListener("click",()=>{const d=data[p.dataset.project];title.textContent=d[0];text.textContent=d[1];modal.classList.add("open")}));
 $("#closeModal")?.addEventListener("click",()=>modal.classList.remove("open"));
 modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open")});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")modal.classList.remove("open")});
 $$(".node").forEach(n=>n.addEventListener("click",()=>{$$(".node").forEach(x=>x.classList.remove("active"));n.classList.add("active");$("#nodeInfo").textContent=`${n.dataset.node} / NODE SELECTED — DATA CHANNEL ONLINE`}));
}
function initTilt(){
 $$(".hero-panel,.feature-card,.portrait,.signal-panel").forEach(el=>{
   el.addEventListener("mousemove",e=>{
     const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
     if(innerWidth>900)el.style.transform=`perspective(900px) rotateX(${y*-2}deg) rotateY(${x*2}deg)`;
   });
   el.addEventListener("mouseleave",()=>el.style.transform="");
 });
}
function initScramble(){
 $$(".scramble,.decrypt").forEach(el=>{
   const final=el.textContent;let t=null;
   el.addEventListener("mouseenter",()=>{let n=0;clearInterval(t);t=setInterval(()=>{el.textContent=final.split("").map((c,i)=>i<n?c:"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%"[Math.floor(Math.random()*39)]).join("");if(n++>final.length){clearInterval(t);el.textContent=final}},35)});
 });
}
initBoot();initReveal();initMode();initProjects();initTilt();initScramble();
})();