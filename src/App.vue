<template>
  <div class="container">
    <audio ref="audioPlayer" :src="audioFile" loop></audio>
    <button class="play-button" @click="toggleAudio" :class="{ 'is-muted': isMuted }">
      <SpeakerXMarkIcon v-if="isMuted" class="icon" />
      <SpeakerWaveIcon v-else class="icon" />
    </button>

    <video ref="videoPlayer" autoplay muted loop playsinline class="background-video" :class="{ 'night-mode': isNightTime }"></video>
    <div class="overlay"></div> <!-- Added overlay for subtle darkening effect -->
    <div class="content">
      <div class="time-display">{{ timeDisplay }}</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import Hls from 'hls.js';
import { HLS_STREAM } from './constants';
import audioFile from './assets/beach.mp3';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/vue/24/outline';

const videoPlayer = ref(null);
const timeDisplay = ref('00:00:00');
const audioPlayer = ref(null);
const isMuted = ref(true);

const isNightTime = computed(() => {
  const hours = new Date().getHours();
  return hours < 6 || hours > 18;
});

const toggleAudio = () => {
  if (audioPlayer.value) {
    isMuted.value = !isMuted.value;
    isMuted.value ? audioPlayer.value.pause() : audioPlayer.value.play();
  }
};

setInterval(() => {
  const now = new Date();
  timeDisplay.value = now.toTimeString().split(' ')[0];
}, 1000);

onMounted(() => {
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(HLS_STREAM);
    hls.attachMedia(videoPlayer.value);
    hls.on(Hls.Events.MANIFEST_PARSED, () => videoPlayer.value.play());
  } else if (videoPlayer.value.canPlayType('application/vnd.apple.mpegurl')) {
    videoPlayer.value.src = HLS_STREAM;
    videoPlayer.value.addEventListener('loadedmetadata', () => videoPlayer.value.play());
  }
});
</script>

<style>
.container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  width: 100vw;
  margin: 0;
  padding: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.background-video {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}
.background-video.night-mode {
  filter: brightness(100%);
}
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
}
.content {
  position: relative;
  z-index: 2;
  text-align: center;
}
.time-display {
  font-size: 4rem;
  color: white;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}
.play-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 3;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  padding: 10px;
  border-radius: 50%;
}
.icon {
  width: 32px;
  height: 32px;
  color: white;
}
.icon:hover {
  cursor: pointer;
  color: #ffcc00; /* Highlight color on hover */
}
.is-muted .icon {
  color: #777; /* Muted icon color */
}
</style>
