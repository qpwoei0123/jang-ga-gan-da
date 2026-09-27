"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { useAssetsReady } from "./asset-loader";

// Rectangular prints form the outline themselves; no heart mask or rotated tiles.
const photos = [
  { src:"/gallery/stair-wave.webp", width:1800, position:"50% 48%", caption:"계단 위를 올려다보며 손을 흔드는 두 사람.", tip:"형누나가 여기 보고 인사해요~" },
  { src:"/gallery/stair-kiss.webp", width:1200, position:"50% 45%", caption:"계단 난간 사이로 서로에게 입을 맞추는 두 사람.", tip:"둘만의 다정한 순간이에요." },
  { src:"/gallery/hallway-embrace.webp", width:1245, position:"57% 50%", caption:"복도에서 서로를 끌어안은 두 사람.", tip:"꼭 붙어 있는 형누나, 제가 좋아하는 사진이에요." },
  { src:"/gallery/floor-wink.webp", width:1247, position:"50% 28%", caption:"타일 바닥에 엎드려 윙크하는 두 사람.", tip:"같이 장난치면 더 즐거워요. 헤헤." },
  { src:"/gallery/stair-peek.webp", width:1200, position:"70% 53%", caption:"계단 난간 뒤에서 얼굴을 내민 두 사람.", tip:"계단 너머에 형누나가 숨어 있어요!" },
  { src:"/gallery/stair-laugh.webp", width:1200, position:"50% 34%", caption:"청색 옷을 맞춰 입고 계단에 앉아 웃는 두 사람.", tip:"형누나가 웃으면 저도 좋아요." },
  { src:"/gallery/cafe-together.webp", width:1354, position:"65% 50%", zoom:1.35, caption:"햇살 드는 카페에서 나란히 선 두 사람.", tip:"함께 서 있는 모습도 찬찬히 봐주세요~" },
  { src:"/history/2018.webp", width:1066, position:"50% 38%", caption:"둘만의 한 장면.", tip:"여기에도 둘의 순간이 숨어 있어요." },
  { src:"/gallery/peek-wall.webp", width:976, position:"50% 50%", caption:"벽돌 벽 옆에서 함께 고개를 내민 두 사람.", tip:"빼꼼! 형누나가 같이 얼굴을 내밀었어요." },
  { src:"/gallery/mirror-smile.webp", width:1200, position:"50% 100%", zoom:1.8, caption:"작은 거울 속에서 장난스러운 표정을 짓는 두 사람.", tip:"거울 속 둘의 표정을 크게 봐요!" },
  { src:"/gallery/street-mirror.webp", width:1024, position:"50% 100%", caption:"길가의 둥근 거울에 함께 비친 두 사람.", tip:"하트 끝에도 형누나의 장난이 숨어 있어요." },
].map(photo => {
  const file=photo.src.slice(photo.src.lastIndexOf("/")+1);
  return {...photo, thumbnail:`/gallery/thumbs/${file}`, mobile:`/gallery/mobile/${file}`};
});

type Photo = typeof photos[number];
type Selection = { index:number; previous:number | null; direction:number };
const displaySizes="(max-width: 600px) calc(100vw - 32px), 428px";
const prefetched=new Set<string>();

// Only prepare neighboring full photos after the reader opens the gallery.
function prefetchPhoto(photo:Photo) {
  if(prefetched.has(photo.src))return;
  prefetched.add(photo.src);
  const image=new Image();
  image.sizes=displaySizes;
  image.srcset=photoSources(photo);
  image.src=photo.mobile;
  image.onerror=()=>prefetched.delete(photo.src);
}

function photoSources(photo:Photo) {
  return `${photo.mobile} 960w, ${photo.src} ${photo.width}w`;
}

function LightboxPhoto({photo,active,direction}:{photo:Photo;active:boolean;direction:number}) {
  const [decoded,setDecoded]=useState(false);
  return <div className={`lightbox-frame ${active?"is-current":"is-previous"}`} style={{"--photo-enter-x":`${direction*12}px`} as CSSProperties} role="img" aria-label={photo.caption} aria-hidden={!active}>
    <img className="lightbox-preview" src={photo.thumbnail} alt="" aria-hidden="true" draggable="false" decoding="async"/>
    <img className={`lightbox-full${decoded?" is-decoded":""}`} src={photo.mobile} srcSet={photoSources(photo)} sizes={displaySizes} alt="" aria-hidden="true" draggable="false" decoding="async" fetchPriority={active?"high":"low"} onLoad={event=>{event.currentTarget.decode().catch(()=>{}).then(()=>setDecoded(true));}}/>
  </div>;
}

export default function CenterfoldGallery() {
  const ready=useAssetsReady();
  const puzzle=useRef<HTMLDivElement>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const touchStart=useRef<{x:number;y:number} | null>(null);
  const [selected,setSelected]=useState<Selection | null>(null);
  const isOpen=selected!==null;
  const index=selected?.index ?? 0;
  const move=(direction:number)=>setSelected(current=>current===null?null:{index:(current.index+direction+photos.length)%photos.length,previous:current.index,direction});

  useEffect(()=>{
    if(!isOpen)return;
    const timer=window.setTimeout(()=>{
      prefetchPhoto(photos[(index+1)%photos.length]);
      prefetchPhoto(photos[(index-1+photos.length)%photos.length]);
    },350);
    return()=>window.clearTimeout(timer);
  },[isOpen,index]);

  useEffect(()=>{
    if(selected?.previous==null)return;
    const timer=window.setTimeout(()=>setSelected(current=>current?.index===selected.index?{...current,previous:null}:current),300);
    return()=>window.clearTimeout(timer);
  },[selected]);

  useEffect(()=>{
    const grid=puzzle.current;
    if(!ready || !grid)return;
    const media=gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)",()=>{
      const tiles=Array.from(grid.querySelectorAll<HTMLButtonElement>(".heart-tile"))
        .map(tile=>({tile,rect:tile.getBoundingClientRect()}))
        .sort((a,b)=>Math.abs(a.rect.top-b.rect.top)>1?a.rect.top-b.rect.top:a.rect.left-b.rect.left)
        .map(({tile})=>tile);
      const reveal=gsap.timeline({paused:true}).fromTo(tiles,
        {autoAlpha:0,y:10},
        {autoAlpha:1,y:0,duration:.4,stagger:.055,ease:"power2.out",clearProps:"opacity,visibility,transform",immediateRender:true}
      );
      const observer=new IntersectionObserver(entries=>{
        if(!entries.some(entry=>entry.isIntersecting))return;
        reveal.play();
        observer.disconnect();
      },{threshold:.12});
      const finish=()=>{reveal.progress(1);observer.disconnect();};
      grid.addEventListener("focusin",finish);
      observer.observe(grid);
      return()=>{observer.disconnect();grid.removeEventListener("focusin",finish);};
    },grid);
    return()=>media.revert();
  },[ready]);

  useEffect(()=>{
    const modal=dialog.current;
    if(!isOpen || !modal) return;
    if(!modal.open)modal.showModal();
    const root=document.documentElement;
    const previousRoot=root.style.overflowY;
    const previous=document.body.style.overflow;
    root.style.overflowY="hidden";
    document.body.style.overflow="hidden";
    return()=>{root.style.overflowY=previousRoot;document.body.style.overflow=previous;};
  },[isOpen]);
  const close=()=>{dialog.current?.close();setSelected(null);};

  return <section className="heart-gallery" id="photo-edition" aria-labelledby="gallery-title">
    <header className="heart-gallery-heading"><h2 id="gallery-title">함께 모은 순간들</h2><p>하나하나 모여, 우리의 마음이 되었습니다.</p></header>
    <div ref={puzzle} className="heart-puzzle" aria-label="하트 모양으로 모은 열한 장의 사진">
      {photos.map((photo,i)=><button key={photo.src} type="button" className="heart-tile" data-ddui-tip={photo.tip} style={{"--photo-position":photo.position} as CSSProperties} aria-label={`${i+1}번째 사진 크게 보기: ${photo.caption}`} onClick={()=>setSelected({index:i,previous:null,direction:1})}>
        <img src={photo.thumbnail} alt={photo.caption} loading="lazy" draggable="false" decoding="async" style={{scale:photo.zoom ?? 1}}/>
      </button>)}
    </div>
    <p className="heart-gallery-hint">사진을 누르면 더 크게 볼 수 있어요.</p>
    <dialog ref={dialog} className="gallery-lightbox" aria-label="웨딩 사진 크게 보기" onCancel={close} onClose={()=>setSelected(null)} onClick={event=>{if(event.target===event.currentTarget)close();}} onKeyDown={event=>{if(event.key==="ArrowRight"){event.preventDefault();move(1);}if(event.key==="ArrowLeft"){event.preventDefault();move(-1);}}}>
      {selected!==null && <div className="lightbox-content" onClick={event=>{if(event.target===event.currentTarget)close();}}>
        <div className="lightbox-stage">
          <header><span aria-live="polite" aria-atomic="true">{String(index+1).padStart(2,"0")} / {photos.length}</span><button autoFocus type="button" onClick={close} aria-label="사진 닫기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header>
          <div className="lightbox-image" onClick={event=>{if(event.target===event.currentTarget)close();}} onTouchStart={event=>{touchStart.current={x:event.touches[0].clientX,y:event.touches[0].clientY};}} onTouchCancel={()=>{touchStart.current=null;}} onTouchEnd={event=>{if(touchStart.current){const dx=event.changedTouches[0].clientX-touchStart.current.x,dy=event.changedTouches[0].clientY-touchStart.current.y;if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.4)move(dx<0?1:-1);}touchStart.current=null;}}>
            {(selected.previous===null?[index]:[selected.previous,index]).map(photoIndex=><LightboxPhoto key={photos[photoIndex].src} photo={photos[photoIndex]} active={photoIndex===index} direction={selected.direction}/>)}
          </div>
          <footer><nav aria-label="사진 이동"><button type="button" onClick={()=>move(-1)} aria-label="이전 사진"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg></button><button type="button" onClick={()=>move(1)} aria-label="다음 사진"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg></button></nav></footer>
        </div>
      </div>}
    </dialog>
  </section>;
}
