"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

// Rectangular prints form the outline themselves; no heart mask or rotated tiles.
const photos = [
  { file:2016, position:"50% 60%", caption:"둘이 함께, 문 너머의 하루.", tip:"문 너머로 살짝 보이는 둘. 이 사진부터 볼까요?" },
  { file:2024, position:"50% 38%", caption:"나란히 남은 순간.", tip:"나란히 있는 모습, 제가 좋아하는 사진이에요." },
  { file:2017, position:"50% 40%", caption:"함께하는 날들.", tip:"오늘은 이 장면이 눈에 들어오네요. 크게 봐요!" },
  { file:2015, position:"50% 38%", caption:"우리, 함께.", tip:"형누나가 나란히 앉았어요. 둘 다 잘 나왔죠?" },
  { file:2019, position:"50% 40%", caption:"서로의 곁에서.", tip:"조금 더 가까이 보면 또 다른 표정이 보여요." },
  { file:2020, position:"50% 42%", caption:"오래 기억할 장면.", tip:"이 장면도 놓치지 마세요. 제가 골랐어요!" },
  { file:2023, position:"50% 42%", caption:"마주 보고 웃는 날.", tip:"형누나가 웃으면 저도 좋아요. 헤헤." },
  { file:2018, position:"50% 38%", caption:"둘만의 한 장면.", tip:"여기에도 둘의 순간이 숨어 있어요." },
  { file:2021, position:"50% 42%", caption:"발맞춰 걷는 시간.", tip:"사진 속 작은 모습들도 찬찬히 봐주세요~" },
  { file:2026, position:"50% 52%", caption:"함께한 날들 위에, 새로운 시작.", tip:"그리고 지금, 형누나가 결혼합니다!" },
  { file:2022, position:"50% 40%", caption:"우리의 다음 장면으로.", tip:"하트 끝에 있는 이 사진도 꺼내볼까요?" },
];

export default function CenterfoldGallery() {
  const dialog=useRef<HTMLDialogElement>(null);
  const touchStart=useRef<{x:number;y:number} | null>(null);
  const [selected,setSelected]=useState<number | null>(null);
  const index=selected ?? 0;
  const move=(direction:number)=>setSelected(current=>current===null?null:(current+direction+photos.length)%photos.length);

  useEffect(()=>{
    const modal=dialog.current;
    if(selected===null || !modal) return;
    if(!modal.open)modal.showModal();
    const previous=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return()=>{document.body.style.overflow=previous;};
  },[selected!==null]);
  const close=()=>{dialog.current?.close();setSelected(null);};

  return <section className="heart-gallery" id="photo-edition" aria-labelledby="gallery-title">
    <header className="heart-gallery-heading"><h2 id="gallery-title">함께 모은 순간들</h2><p>하나하나 모여, 우리의 마음이 되었습니다.</p></header>
    <div className="heart-puzzle" aria-label="하트 모양으로 모은 열한 장의 사진">
      {photos.map((photo,i)=><button key={photo.file} type="button" className="heart-tile" data-ddui-tip={photo.tip} style={{"--photo-position":photo.position} as CSSProperties} aria-label={`${i+1}번째 사진 크게 보기: ${photo.caption}`} onClick={()=>setSelected(i)}>
        <img src={`/history/${photo.file}.webp`} alt={photo.caption} draggable="false"/>
      </button>)}
    </div>
    <p className="heart-gallery-hint">사진을 누르면 더 크게 볼 수 있어요.</p>
    <dialog ref={dialog} className="gallery-lightbox" aria-label="웨딩 사진 크게 보기" onCancel={close} onClose={()=>setSelected(null)} onClick={event=>{if(event.target===event.currentTarget)close();}} onKeyDown={event=>{if(event.key==="ArrowRight"){event.preventDefault();move(1);}if(event.key==="ArrowLeft"){event.preventDefault();move(-1);}}}>
      {selected!==null && <div className="lightbox-content" onClick={event=>{if(event.target===event.currentTarget)close();}}>
        <div className="lightbox-stage">
          <header><span>{String(index+1).padStart(2,"0")} / {photos.length}</span><button autoFocus type="button" onClick={close} aria-label="사진 닫기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header>
          <div className="lightbox-image" onClick={event=>{if(event.target===event.currentTarget)close();}} onTouchStart={event=>{touchStart.current={x:event.touches[0].clientX,y:event.touches[0].clientY};}} onTouchCancel={()=>{touchStart.current=null;}} onTouchEnd={event=>{if(touchStart.current){const dx=event.changedTouches[0].clientX-touchStart.current.x,dy=event.changedTouches[0].clientY-touchStart.current.y;if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.4)move(dx<0?1:-1);}touchStart.current=null;}}><img src={`/history/${photos[index].file}.webp`} alt={photos[index].caption}/></div>
          <footer><nav aria-label="사진 이동"><button type="button" onClick={()=>move(-1)} aria-label="이전 사진"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg></button><button type="button" onClick={()=>move(1)} aria-label="다음 사진"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg></button></nav><p aria-live="polite">{photos[index].caption}</p></footer>
        </div>
      </div>}
    </dialog>
  </section>;
}
