"use client";

import { useRef, useState } from "react";

const groups = [
  { key: "--text", label: "본문 · 기사", sample: "열아홉에서 서른까지, 함께한 모든 날.", options: [
    ["마루부리 · 기본", ""], ["Noto Serif KR", '"Noto Serif KR", serif'], ["AppleMyungjo", 'AppleMyungjo, serif'], ["고딕 · 시스템", 'system-ui, sans-serif'],
  ] },
  { key: "--display", label: "영문 제목", sample: "The Wedding News", options: [
    ["기존 설정", ""], ["Bodoni 72", '"Bodoni 72", serif'], ["Didot", 'Didot, serif'], ["Georgia", 'Georgia, serif'], ["Times New Roman", '"Times New Roman", serif'],
  ] },
  { key: "--sans", label: "날짜 · 라벨", sample: "OCTOBER 17, 2026 · 우리의 시간", options: [
    ["기존 설정", ""], ["Arial", 'Arial, sans-serif'], ["Helvetica Neue", '"Helvetica Neue", sans-serif'], ["시스템", 'system-ui, sans-serif'],
  ] },
];

export default function FontTweaks() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [original, setOriginal] = useState(false);
  function apply(next: Record<string, string>, compare: boolean) {
    const sheet = document.querySelector<HTMLElement>(".edition");
    if (!sheet) return;
    groups.forEach(({ key }) => {
      if (!compare && next[key]) sheet.style.setProperty(key, next[key]);
      else sheet.style.removeProperty(key);
    });
    void document.fonts.ready.then(() => window.dispatchEvent(new Event("edition-font-change")));
  }
  return <>
    <button className="font-tweaks-launch" type="button" onClick={() => dialog.current?.showModal()}>Aa <span>폰트</span></button>
    <dialog ref={dialog} className="font-tweaks" aria-labelledby="font-tweaks-title" onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <div className="font-tweaks-inner">
        <header><div><h2 id="font-tweaks-title">폰트 비교</h2><p>선택하면 신문과 기사에 바로 적용됩니다.</p></div><button type="button" aria-label="닫기" onClick={() => dialog.current?.close()}>×</button></header>
        <p className="font-tweaks-note">마루부리는 웹폰트로 제공됩니다. 나머지는 기기에 없으면 대체 글꼴로 표시됩니다. 테스트 설정은 새로고침하면 초기화됩니다.</p>
        {groups.map(group => <fieldset key={group.key}>
          <legend>{group.label}</legend>
          <div className="font-tweaks-options">{group.options.map(([label, font]) => <button type="button" key={label} aria-pressed={(values[group.key] || "") === font} onClick={() => {
            const next = { ...values, [group.key]: font }; setValues(next); setOriginal(false); apply(next, false);
          }}>{label}</button>)}</div>
          <div className="font-tweaks-samples">{group.options.map(([label, font]) => <div key={label}><small>{label}</small><p style={{ fontFamily: font || `var(${group.key})` }}>{group.sample}</p></div>)}</div>
        </fieldset>)}
        <footer><button type="button" aria-pressed={original} onClick={() => { setOriginal(!original); apply(values, !original); }}>{original ? "선택한 폰트 보기" : "원본과 비교"}</button><button type="button" onClick={() => { setValues({}); setOriginal(false); apply({}, false); }}>초기화</button><button type="button" onClick={() => dialog.current?.close()}>신문에서 보기</button></footer>
      </div>
    </dialog>
  </>;
}
