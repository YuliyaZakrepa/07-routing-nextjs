'use client'
import { useEffect } from "react";
import css from "./Modal.module.css";


interface ModalProps {
  children: React.ReactNode;
  
}
export default function Modal({ children}: ModalProps) {
  

  return (
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>{children}</div>
    </div>
  );
}
