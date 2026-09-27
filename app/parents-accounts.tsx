"use client";

import { useEffect, useRef, useState } from "react";
import { parentAccountGroups, type ParentAccount } from "./parents-accounts-data";

export default function ParentsAccounts() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [message, setMessage] = useState("");

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
    dialog.current?.showModal();
    setOpen(true);
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
    <button className="parents-accounts-cta" type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls="parents-accounts-dialog" aria-describedby="parents-accounts-note" onClick={showAccounts}>
      축하의 마음 전하기
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 5.8a5.2 5.2 0 0 0-7.4 0l-.8.8-.8-.8a5.2 5.2 0 0 0-7.4 7.4L12 21l8.2-7.8a5.2 5.2 0 0 0 0-7.4Z" /></svg>
    </button>
    <p className="parents-accounts-note" id="parents-accounts-note">양가 부모님 계좌 안내</p>
    <dialog id="parents-accounts-dialog" ref={dialog} className="parents-accounts-dialog" aria-labelledby="parents-accounts-title" aria-describedby="parents-accounts-intro" onClose={() => setOpen(false)} onPointerDown={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close();
    }}>
      <header className="parents-accounts-header">
        <h2 id="parents-accounts-title">마음 전하실 곳</h2>
        <button className="parents-accounts-close" type="button" aria-label="계좌 안내 닫기" onClick={() => dialog.current?.close()}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
      </header>
      <p className="parents-accounts-intro" id="parents-accounts-intro">축하해 주시는 마음에 감사드립니다.</p>
      {parentAccountGroups.map(({ title, accounts }, groupIndex) => <section className="parents-account-group" key={title} aria-labelledby={`parents-account-group-${groupIndex}`}>
        <h3 id={`parents-account-group-${groupIndex}`}>{title}</h3>
        {accounts.length ? <ul>{accounts.map((account, index) => {
          const id = `${groupIndex}-${index}`;
          return <li className="parents-account-row" key={id}>
            <div><p className="parents-account-holder">{account.holder}</p><p className="parents-account-bank">{account.bank}</p><p className="parents-account-number">{account.number}</p></div>
            <button type="button" className="parents-account-copy" aria-label={`${account.holder}님 계좌번호 복사`} onClick={() => copyAccount(account, id)}>{copied === id ? "복사 완료" : "복사"}</button>
          </li>;
        })}</ul> : <p className="parents-account-empty">계좌 정보를 준비하고 있습니다.</p>}
      </section>)}
      <p className="parents-accounts-status" role="status" aria-live="polite">{message}</p>
    </dialog>
  </div>;
}
