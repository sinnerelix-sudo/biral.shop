import Link from "next/link";
import type { InputHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes, ReactNode, HTMLAttributes } from "react";

export function Container({ children }: { children: ReactNode }) {
  return <div className="container">{children}</div>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`.trim()}>{children}</section>;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  return <button {...props} className={`btn btn-${variant} ${className}`.trim()} />;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`input ${props.className ?? ""}`.trim()} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`textarea ${props.className ?? ""}`.trim()} />;
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className="label">{children}</label>;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Divider() {
  return <hr className="divider" />;
}

export function IconButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`icon-button ${props.className ?? ""}`.trim()}>{children}</button>;
}

export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`skeleton ${className}`.trim()} aria-hidden="true" {...props} />;
}

export function LinkButton({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="btn btn-secondary">{children}</Link>;
}
