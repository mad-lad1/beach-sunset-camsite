# Beach Chill Web App

The Beach Chill web app is a Vue 3 project built with Vite, designed to provide users with a relaxing beach experience through live beach scenes and sounds. It utilizes Vue 3's `<script setup>` syntax for Single File Components (SFCs), offering a modern and efficient way to develop Vue applications.

## Features

- **Live Beach Scenes**: Streams live footage from beach cameras, switching between sunrise and sunset scenes based on the time of day.
- **Relaxing Beach Sounds**: Plays beach audio to complement the visual experience, with a toggle for mute/unmute.
- **Responsive Design**: Adapts to different screen sizes and supports dark mode, enhancing user experience across devices.

## Technical Overview

### Main Technologies

- **Vue 3**: Utilized for its reactivity and composition API, making the app highly interactive and responsive.
- **Vite**: Chosen for its fast development server and efficient build tooling, improving development experience.

### Key Components

- `src/App.vue`: The main component that orchestrates the audio and video elements, including the dynamic switching of beach scenes and audio control.
- `src/components/HelloWorld.vue`: Demonstrates Vue 3's reactivity with a simple interactive button to increment a count.

### Styling

Styling is managed through `src/style.css`, which includes global styles, dark mode support, and responsive design adjustments.

### Configuration

- **Vite Configuration**: `vite.config.js` configures Vite with the Vue plugin for processing Vue components.
- **Netlify Deployment**: `netlify.toml` ensures proper SPA routing by redirecting all paths to `index.html`.

### Development Tools

- **VS Code**: Recommended IDE for development, enhanced with the Volar extension for Vue support.
- **Extensions**: `.vscode/extensions.json` recommends essential VS Code extensions for Vue development.

## Getting Started

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the development server with `npm run dev`.

## Deployment

The app is configured for easy deployment on Netlify, with a custom redirect rule in `netlify.toml` for SPA support.

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues to suggest improvements or add new features.