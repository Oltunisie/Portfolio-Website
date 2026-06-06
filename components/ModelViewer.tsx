"use client";

import { useEffect } from "react";
import type { ModelViewerElement } from "@google/model-viewer";

// Register the custom element type so JSX accepts <model-viewer>
type ModelViewerJSX = Omit<Partial<ModelViewerElement>, "style"> & {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace React.JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerJSX;
    }
  }
}

export default function ModelViewer({
  src, alt,
  autoRotate = true,
  exposure = 0.9,
}: {
  src: string;
  alt: string;
  autoRotate?: boolean;
  exposure?: number;
}) {
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  return (
    <model-viewer
      src={src}
      alt={alt}
      camera-controls
      {...(autoRotate ? { "auto-rotate": true } : {})}
      shadow-intensity={0.8}
      exposure={exposure}
      environment-image="neutral"
      tone-mapping="commerce"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        // @ts-expect-error model-viewer CSS custom property
        "--mv-background-color": "transparent",
      }}
    />
  );
}
