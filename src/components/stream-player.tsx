"use client"

import React, { useRef, useState, useCallback, useEffect } from "react"
import ReactPlayer from "react-player"
import { Maximize, Play, Pause, Volume2, VolumeX, FastForward, Rewind } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StreamPlayerProps {
  sources: Array<{
    url: string
    sourceType: string
  }>
}

// Определяем интерфейс для экземпляра ReactPlayer, чтобы TypeScript знал о методах управления
interface IReactPlayerInstance {
  getInternalPlayer: (key?: string) => HTMLVideoElement | undefined;
  seekTo: (amount: number, type?: 'seconds' | 'fraction') => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

export function StreamPlayer({ sources }: StreamPlayerProps) {
  const playerRef = useRef<IReactPlayerInstance | null>(null)
  const [internalVideoElement, setInternalVideoElement] = useState<HTMLVideoElement | null>(null);

  // Состояния для управления плеером
  const [playing, setPlaying] = useState(true); // Начать воспроизведение по умолчанию
  const [volume, setVolume] = useState(0.8); // Громкость по умолчанию
  const [muted, setMuted] = useState(false); // Состояние отключения звука
  const [played, setPlayed] = useState(0); // Прогресс видео (от 0 до 1)
  const [seeking, setSeeking] = useState(false); // Состояние, когда пользователь перематывает видео
  const [duration, setDuration] = useState(0); // Общая продолжительность видео

  const hlsSource = sources.find(s => s.sourceType === "HLS")
  const urlToPlay = hlsSource ? hlsSource.url : "";

  // Устанавливаем состояние воспроизведения при монтировании или изменении URL
  useEffect(() => {
    setPlaying(!!urlToPlay);
  }, [urlToPlay]);

  // Обработчик готовности плеера
  const handleReady = useCallback(() => {
    if (playerRef.current) {
      const internalPlayer = playerRef.current.getInternalPlayer();
      if (internalPlayer instanceof HTMLVideoElement) {
        setInternalVideoElement(internalPlayer);
      }
      setDuration(playerRef.current.getDuration()); // Получить продолжительность, когда плеер готов
    }
  }, []);

  // Переключение воспроизведения/паузы
  const handlePlayPause = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  // Изменение громкости
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setMuted(true);
    } else {
      setMuted(false);
    }
  }, []);

  // Переключение отключения звука
  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
    setVolume(prev => (prev === 0 ? 0.8 : 0)); // Переключение между 0 и громкостью по умолчанию
  }, []);

  // Обновление прогресса воспроизведения
  const handleProgress = useCallback((state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number; }) => {
    // Обновлять прогресс только если пользователь не перематывает вручную
    if (!seeking) {
      setPlayed(state.played);
    }
  }, [seeking]);

  // Начало перемотки (нажатие на ползунок прогресса)
  const handleSeekMouseDown = useCallback(() => {
    setSeeking(true);
  }, []);

  // Изменение прогресса (перетаскивание ползунка)
  const handleSeekChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
  }, []);

  // Окончание перемотки (отпускание ползунка прогресса)
  const handleSeekMouseUp = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    const newPlayed = parseFloat((e.target as HTMLInputElement).value);
    if (playerRef.current) {
      playerRef.current.seekTo(newPlayed, 'fraction');
    }
  }, []);

  // Перемотка вперед на 10 секунд
  const seekForward = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10, 'seconds');
    }
  }, []);

  // Перемотка назад на 10 секунд
  const seekBackward = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10, 'seconds');
    }
  }, []);

  // Переключение полноэкранного режима
  const handleFullscreen = useCallback(() => {
    if (internalVideoElement) {
      if (internalVideoElement.requestFullscreen) {
        internalVideoElement.requestFullscreen();
      } else if ((internalVideoElement as any).webkitEnterFullscreen) {
        (internalVideoElement as any).webkitEnterFullscreen();
      }
    } else {
      console.warn("Internal video element not ready for fullscreen.");
    }
  }, [internalVideoElement]);

  if (!urlToPlay) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black text-white">
        No HLS stream source available.
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="relative flex-grow"> {/* Этот div будет содержать плеер */}
        <ReactPlayer
          // Используем 'any' для 'player' в колбэке ref, а затем проверяем наличие метода getInternalPlayer
          ref={(player: any) => {
            if (player && typeof player.getInternalPlayer === 'function') {
              playerRef.current = player as IReactPlayerInstance;
            } else {
              playerRef.current = null;
            }
          }}
          url={urlToPlay}
          playing={playing}
          volume={muted ? 0 : volume} // Применяем состояние отключения звука
          onProgress={handleProgress}
          onDuration={setDuration} // Устанавливаем продолжительность, когда доступно
          controls={false}
          width="100%"
          height="100%"
          className="z-[15]"
          onReady={handleReady}
        />
      </div>

      {/* Пользовательские элементы управления */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 z-20">
        {/* Ползунок прогресса */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.0001" // Более мелкие шаги для плавного прогресса
          value={played}
          onMouseDown={handleSeekMouseDown}
          onChange={handleSeekChange}
          onMouseUp={handleSeekMouseUp}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        />

        <div className="flex items-center justify-between mt-2">
          {/* Воспроизведение/Пауза, Перемотка назад, Перемотка вперед */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-700/50"
              onClick={handlePlayPause}
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-700/50"
              onClick={seekBackward}
            >
              <Rewind className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-700/50"
              onClick={seekForward}
            >
              <FastForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Управление громкостью и полноэкранный режим */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-700/50"
              onClick={toggleMute}
            >
              {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-700/50"
              onClick={handleFullscreen}
              disabled={!internalVideoElement}
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}