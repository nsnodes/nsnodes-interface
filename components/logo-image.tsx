"use client";

import Image from "next/image";
import { useTheme } from "@/components/theme-provider";

type LogoImageProps = {
  className?: string;
  width?: number;
  height?: number;
};

export function LogoImage({ className, width = 220, height = 44 }: LogoImageProps) {
  const { theme } = useTheme();
  const src = theme === "dark" ? "/logo-light.png" : "/logo-dark.png";
  return (
    <Image
      src={src}
      alt="NSNodes"
      width={width}
      height={height}
      priority
      unoptimized
      className={className ?? "h-auto w-[400px] max-w-full"}
    />
  );
}


