<template>
  <div class="aframe-container">
    <div v-if="loading" class="loading">Chargement de la scène 3D...</div>
    <a-scene v-else embedded ref="scene">
      <!-- Déclarer les assets -->
      <a-assets>
        <a-asset-item id="monModele" src="/models/clubhouse.glb"></a-asset-item>
        <a-asset-item id="jersey" src="/models/sanglier.glb"></a-asset-item>
      </a-assets>
      
      <!-- Afficher le modèle GLB -->


      <a-entity 
        gltf-model="/models/clubhouse.glb"
        position="0 0 -5"
        rotation="0 0 0"
        scale="1 1 1">
      </a-entity>

    <a-entity 
        gltf-model="/models/sanglier.glb"
        position="6 1.4 0"
        rotation="0 180 0"
        animation="property: position; to: 6 1.4 0.3; dir: alternate; loop: true; dur: 2000"
        scale="1 1 1">
      </a-entity>

    <a-entity 
        gltf-model="/models/dart.glb"
        position="5 2.4 -9.86"
        rotation="0 0 0"
        scale="2 2 2">
      </a-entity>

    <a-entity 
        gltf-model="/models/frame.glb"
        position="7 2.4 -9.86"
        rotation="0 0 90"
        scale="2 2 2">
    </a-entity>

    <a-image 
        src="/images/team/matis.png"
        position="7 2.4 -9.86"
        width="1.7"
        height="1.2">
    </a-image>
      
    <a-entity 
        gltf-model="/models/frame.glb"
        position="9 2.4 -7"
        rotation="0 90 0"
        scale="2 2 2">
    </a-entity>

    <a-image 
        src="/images/team/team.png"
        position="9 2.4 -7"
        width="1.1"
        rotation="0 90 0"
        height="1.6">
    </a-image>

    <a-entity 
        gltf-model="/models/frame.glb"
        position="9 2.4 -9"
        rotation="0 90 90"
        scale="2 2 2">
    </a-entity>

    <a-image 
        src="/images/team/simon.png"
        position="9 2.4 -9"
        width="1.6"
        rotation="0 90 0"
        height="1">
    </a-image>

       <a-entity 
        gltf-model="/models/frame.glb"
        position="9 2.4 -3"
        rotation="0 90 90"
        scale="2 2 2">
    </a-entity>

    <a-image 
        src="/images/team/quentin.png"
        position="9 2.4 -3"
        width="1.6"
        rotation="0 90 0"
        height="1">
    </a-image>

    <a-entity 
        gltf-model="/models/jersey.glb"
        id="jersey"
        position="8 1.4 -5"
        rotation="0 -90 0"
        animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear"
        scale="1 1 1">
      </a-entity>

    <a-entity 
        gltf-model="/models/display.glb"
        position="8 1 -5"
        rotation="0 -90 0"
        scale="1 1 1">
      </a-entity>

    <a-entity 
        gltf-model="/models/lamp.glb"
        position="8 4.5 -5"
        rotation="0 -90 0"
        scale="1.5 1.5 1.5">
      </a-entity>

     
      <!-- Lumières -->
      <a-light type="ambient" color="#BBB"></a-light>
      <a-light 
            type="spot" 
            color="#FFFFFF" 
            intensity="2"
            angle="180"
            penumbra="0.2"
            distance="20"
            position="9 1 -5"></a-light> 
      
      <!-- Caméra avec contrôles -->
      <a-camera position="4 2.1 -3" rotation="0 0 90"
        wasd-controls="acceleration: 20">
></a-camera>
      
      <!-- Environnement -->
      <a-sky src="/images/background/univers.jpg"></a-sky>

    </a-scene>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const loading = ref(true);
const scene = ref(null);

onMounted(() => {
  if (!window.AFRAME) {
    const script = document.createElement('script');
    script.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
    script.onload = () => {
      // Attendre un peu avant d'afficher la scène
      setTimeout(() => {
        loading.value = false;
      }, 100);
    };
    document.head.appendChild(script);
  } else {
    loading.value = false;
  }
});
</script>

<style scoped>
.aframe-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 1.5rem;
  color: #666;
}
</style>