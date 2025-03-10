"use client";

export function FancyTitle({ title }: { title: string }) {
  return (
    <div className="mt-7 pb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-5xl font-bold text-transparent">
      {title}
    </div>
  );
}
