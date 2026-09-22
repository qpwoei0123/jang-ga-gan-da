"use client";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { speechFlight } from "./ddui-speech-motion";
import confetti from "canvas-confetti";
import { useJellyTouch } from "./use-jelly-touch";

let celebrated = false;

export default function GalleryDdui({ ready, photo, hidden=false }: { ready:boolean; photo?:string; hidden?:boolean }) {
  const button=useRef<HTMLButtonElement>(null);
  useJellyTouch(button);
  const [visible,setVisible]=useState(false);
  const [words,setWords]=useState<{id:number;text:string;flight:CSSProperties}[]>([]);
  const last=useRef(Date.now()+5000), serial=useRef(0);
  const say=useCallback((text:string,force=false)=>{
    const now=Date.now();
    if(!force && (now-last.current<5500 || document.querySelector(".ddui-music")))return false;
    last.current=now;
    setWords([{id:++serial.current,text,flight:speechFlight()}]);
    return true;
  },[]);
  useEffect(()=>{if(ready){const frame=requestAnimationFrame(()=>setVisible(true));return()=>cancelAnimationFrame(frame);}},[ready]);
  useEffect(()=>{if(photo)say(photo,true);},[photo,say]);
  useEffect(()=>{
    if(!ready || photo)return;
    const seen=new Set<Element>();
    const inspect=()=>{
      if(document.hidden || document.querySelector('dialog[open]'))return;
      const candidates=[...document.querySelectorAll<HTMLElement>('[data-ddui-tip]')]
        .map(node=>({node,rect:node.getBoundingClientRect()}))
        .filter(({rect})=>rect.top<innerHeight*.8 && rect.bottom>innerHeight*.2)
        .sort((a,b)=>Math.abs((a.rect.top+a.rect.bottom)/2-innerHeight*.5)-Math.abs((b.rect.top+b.rect.bottom)/2-innerHeight*.5));
      const entry=candidates.find(({node})=>!seen.has(node));
      if(!entry)return;
      const isFinale=entry.node.dataset.dduiCelebrate==='true';
      if(say(entry.node.dataset.dduiTip || '이 사진도 참 좋죠?')) {
        seen.add(entry.node);
        if(isFinale && !celebrated){
          celebrated=true;
          void confetti({particleCount:90,spread:85,startVelocity:32,origin:{x:.82,y:.86},colors:['#d7b889','#ebd8b5','#bca8a0','#f1e8d9'],disableForReducedMotion:true,zIndex:100});
        }
      }
    };
    const timer=window.setInterval(inspect,900);
    inspect();
    return()=>clearInterval(timer);
  },[ready,photo,say]);
  const touch=()=>{
    const lines=['말랑말랑~','헤헤, 간지러워요!','한 번 더 쓰다듬어 주세요~','저도 신나요!'];
    say(lines[Math.floor(Math.random()*lines.length)],true);
  };
  return <div className="gallery-curator" data-visible={visible && !hidden} inert={hidden} aria-hidden={hidden}>
    <div className="ddui-words" aria-live="polite" aria-atomic="false">
      {words.map(word=><p key={word.id} className="ddui-flying-word" style={word.flight} onAnimationEnd={event=>{if(event.target===event.currentTarget)setWords(previous=>previous.filter(item=>item.id!==word.id));}}><span className="ddui-speech-sway">{word.text}</span></p>)}
    </div>
    <div className="ddui-waddle"><button ref={button} className="curator-dog" type="button" aria-label="뚜이 쓰다듬기" onClick={touch}><img src="/history/ddui.webp" alt="" width="64" height="64"/></button></div>
  </div>;
}
