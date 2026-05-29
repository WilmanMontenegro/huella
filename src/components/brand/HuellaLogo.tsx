import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface HuellaLogoProps {
  variant?: "horizontal" | "vertical";
  size?: "default" | "hero";
  href?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function HuellaLogo({
  variant = "horizontal",
  size = "default",
  href = "/",
  className,
  imageClassName,
  priority = false,
}: HuellaLogoProps) {
  const src =
    variant === "horizontal"
      ? "/brand/logo-horizontal.png"
      : "/brand/logo-vertical.png";

  const dimensions =
    variant === "horizontal"
      ? { width: 240, height: 72, sizes: "(max-width: 640px) 200px, 240px" }
      : size === "hero"
        ? { width: 280, height: 380, sizes: "(max-width: 640px) 220px, 280px" }
        : { width: 160, height: 220, sizes: "(max-width: 640px) 160px, 180px" };

  const sizeClass =
    variant === "horizontal"
      ? "h-14 w-auto sm:h-16 md:h-[4.5rem]"
      : size === "hero"
        ? "h-52 w-auto sm:h-60 md:h-72"
        : "h-40 w-auto sm:h-44";

  const image = (
    <Image
      src={src}
      alt="Huella"
      width={dimensions.width}
      height={dimensions.height}
      sizes={dimensions.sizes}
      priority={priority}
      className={cn(sizeClass, imageClassName)}
    />
  );

  if (!href) {
    return <div className={className}>{image}</div>;
  }

  return (
    <Link href={href} className={cn("inline-flex shrink-0 transition-opacity hover:opacity-90", className)}>
      {image}
    </Link>
  );
}
