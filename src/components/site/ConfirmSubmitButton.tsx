"use client";

import { useCallback } from "react";

type Props = {
  formId: string;
  label: string;
  confirmText: string;
  className?: string;
};

export default function ConfirmSubmitButton({ formId, label, confirmText, className }: Props) {
  const onClick = useCallback(() => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;
    if (confirm(confirmText)) {
      form.requestSubmit();
    }
  }, [formId, confirmText]);

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}
