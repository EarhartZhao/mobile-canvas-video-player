export interface VideoPlayerOptions {
    loop?: boolean;
    preload?: 'auto' | 'metadata' | 'none';
}
export interface VideoPlayerState {
    isPlaying: boolean;
    isMuted: boolean;
    isFullscreen: boolean;
    isLoading: boolean;
    currentTime: number;
    duration: number;
    buffered: number;
    volume: number;
}
export type VideoPlayerEvent = 'loadstart' | 'loadedmetadata' | 'canplay' | 'play' | 'pause' | 'timeupdate' | 'progress' | 'volumechange' | 'ended' | 'error';
export type EventCallback<T = any> = (data?: T) => void;
export declare class VideoPlayer {
    options: Required<VideoPlayerOptions>;
    state: VideoPlayerState;
    private callbacks;
    private hls;
    private video;
    private canvas;
    private ctx;
    constructor(options?: VideoPlayerOptions);
    init(canvasElement: HTMLCanvasElement, src: string): void;
    private setupVideoElement;
    private setupEventListeners;
    private startRenderLoop;
    loadSource(src: string): void;
    play(): Promise<void> | undefined;
    pause(): void;
    seek(time: number): void;
    setVolume(volume: number): void;
    mute(): void;
    unmute(): void;
    toggleMute(): void;
    setMuted(muted: boolean): void;
    enterFullscreen(): void;
    exitFullscreen(): void;
    on(event: VideoPlayerEvent, callback: EventCallback): void;
    emit(event: VideoPlayerEvent, data?: any): void;
    destroy(): void;
    formatTime(seconds: number): string;
    getVideoSize(): {
        width: number;
        height: number;
    } | null;
}
//# sourceMappingURL=VideoPlayer.d.ts.map