"use client";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useJellyTouch } from "./use-jelly-touch";

export default function GalleryDdui({ ready, photo }: { ready:boolean; photo?:string }) {
  const button=useRef<HTMLButtonElement>(null);
  useJellyTouch(button);
  const [visible,setVisible]=useState(false);
  const [words,setWords]=useState<{id:number;text:string;drift:number}[]>([]);
  const last=useRef(Date.now()+5000), serial=useRef(0);
  const say=useCallback((text:string,force=false)=>{
    const now=Date.now();
    if(!force && now-last.current<5500)return;
    last.current=now;
    setWords(previous=>[...previous.slice(-1),{id:++serial.current,text,drift:30+Math.random()*35}]);
  },[]);
  useEffect(()=>{if(ready){const frame=requestAnimationFrame(()=>setVisible(true));return()=>cancelAnimationFrame(frame);}},[ready]);
  useEffect(()=>{if(photo)say(photo,true);},[photo,say]);
  useEffect(()=>{
    if(!ready || photo)return;
    let previous=window.scrollY, travel=0;
    const onScroll=()=>{
      travel+=Math.abs(window.scrollY-previous);previous=window.scrollY;
      if(travel>window.innerHeight*.8){travel=0;say(window.scrollY<300?'천천히 같이 봐요~':'제가 옆에서 같이 볼게요~');}
    };
    const seen=new Set<Element>();
    const observer=new IntersectionObserver(entries=>{
      const entry=entries.find(e=>e.intersectionRatio>.7 && !seen.has(e.target));
      if(entry){seen.add(entry.target);say(entry.target.getAttribute('data-ddui-tip') || '이 사진도 참 좋죠?');}
    },{threshold:.7});
    document.querySelectorAll('[data-ddui-tip]').forEach(node=>observer.observe(node));
    window.addEventListener('scroll',onScroll,{passive:true});
    return()=>{window.removeEventListener('scroll',onScroll);observer.disconnect();};
  },[ready,photo,say]);
  const touch=()=>{
    const lines=['말랑말랑~','헤헤, 간지러워요!','한 번 더 쓰다듬어 주세요~','저도 신나요!'];
    say(lines[Math.floor(Math.random()*lines.length)],true);
  };
  return <div className="gallery-curator" data-visible={visible}>
    <div className="ddui-words" aria-live="polite" aria-atomic="false">
      {words.map(word=><p key={word.id} className="ddui-flying-word" style={{'--drift':`${word.drift}px`} as CSSProperties} onAnimationEnd={()=>setWords(previous=>previous.filter(item=>item.id!==word.id))}>{word.text}</p>)}
    </div>
    <div className="ddui-waddle"><button ref={button} className="curator-dog" type="button" aria-label="뚜이 쓰다듬기" onClick={touch}><img src="/history/ddui.webp" alt="" width="64" height="64"/></button></div>
  </div>;
}
