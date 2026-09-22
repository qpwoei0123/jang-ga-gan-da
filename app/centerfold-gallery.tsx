"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import WeddingSong from "./wedding-song";
import { useAssetsReady } from "./asset-loader";

// Rectangular prints form the outline themselves; no heart mask or rotated tiles.
const photos = [
  { file:2016, column:"2 / 6", row:"1 / 3", position:"50% 60%", caption:"둘이 함께, 문 너머의 하루.", tip:"문 너머로 살짝 보이는 둘. 이 사진부터 볼까요?" },
  { file:2024, column:"8 / 12", row:"1 / 3", position:"50% 38%", caption:"나란히 남은 순간.", tip:"나란히 있는 모습, 제가 좋아하는 사진이에요." },
  { file:2017, column:"1 / 5", row:"3 / 7", position:"50% 40%", caption:"함께하는 날들.", tip:"오늘은 이 장면이 눈에 들어오네요. 크게 봐요!" },
  { file:2015, column:"5 / 9", row:"3 / 7", position:"50% 38%", caption:"우리, 함께.", tip:"형누나가 나란히 앉았어요. 둘 다 잘 나왔죠?" },
  { file:2019, column:"9 / 13", row:"3 / 7", position:"50% 40%", caption:"서로의 곁에서.", tip:"조금 더 가까이 보면 또 다른 표정이 보여요." },
  { file:2020, column:"2 / 7", row:"7 / 9", position:"50% 42%", caption:"오래 기억할 장면.", tip:"이 장면도 놓치지 마세요. 제가 골랐어요!" },
  { file:2023, column:"7 / 12", row:"7 / 9", position:"50% 42%", caption:"마주 보고 웃는 날.", tip:"형누나가 웃으면 저도 좋아요. 헤헤." },
  { file:2018, column:"3 / 7", row:"9 / 11", position:"50% 38%", caption:"둘만의 한 장면.", tip:"여기에도 둘의 순간이 숨어 있어요." },
  { file:2021, column:"7 / 11", row:"9 / 11", position:"50% 42%", caption:"발맞춰 걷는 시간.", tip:"사진 속 작은 모습들도 찬찬히 봐주세요~" },
  { file:2026, column:"4 / 10", row:"11 / 13", position:"50% 52%", caption:"함께한 날들 위에, 새로운 시작.", tip:"그리고 지금, 형누나가 결혼합니다!" },
  { file:2022, column:"6 / 8", row:"13 / 15", position:"50% 40%", caption:"우리의 다음 장면으로.", tip:"하트 끝에 있는 이 사진도 꺼내볼까요?" },
];

export default function CenterfoldGallery() {
  const ready=useAssetsReady();
  const section=useRef<HTMLElement>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const touchX=useRef<number | null>(null);
  const curatorButton=useRef<HTMLButtonElement>(null);
  const restoreCuratorFocus=useRef(false);
  const [selected,setSelected]=useState<number | null>(null);
  const [visible,setVisible]=useState(false);
  const [recommendation,setRecommendation]=useState<number | null>(null);
  const [curatorOpen,setCuratorOpen]=useState(false);
  const index=selected ?? 0;
  const move=(direction:number)=>setSelected(current=>current===null?null:(current+direction+photos.length)%photos.length);

  useEffect(()=>{
    if(!ready || !section.current) return;
    const update=()=>{
      const bounds=section.current!.getBoundingClientRect();
      setVisible(bounds.top<window.innerHeight+60 && bounds.bottom>0);
    };
    update();
    window.addEventListener("scroll",update,{passive:true});
    window.addEventListener("resize",update);
    return()=>{window.removeEventListener("scroll",update);window.removeEventListener("resize",update);};
  },[ready]);
  useEffect(()=>{if(!visible)setCuratorOpen(false);},[visible]);
  useEffect(()=>{
    const modal=dialog.current;
    if(selected===null || !modal) return;
    if(!modal.open)modal.showModal();
    const previous=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return()=>{document.body.style.overflow=previous;};
  },[selected!==null]);
  const close=()=>{dialog.current?.close();setSelected(null);};
  const recommend=()=>{
    setRecommendation(previous=>previous===null?3:(previous+3)%photos.length);
    setCuratorOpen(true);
  };

  return <section ref={section} className="heart-gallery" id="photo-edition" aria-labelledby="gallery-title">
    <header className="heart-gallery-heading"><h2 id="gallery-title">함께 모은 순간들</h2><p>하나하나 모여, 우리의 마음이 되었습니다.</p></header>
    <div className="heart-puzzle" aria-label="하트 모양으로 모은 열한 장의 사진">
      {photos.map((photo,i)=><button key={photo.file} type="button" className="heart-tile" style={{gridColumn:photo.column,gridRow:photo.row,"--photo-position":photo.position} as CSSProperties} aria-label={`${i+1}번째 사진 크게 보기: ${photo.caption}`} onClick={()=>setSelected(i)}>
        <img src={`/history/${photo.file}.jpg`} alt={photo.caption} draggable="false"/>
      </button>)}
    </div>
    <p className="heart-gallery-hint">사진을 누르면 더 크게 볼 수 있어요.</p>
    <div className="gallery-music"><WeddingSong/></div>
    <div className="gallery-curator" data-visible={visible && selected===null} inert={!visible || selected!==null}>
      {curatorOpen && recommendation!==null && <div className="curator-note" role="status">
        <button type="button" className="curator-dismiss" aria-label="뚜이 안내 닫기" onClick={()=>setCuratorOpen(false)}>×</button>
        <p>{photos[recommendation].tip}</p>
        <div><button type="button" onClick={()=>{restoreCuratorFocus.current=true;setSelected(recommendation);setCuratorOpen(false);}}>사진 보기 <span aria-hidden="true">↗</span></button><button type="button" onClick={recommend}>다른 사진</button></div>
      </div>}
      <button ref={curatorButton} className="curator-dog" type="button" aria-label="뚜이에게 사진 추천받기" aria-expanded={curatorOpen} onClick={()=>curatorOpen?setCuratorOpen(false):recommend()}><img src="/history/ddui.webp" alt="" width="64" height="64"/><span>뚜이의 픽</span></button>
    </div>
    <dialog ref={dialog} className="gallery-lightbox" aria-label="웨딩 사진 크게 보기" onCancel={close} onClose={()=>{setSelected(null);if(restoreCuratorFocus.current){restoreCuratorFocus.current=false;requestAnimationFrame(()=>curatorButton.current?.focus({preventScroll:true}));}}} onClick={event=>{if(event.target===event.currentTarget)close();}} onKeyDown={event=>{if(event.key==="ArrowRight"){event.preventDefault();move(1);}if(event.key==="ArrowLeft"){event.preventDefault();move(-1);}}}>
      {selected!==null && <div className="lightbox-content">
        <header><span>{String(index+1).padStart(2,"0")} / {photos.length}</span><button autoFocus type="button" onClick={close} aria-label="사진 닫기">×</button></header>
        <div className="lightbox-image" onTouchStart={event=>{touchX.current=event.touches[0].clientX;}} onTouchCancel={()=>{touchX.current=null;}} onTouchEnd={event=>{if(touchX.current!==null){const delta=event.changedTouches[0].clientX-touchX.current;if(Math.abs(delta)>45)move(delta<0?1:-1);}touchX.current=null;}}><img src={`/history/${photos[index].file}.jpg`} alt={photos[index].caption}/></div>
        <footer><button type="button" onClick={()=>move(-1)} aria-label="이전 사진">←</button><p aria-live="polite">{photos[index].caption}</p><button type="button" onClick={()=>move(1)} aria-label="다음 사진">→</button></footer>
      </div>}
    </dialog>
  </section>;
}
