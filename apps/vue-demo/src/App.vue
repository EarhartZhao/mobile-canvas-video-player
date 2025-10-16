<template>
  <div class="demo-container">
    <div class="demo-header">
      <h1>Mobile Video Player</h1>
      <p>Vue3 + Vite + Canvas</p>
    </div>

    <div class="demo-player">
      <MobileVideoPlayer
        ref="playerRef"
        :src="videoSrc"
        :width="375"
        :height="375"
        :controls="{
          playPause: true,
          mute: true,
          fullscreen: true,
          progressBar: true,
          timeDisplay: true,
        }"
        @play="onPlay"
        @pause="onPause"
        @canplay="onCanPlay"
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
        @error="onError"
      />
    </div>

    <div class="demo-info">
      <h3>功能特性：</h3>
      <ul>
        <li>✅ Canvas 渲染视频</li>
        <li>✅ 支持 HLS 流媒体</li>
        <li>✅ 移动端手势控制</li>
        <li>✅ 全屏播放</li>
        <li>✅ 进度条拖拽</li>
        <li>✅ 音量控制</li>
        <li>✅ 响应式设计</li>
      </ul>

      <h3 style="margin-top: 20px">当前状态：</h3>
      <p>播放状态: {{ isPlaying ? "播放中" : "暂停" }}</p>
      <p>当前时间: {{ formatTime(currentTime) }}</p>

      <h3 style="margin-top: 20px">控制方法测试：</h3>
      <button @click="testSeek">跳转到10秒</button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { MobileVideoPlayer } from "@mobile-canvas-video-player/vue";
import "@mobile-canvas-video-player/vue/style.css";

export default {
  name: "App",
  components: {
    MobileVideoPlayer,
  },
  setup() {
    const playerRef = ref(null);
    const videoSrc = ref(
      "https://test-streams.mux.dev/x36xhzz/url_6/193039199_mp4_h264_aac_hq_7.m3u8"
    );
    const isPlaying = ref(false);
    const currentTime = ref(0);

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    };

    const onCanPlay = () => {
      console.log("视频可以播放");
      playerRef.value?.play();
    };

    const onPlay = () => {
      isPlaying.value = true;
      // playerRef.value?.setMuted(false)
    };

    const onPause = () => {
      isPlaying.value = false;
      console.log("视频暂停");
    };

    const onTimeUpdate = (time) => {
      currentTime.value = time;
    };

    const onEnded = () => {
      console.log("视频播放结束");
    };

    const onError = (error) => {
      console.error("视频播放错误:", error);
    };

    const testSeek = () => {
      playerRef.value?.seek(10);
    };

    return {
      playerRef,
      videoSrc,
      isPlaying,
      currentTime,
      formatTime,
      onCanPlay,
      onPlay,
      onPause,
      onTimeUpdate,
      onEnded,
      onError,
      testSeek,
    };
  },
};
</script>
