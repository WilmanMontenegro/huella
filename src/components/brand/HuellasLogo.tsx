import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface HuellasLogoProps {
  variant?: "horizontal" | "vertical";
  href?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function HuellasLogo({
  variant = "horizontal",
  href = "/",
  className,
  imageClassName,
  priority = false,
}: HuellasLogoProps) {
  const src =
    variant === "horizontal"
      ? "/brand/logo-horizontal.png"
      : "/brand/logo-vertical.png";

  const dimensions =
    variant === "horizontal"
      ? { width: 180, height: 56, sizes: "180px" }
      : { width: 120, height: 160, sizes: "120px" };

  const image = (
    <Image
      src={src}
      alt="Huellas"
      width={dimensions.width}
      height={dimensions.height}
      sizes={dimensions.sizes}
      priority={priority}
      className={cn(
        variant === "horizontal" ? "h-10 w-auto" : "h-32 w-auto",
        imageClassName
      )}
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
