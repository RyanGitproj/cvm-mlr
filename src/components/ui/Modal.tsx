"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

type ModalProps = {
  open: boolean;
  /** Fermeture par Escape ou clic sur l'arrière-plan. */
  onClose: () => void;
  titleId: string;
  descriptionId?: string;
  children: ReactNode;
};

/**
 * Modal centré réutilisable — rendu INLINE (jamais de portal hors du
 * sous-arbre thémé) pour hériter de data-theme/data-accent via les tokens.
 * Overlay opacity + panneau fade-rise (transform/opacity only), a11y complet
 * (rôle dialog, focus-trap, Escape, verrou de scroll body).
 */
export function Modal({
  open,
  onClose,
  titleId,
  descriptionId,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(panelRef, open, onClose);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fermer"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink-strong/60"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="animate-fade-rise relative w-full max-w-md rounded-2xl border-2 border-line bg-card p-6"
      >
        {children}
      </div>
    </div>
  );
}
