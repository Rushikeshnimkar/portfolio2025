"use client";
import React, { useRef, useEffect, useId, useCallback } from "react";

// Utility functions for the shader
function smoothStep(a: number, b: number, t: number): number {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
}

function length(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
}

function roundedRectSDF(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
): number {
    const qx = Math.abs(x) - width + radius;
    const qy = Math.abs(y) - height + radius;
    return (
        Math.min(Math.max(qx, qy), 0) +
        length(Math.max(qx, 0), Math.max(qy, 0)) -
        radius
    );
}

interface LiquidGlassProps {
    children: React.ReactNode;
    className?: string;
    width?: number;
    height?: number;
    borderRadius?: number;
    /** Intensity of the distortion effect (default: 0.8) */
    intensity?: number;
}

export function LiquidGlass({
    children,
    className = "",
    width = 300,
    height = 50,
    borderRadius = 9999,
    intensity = 0.8,
}: LiquidGlassProps) {
    const uniqueId = useId().replace(/:/g, "");
    const filterId = `liquid-glass-filter-${uniqueId}`;
    const feImageId = `liquid-glass-map-${uniqueId}`;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const feImageRef = useRef<SVGFEImageElement>(null);
    const feDisplacementMapRef = useRef<SVGFEDisplacementMapElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const updateShader = useCallback(() => {
        const canvas = canvasRef.current;
        const feImage = feImageRef.current;
        const feDisplacementMap = feDisplacementMapRef.current;

        if (!canvas || !feImage || !feDisplacementMap) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const w = canvas.width;
        const h = canvas.height;
        const data = new Uint8ClampedArray(w * h * 4);

        let maxScale = 0;
        const rawValues: number[] = [];

        // Calculate the SDF-based displacement
        const aspectRatio = w / h;
        const sdfWidth = 0.4;
        const sdfHeight = 0.4 / aspectRatio;

        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % w;
            const y = Math.floor(i / 4 / w);

            const uvX = x / w;
            const uvY = y / h;

            const ix = uvX - 0.5;
            const iy = uvY - 0.5;

            const distanceToEdge = roundedRectSDF(ix, iy, sdfWidth, sdfHeight, 0.5);
            const displacement = smoothStep(intensity, 0, distanceToEdge - 0.1);
            const scaled = smoothStep(0, 1, displacement);

            const newX = ix * scaled + 0.5;
            const newY = iy * scaled + 0.5;

            const dx = newX * w - x;
            const dy = newY * h - y;

            maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
            rawValues.push(dx, dy);
        }

        maxScale *= 0.5;

        let index = 0;
        for (let i = 0; i < data.length; i += 4) {
            const r = rawValues[index++] / maxScale + 0.5;
            const g = rawValues[index++] / maxScale + 0.5;
            data[i] = r * 255;
            data[i + 1] = g * 255;
            data[i + 2] = 0;
            data[i + 3] = 255;
        }

        context.putImageData(new ImageData(data, w, h), 0, 0);
        feImage.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "href",
            canvas.toDataURL()
        );
        feDisplacementMap.setAttribute("scale", (maxScale).toString());
    }, [intensity]);

    useEffect(() => {
        updateShader();
    }, [updateShader, width, height]);

    return (
        <>
            {/* Hidden SVG for the filter definition */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0"
                height="0"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                    zIndex: -1,
                }}
            >
                <defs>
                    <filter
                        id={filterId}
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                        x="0"
                        y="0"
                        width={width.toString()}
                        height={height.toString()}
                    >
                        <feImage
                            ref={feImageRef}
                            id={feImageId}
                            width={width.toString()}
                            height={height.toString()}
                        />
                        <feDisplacementMap
                            ref={feDisplacementMapRef}
                            in="SourceGraphic"
                            in2={feImageId}
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>

            {/* Hidden canvas for generating the displacement map */}
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{ display: "none" }}
            />

            {/* The actual glass container */}
            <div
                ref={containerRef}
                className={className}
                style={{
                    backdropFilter: `url(#${filterId}) blur(1px) contrast(1.1) brightness(1.05) saturate(1.1)`,
                    WebkitBackdropFilter: `url(#${filterId}) blur(1px) contrast(1.1) brightness(1.05) saturate(1.1)`,
                    borderRadius: `${borderRadius}px`,
                }}
            >
                {children}
            </div>
        </>
    );
}
