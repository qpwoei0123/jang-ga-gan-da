"use client";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { speechFlight } from "./ddui-speech-motion";
import confetti from "canvas-confetti";
import { useJellyTouch } from "./use-jelly-touch";
import { useAssetsReady } from "./asset-loader";
import WeddingSong from "./wedding-song";

export default function GalleryDdui() {
  const ready=useAssetsReady();
  const button=useRef<HTMLButtonElement>(null), follower=useRef<HTMLDivElement>(null);
  const celebrated=useRef(false);
  useJellyTouch(button);
  const [visible,setVisible]=useState(false);
  const [words,setWords]=useState<{id:number;text:string;flight:CSSProperties}[]>([]);
  const serial=useRef(0);
  const say=useCallback((text:string)=>setWords([{id:++serial.current,text,flight:speechFlight()}]),[]);
  useEffect(()=>{
    if(!ready || !follower.current)return;
    const node=follower.current, root=document.querySelector<HTMLElement>('.wedding-site')!;
    const paper=root.querySelector<HTMLElement>('.edition')!;
    const finale=root.querySelector<HTMLElement>('#details')!;
    const modal=root.querySelector<HTMLDialogElement>('dialog')!;
    const reduced=matchMedia('(prefers-reduced-motion:reduce)');
    let x=innerWidth+70,y=scrollY+innerHeight*.7,tx=x,ty=y,frame=0,last=0,finish=false;
    const update=(time:number)=>{
      frame=0;
      const dt=last?Math.min(time-last,40):16;last=time;
      const ease=reduced.matches?1:1-Math.exp(-dt/240);
      x+=(tx-x)*ease;y+=(ty-y)*ease;
      node.style.transform=`translate3d(${x}px,${y}px,0)`;
      if(Math.abs(tx-x)+Math.abs(ty-y)>.25)frame=requestAnimationFrame(update);else last=0;
    };
    const sync=()=>{
      const p=paper.getBoundingClientRect(),f=finale.getBoundingClientRect(),r=root.getBoundingClientRect();
      const g=root.querySelector('.heart-puzzle')!.getBoundingClientRect();
      const edge=g.top<innerHeight*.7+66 && g.bottom>innerHeight*.7?Math.max(p.right,g.right):p.right;
      finish=f.top<innerHeight*.62 && f.bottom>innerHeight*.25;
      const hidden=modal.open || document.hidden;
      node.dataset.hidden=String(hidden);
      node.inert=hidden;node.setAttribute('aria-hidden',String(hidden));
      node.dataset.finale=String(finish);
      tx=finish?Math.min(innerWidth-76,f.right-64):Math.min(innerWidth-58,edge-23);
      ty=finish?Math.min(f.top+110,innerHeight-100)-r.top:innerHeight*.7-r.top;
      ty=Math.max(20,Math.min(root.offsetHeight-90,ty));
      if(!frame && !hidden)frame=requestAnimationFrame(update);
      if(finish && !celebrated.current && !hidden){
        celebrated.current=true;
        say('형누나, 결혼 축하해요!');
        void confetti({particleCount:90,spread:85,startVelocity:32,origin:{x:Math.min(.95,(tx+32)/innerWidth),y:.72},colors:['#d7b889','#ebd8b5','#bca8a0','#f1e8d9'],disableForReducedMotion:true,zIndex:100});
      }
    };
    setVisible(true);sync();
    const observer=new MutationObserver(sync);observer.observe(modal,{attributes:true,attributeFilter:['open']});
    window.addEventListener('scroll',sync,{passive:true});window.addEventListener('resize',sync);
    document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',sync);window.removeEventListener('resize',sync);document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);};
  },[ready,say]);
  const touch=()=>{const lines=['헤헤, 간지러워요!','같이 보고 있어요~','저도 신나요!'];say(lines[Math.floor(Math.random()*lines.length)]);};
  return <div ref={follower} className="gallery-curator ddui-companion" data-visible={visible}>
    <WeddingSong/>
    <div className="ddui-words" aria-live="polite">
      {words.map(word=><p key={word.id} className="ddui-flying-word" style={word.flight} onAnimationEnd={event=>{if(event.target===event.currentTarget)setWords(previous=>previous.filter(item=>item.id!==word.id));}}><span className="ddui-speech-sway">{word.text}</span></p>)}
    </div>
    <div className="ddui-peek"><button ref={button} className="curator-dog" type="button" aria-label="뚜이 쓰다듬기" onClick={touch}><img src="/history/ddui.webp" alt="" width="64" height="64"/></button></div>
  </div>;
}
