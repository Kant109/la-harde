<template>
  <div
    ref="canvasContainer"
    class="three-model-container"
    :style="{ height: height }"
  ></div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface Props {
  modelPath: string
  height?: string
  enableRotation?: boolean
  enableZoom?: boolean
  backgroundColor?: string
  autoRotate?: boolean
  autoRotateSpeed?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  enableRotation: true,
  enableZoom: false,
  backgroundColor: '#1a1a1a',
  autoRotate: false,
  autoRotateSpeed: 0.005
})

const canvasContainer = ref<HTMLElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let model: THREE.Group
let controls: OrbitControls
let animationFrameId: number

const initThreeJS = async () => {
  if (!canvasContainer.value) return

  // Create scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(props.backgroundColor)

  // Create camera
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  canvasContainer.value.appendChild(renderer.domElement)

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(5, 5, 5)
  scene.add(pointLight)

  const pointLight2 = new THREE.PointLight(0xDBD2C3, 0.5)
  pointLight2.position.set(-5, -5, -5)
  scene.add(pointLight2)

  // Add orbit controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  if (props.enableRotation) {
    // Rotation horizontale uniquement
    controls.minPolarAngle = Math.PI / 2 // 90 degrés
    controls.maxPolarAngle = Math.PI / 2 // 90 degrés
  } else {
    // Bloquer toute rotation
    controls.enabled = false
  }

  // Zoom
  controls.enableZoom = props.enableZoom
  controls.enablePan = false

  // Charger le modèle 3D
  try {
    const loader = new GLTFLoader()
    const gltf = await new Promise<any>((resolve, reject) => {
      loader.load(props.modelPath, resolve, undefined, reject)
    })

    model = gltf.scene

    // Centrer et redimensionner le modèle
    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 6 / maxDim // Augmenté de 2 à 3 pour un modèle 50% plus grand

    model.position.sub(center)
    model.position.y -= 2 // Baisser le modèle pour éviter que le haut soit coupé
    model.scale.multiplyScalar(scale)

    scene.add(model)
  } catch (error) {
    console.error('Erreur lors du chargement du modèle 3D:', error)
  }

  // Handle window resize
  const handleResize = () => {
    if (!canvasContainer.value) return
    const width = canvasContainer.value.clientWidth
    const height = canvasContainer.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
  window.addEventListener('resize', handleResize)

  // Animation loop
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)

    // Rotation automatique horizontale
    if (props.autoRotate && model) {
      model.rotation.y += props.autoRotateSpeed
    }

    controls.update()
    renderer.render(scene, camera)
  }
  animate()
}

onMounted(() => {
  if (process.client) {
    initThreeJS()
  }
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (renderer) {
    renderer.dispose()
  }
  if (controls) {
    controls.dispose()
  }
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.three-model-container {
  width: 100%;
  background: transparent;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.three-model-container canvas {
  display: block;
  margin: 0 auto;
}
</style>
