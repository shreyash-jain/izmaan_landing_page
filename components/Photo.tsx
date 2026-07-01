import Image from "next/image";
import { ReactNode } from "react";

// Real-photo wrapper around next/image. Fills its parent (which sets the
// aspect ratio), covers, lazy-loads, and serves AVIF/WebP automatically.
export function Photo({
  src,
  alt,
  className = "",
  rounded = "rounded-2xl",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  overlay = false,
  caption,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  rounded?: string;
  sizes?: string;
  priority?: boolean;
  overlay?: boolean;
  caption?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden ${rounded} bg-mist/40 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition duration-700 will-change-transform"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-deepsea/45 via-deepsea/5 to-transparent" />
      )}
      {caption && (
        <span className="absolute bottom-3 left-3 z-10 rounded-full bg-white/85 px-3 py-1 font-heading text-[10px] font-medium uppercase tracking-wide text-deepsea/80 backdrop-blur">
          {caption}
        </span>
      )}
      {children}
    </div>
  );
}
