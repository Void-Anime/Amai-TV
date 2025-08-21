"use client";
import { useState } from "react";

export default function ReadMore({ text, max = 200 }: { text: string; max?: number }) {
  const [open, setOpen] = useState(false);
  if (!text || text.length <= max) return <p className="text-text-dim text-sm leading-6">{text}</p>;
  return (
    <div className="text-sm leading-6 text-text-dim">
      {open ? text : text.slice(0, max) + '…'}
      <button className="ml-2 text-primary hover:underline" onClick={() => setOpen(!open)}>{open ? 'Show Less' : 'Read More'}</button>
    </div>
  );
}


