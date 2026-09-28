"use client";
import { useEffect, type RefObject } from "react";

export function useJellyTouch(ref: RefObject<HTMLButtonElement | null>, bounceOnRelease=false) {
  useEffect(() => {
    const button=ref.current, image=button?.querySelector('img');
    if(!button || !image) return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const position=[0,0,1,1], velocity=[0,0,0,0], target=[0,0,1,1];
    let frame=0, last=0, held=false, focused=false, pendingClick=false, pointer:number|null=null, originX=0, originY=0;
    const update=(now:number)=>{
      frame=0;
      const dt=last?Math.min((now-last)/1000,.032):1/60;last=now;
      let moving=false;
      for(let i=0;i<4;i++) {
        velocity[i]+=((target[i]-position[i])*190-velocity[i]*11)*dt;
        position[i]+=velocity[i]*dt;
        if(Math.abs(target[i]-position[i])>.001 || Math.abs(velocity[i])>.01) moving=true;
        else {position[i]=target[i];velocity[i]=0;}
      }
      image.style.transform=`translate(${position[0]}px,${position[1]}px) rotate(${position[0]*.65}deg) scale(${position[2]},${position[3]})`;
      if(moving)frame=requestAnimationFrame(update);else last=0;
    };
    const run=()=>{
      if(reduced.matches){cancelAnimationFrame(frame);frame=0;last=0;image.style.transform='none';return;}
      if(!frame)frame=requestAnimationFrame(update);
    };
    const release=(bounce=false)=>{
      const wasHeld=held;
      held=false;pointer=null;button.dataset.pressed='false';
      if(bounceOnRelease && bounce && wasHeld && !reduced.matches){
        // Give even a quick tap enough compression to spring visibly back.
        position[1]=Math.max(position[1],6);
        position[2]=Math.max(position[2],1.2);
        position[3]=Math.min(position[3],.76);
        velocity[1]=-180;velocity[2]=-2.4;velocity[3]=2.9;
      }
      target[0]=target[1]=0;target[2]=target[3]=bounceOnRelease?1:focused?1.025:1;run();
    };
    const press=()=>{held=true;pendingClick=true;button.dataset.pressed='true';target[0]=(Math.random()-.5)*12;target[1]=4+Math.random()*4;target[2]=1.18+Math.random()*.14;target[3]=1/target[2]-.08;velocity[0]+=(Math.random()-.5)*25;run();};
    const down=(event:PointerEvent)=>{
      if(!event.isPrimary || event.button!==0)return;
      pointer=event.pointerId;originX=event.clientX;originY=event.clientY;
      button.setPointerCapture(event.pointerId);press();
    };
    const move=(event:PointerEvent)=>{
      if(!held || pointer!==event.pointerId)return;
      target[0]=Math.max(-10,Math.min(10,(event.clientX-originX)*.2));
      target[1]=5+Math.max(-5,Math.min(7,(event.clientY-originY)*.15));run();
    };
    const up=(event:PointerEvent)=>{if(pointer===event.pointerId)release(true);};
    const cancel=(event:PointerEvent)=>{if(pointer===event.pointerId){release();pendingClick=false;}};
    const focus=()=>{focused=true;if(!held && !bounceOnRelease){target[2]=target[3]=1.025;velocity[1]=-28;velocity[2]=.7;velocity[3]=-.5;run();}};
    const blur=()=>{focused=false;release();pendingClick=false;};
    const keyDown=(event:KeyboardEvent)=>{if((event.key===' '||event.key==='Enter')&&!event.repeat)press();};
    const keyUp=(event:KeyboardEvent)=>{if(event.key===' '||event.key==='Enter')release(true);};
    const click=()=>{
      if(!bounceOnRelease)return;
      if(pendingClick){pendingClick=false;return;}
      // Assistive technology can activate a button without pointer or key events.
      press();release(true);pendingClick=false;
    };
    button.addEventListener('pointerdown',down);button.addEventListener('pointermove',move);
    button.addEventListener('pointerup',up);button.addEventListener('pointercancel',cancel);button.addEventListener('lostpointercapture',cancel);
    button.addEventListener('focus',focus);button.addEventListener('blur',blur);
    button.addEventListener('keydown',keyDown);button.addEventListener('keyup',keyUp);button.addEventListener('click',click);
    const motionChange=()=>release();
    reduced.addEventListener('change',motionChange);
    return()=>{
      cancelAnimationFrame(frame);image.style.removeProperty('transform');
      button.removeEventListener('pointerdown',down);button.removeEventListener('pointermove',move);
      button.removeEventListener('pointerup',up);button.removeEventListener('pointercancel',cancel);button.removeEventListener('lostpointercapture',cancel);
      button.removeEventListener('focus',focus);button.removeEventListener('blur',blur);
      button.removeEventListener('keydown',keyDown);button.removeEventListener('keyup',keyUp);button.removeEventListener('click',click);
      reduced.removeEventListener('change',motionChange);
    };
  },[ref,bounceOnRelease]);
}
