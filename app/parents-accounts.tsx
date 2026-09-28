"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useAssetsReady } from "./asset-loader";
import { HIGH_FIVE_SOUND, PAPER_UNFOLD_SOUND, playDecodedSound } from "./audio-bank";
import { parentAccountGroups, type ParentAccount } from "./parents-accounts-data";

export default function ParentsAccounts() {
  const ready = useAssetsReady();
  const cta = useRef<HTMLButtonElement>(null);
  const celebrated = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const openFrame = useRef<number>(0);
  const revealFrame = useRef<number>(0);
  const closeTimer = useRef<number>(0);
  const closing = useRef(false);
  const drag = useRef<{ pointerId: number; startY: number; distance: number } | null>(null);

  useEffect(() => () => {
    cancelAnimationFrame(openFrame.current);
    cancelAnimationFrame(revealFrame.current);
    clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    const button = cta.current;
    if (!ready || !button || celebrated.current) return;
    const confettiReady = import("canvas-confetti").catch(() => null);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || entry.intersectionRatio < .75 || celebrated.current) return;
      celebrated.current = true;
      observer.disconnect();

      void confettiReady.then(module => {
        if (!button.isConnected) return;
        // The entrance high-five has already unlocked audio on mobile.
        playDecodedSound(HIGH_FIVE_SOUND, .17);
        playDecodedSound(PAPER_UNFOLD_SOUND, .24);
        if (!module) return;
        const rect = button.getBoundingClientRect();
        const y = Math.min(.9, Math.max(.1, rect.top / innerHeight));
        const left = Math.min(.95, Math.max(.05, rect.left / innerWidth));
        const right = Math.min(.95, Math.max(.05, rect.right / innerWidth));
        const paper = { particleCount: 26, spread: 48, startVelocity: 24, gravity: 1.05, scalar: .72, shapes: ["square" as const], colors: ["#292621", "#9c9182", "#d5c6ae", "#eee8dc"], disableForReducedMotion: true, zIndex: 100 };
        void module.default({ ...paper, angle: 60, origin: { x: left, y } });
        void module.default({ ...paper, angle: 120, origin: { x: right, y } });
      });
    }, { threshold: .75 });
    observer.observe(button);
    return () => observer.disconnect();
  }, [ready]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousRoot = root.style.overflowY;
    const previousBody = document.body.style.overflow;
    root.style.overflowY = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      root.style.overflowY = previousRoot;
      document.body.style.overflow = previousBody;
    };
  }, [open]);

  function showAccounts() {
    setCopied(null);
    setMessage("");
    closing.current = false;
    dialog.current?.showModal();
    setOpen(true);
    // Let the offscreen panel paint before sliding it into the top layer.
    openFrame.current = requestAnimationFrame(() => {
      revealFrame.current = requestAnimationFrame(() => setVisible(true));
    });
  }

  function hideAccounts() {
    if (!dialog.current?.open || closing.current) return;
    closing.current = true;
    cancelAnimationFrame(openFrame.current);
    cancelAnimationFrame(revealFrame.current);
    setVisible(false);
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 380;
    closeTimer.current = window.setTimeout(() => dialog.current?.close(), duration);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    if (drag.current?.pointerId !== event.pointerId) return;
    const distance = drag.current.distance;
    drag.current = null;
    dialog.current?.removeAttribute("data-dragging");
    if (!cancelled && distance > 80) hideAccounts();
    else dialog.current?.style.removeProperty("--drawer-drag");
  }

  async function copyAccount(account: ParentAccount, id: string) {
    try {
      await navigator.clipboard.writeText(account.number.replace(/[\s-]/g, ""));
      setCopied(id);
      setMessage(`${account.holder}님의 계좌번호를 복사했습니다.`);
    } catch {
      setCopied(null);
      setMessage("복사하지 못했습니다. 계좌번호를 길게 눌러 복사해 주세요.");
    }
  }

  return <div className="parents-accounts">
    <button ref={cta} className="parents-accounts-cta" type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls="parents-accounts-dialog" onClick={showAccounts}>
      축하의 마음 전하기
    </button>
    <dialog id="parents-accounts-dialog" ref={dialog} className="parents-accounts-dialog" data-visible={visible} aria-labelledby="parents-accounts-title" aria-describedby="parents-accounts-intro" onClose={() => {
      setOpen(false);
      setVisible(false);
      closing.current = false;
      dialog.current?.style.removeProperty("--drawer-drag");
    }} onCancel={event => { event.preventDefault(); hideAccounts(); }} onPointerDown={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) hideAccounts();
    }}>
      <div className="parents-accounts-grip-area" aria-hidden="true" onPointerDown={event => {
        if (event.button !== 0) return;
        drag.current = { pointerId: event.pointerId, startY: event.clientY, distance: 0 };
        dialog.current?.setAttribute("data-dragging", "true");
        event.currentTarget.setPointerCapture(event.pointerId);
      }} onPointerMove={event => {
        if (drag.current?.pointerId !== event.pointerId) return;
        drag.current.distance = Math.max(0, event.clientY - drag.current.startY);
        dialog.current?.style.setProperty("--drawer-drag", `${drag.current.distance}px`);
      }} onPointerUp={event => endDrag(event)} onPointerCancel={event => endDrag(event, true)}><span /></div>
      <div className="parents-accounts-drawer-content">
      <header className="parents-accounts-header">
        <h2 id="parents-accounts-title">마음 전하실 곳</h2>
        <button className="parents-accounts-close" type="button" aria-label="계좌 안내 닫기" onClick={hideAccounts}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
      </header>
      <p className="parents-accounts-intro" id="parents-accounts-intro">축하해 주시는 마음에 감사드립니다.</p>
      {parentAccountGroups.map(({ title, accounts }, groupIndex) => <section className="parents-account-group" key={title} aria-labelledby={`parents-account-group-${groupIndex}`}>
        <h3 id={`parents-account-group-${groupIndex}`}>{title}</h3>
        {accounts.length ? <ul>{accounts.map((account, index) => {
          const id = `${groupIndex}-${index}`;
          return <li className="parents-account-row" key={id}>
            <div><p className="parents-account-holder"><span>{account.relation}</span> {account.holder}</p><p className="parents-account-bank">{account.bank}</p><p className="parents-account-number">{account.number}</p></div>
            <button type="button" className="parents-account-copy" aria-label={`${title} ${account.relation} ${account.holder}님 계좌번호 복사`} onClick={() => copyAccount(account, id)}>{copied === id ? "복사 완료" : "복사"}</button>
          </li>;
        })}</ul> : <p className="parents-account-empty">계좌 정보를 준비하고 있습니다.</p>}
      </section>)}
      <p className="parents-accounts-status" role="status" aria-live="polite">{message}</p>
      </div>
    </dialog>
  </div>;
}
