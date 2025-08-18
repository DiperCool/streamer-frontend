"use client";

import React, { useRef, useEffect, forwardRef, useState } from "react";
import Script from "next/script";
import ReactPlayer from "react-player"; // Импортируем ReactPlayer здесь

export interface WhepPlayerProps {
    src: string;
    playing?: boolean;
    muted?: boolean;
    controls?: boolean;
    loop?: boolean;
    width?: string | number;
    height?: string | number;
}

export const WhepPlayer = forwardRef<HTMLVideoElement, WhepPlayerProps>(
    ({ src, playing = true, muted, controls, loop, width = "100%", height = "100%" }, ref) => {
        const videoRef = useRef<HTMLVideoElement>(null);
        const [scriptLoaded, setScriptLoaded] = useState(false);

        // Регистрируем кастомный плеер здесь, как только ReactPlayer доступен и компонент смонтирован
        useEffect(() => {
            if (ReactPlayer.addCustomPlayer) {
                ReactPlayer.addCustomPlayer({
                    key: "whep",
                    name: "WHEP WebRTC",
                    player: WhepPlayer as any,
                    canPlay: (url: string) => typeof url === "string" && url.includes("/whep"),
                });
            }
        }, []); // Пустой массив зависимостей гарантирует, что это выполнится один раз при монтировании

        useEffect(() => {
            if (!src || !scriptLoaded) return;

            const player = new (window as any).MediaMTXWebRTCReader({
                url: src,
                onError: (err: string) => console.error("WHEP error:", err),
                onTrack: (evt: any) => {
                    const videoEl = (ref as any)?.current || videoRef.current;
                    if (videoEl) videoEl.srcObject = evt.streams[0];
                },
            });

            return () => player.close();
        }, [src, ref, scriptLoaded, videoRef]);

        return (
            <>
                {/* Подключаем WHEP скрипт только на клиенте */}
                <Script
                    src="/reader.js"
                    strategy="afterInteractive"
                    onLoad={() => setScriptLoaded(true)}
                />
                <video
                    ref={ref || videoRef}
                    autoPlay={playing}
                    muted={muted}
                    controls={controls}
                    loop={loop}
                    style={{ width, height, background: "black" }}
                    playsInline
                />
            </>
        );
    }
);

WhepPlayer.displayName = "WhepPlayer"; // Добавляем displayName для отладки

export default WhepPlayer;