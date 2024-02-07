<template>
  <!-- Main template for the application -->
  <Suspense>
    <!-- Default content to display -->
    <template #default>
      <div class="container">
        <!-- Stream Selector -->
        <div class="stream-selector">
          <button @click="selectStream('sunrise')">Sunrise</button>
          <button @click="selectStream('sunset')">Sunset</button>
        </div>
        <!-- Audio player setup -->
        <audio ref="audioPlayer" :src="audioFile" loop></audio>
        <!-- Toggle button for audio with dynamic class for mute/unmute -->
        <button class="play-button" @click="toggleAudio" :class="{ 'is-muted': isMuted }">
          <!-- Icons change based on mute state -->
          <SpeakerXMarkIcon v-if="isMuted" class="icon" />
          <SpeakerWaveIcon v-else class="icon" />
        </button>
        <!-- Video player setup with autoplay, mute, and loop attributes -->
        <video ref="videoPlayer" autoplay muted loop playsinline class="background-video"
          :class="{ 'night-mode': isNightTime }"></video>
        <div class="overlay"></div> <!-- Overlay for darkening effect -->
        <div class="content">
          <!-- Display current time -->
          <div class="time-display">{{ timeDisplay }}</div>
        </div>
      </div>
    </template>
    <!-- Fallback content when loading -->
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref, computed, onBeforeMount, watch } from 'vue';
import Hls from 'hls.js';
import audioFile from './assets/beach.mp3';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/vue/24/outline';
import { extractSource, sunriseStream, sunsetStream } from './constants';

const HLS_STREAM = ref('');
const videoPlayer = ref(null);
const timeDisplay = ref('00:00:00');
const audioPlayer = ref(null);
const isMuted = ref(true);
const currentStream = ref('sunrise'); // New reactive variable to store the current stream choice

/**
 * Initializes the video player with HLS stream based on the current stream choice.
 * Called on component mount and whenever the current stream changes.
 */
const initialize = async () => {
  const hls = await extractSource(currentStream.value === 'sunrise' ? sunriseStream : sunsetStream);
  HLS_STREAM.value = hls;
  setupPlayer();
};

// Watch the currentStream variable to re-initialize the player when it changes
watch(currentStream, () => {
  initialize();
});

// Periodically update HLS stream every hour, respecting the current stream choice
setInterval(async () => {
  const hls = await extractSource(currentStream.value === 'sunrise' ? sunriseStream : sunsetStream);
  HLS_STREAM.value = hls;
}, 3600000);

// Computed property to determine if it's night time
const isNightTime = computed(() => {
  const hours = new Date().getHours();
  return hours < 6 || hours > 18;
});

/**
 * Toggles audio playback and mute state.
 */
const toggleAudio = () => {
  if (audioPlayer.value) {
    isMuted.value = !isMuted.value;
    isMuted.value ? audioPlayer.value.pause() : audioPlayer.value.play();
  }
};

// Update time display every second
setInterval(() => {
  const now = new Date();
  timeDisplay.value = now.toTimeString().split(' ')[0];
}, 1000);

/**
 * Sets up the HLS player for the video element.
 */
function setupPlayer() {
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(HLS_STREAM.value);
    hls.attachMedia(videoPlayer.value);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoPlayer.value.play();
    });
  } else if (videoPlayer.value.canPlayType('application/vnd.apple.mpegurl')) {
    videoPlayer.value.src = HLS_STREAM.value;
    videoPlayer.value.addEventListener('loadedmetadata', () => {
      videoPlayer.value.play();
    });
  }
}

// Method to select stream based on user choice
const selectStream = (streamType) => {
  currentStream.value = streamType;
};

// Initialize video player on component mount
onBeforeMount(() => {
  initialize();
});
</script>

<style>
/* Styling for the main container */
.container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  width: 100vw;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Styling for the background video */
.background-video {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

/* Additional styling for night mode */
.background-video.night-mode {
  filter: brightness(100%);
}

/* Styling for the overlay */
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
}

/* Styling for the content area */
.content {
  position: relative;
  z-index: 2;
  text-align: center;
}

/* Styling for the time display */
.time-display {
  font-size: 4rem;
  color: white;
  padding: 0.5rem;
  border-radius: 10px;
}

/* Styling for the play button */
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

/* Styling for icons */
.icon {
  width: 32px;
  height: 32px;
  color: white;
}

/* Hover effect for icons */
.icon:hover {
  cursor: pointer;
  color: #ffcc00;
}

/* Styling for muted state */
.is-muted .icon {
  color: #777;
}
.stream-selector {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 3;
  display: flex;
  gap: 10px;
}

.stream-selector button {
  background: rgba(255, 255, 255, 0.8);
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.stream-selector button:hover {
  background: rgba(255, 255, 255, 1);
}
</style>
