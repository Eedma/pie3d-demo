import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { InstancedFlow } from "three/examples/jsm/modifiers/CurveModifier.js";
import { Flow } from "three/examples/jsm/modifiers/CurveModifier.js";

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/* 
    fonts
*/
const fontLoader = new FontLoader()

class TextParams {
    constructor(font) {
        this.font = font
    }

    addParams() {
        return {
            font: this.font,
            size: 0.5,
            height: 0.2,
            curveSegments: 6,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 2
        }
    }
}

let textGeometry;
let textMesh;

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        textGeometry = new TextGeometry('pieinthesky', new TextParams(font).addParams())
        textGeometry.computeBoundingBox()
        const textMaterial = new THREE.MeshNormalMaterial()
        textMesh = new THREE.Mesh(textGeometry, textMaterial)
        textGeometry.center()
        textMesh.position.z = 3

        scene.add(textMesh)
    }
)


/**
 * Object
 */
const sphereGeometry = new THREE.SphereGeometry(2)
const sphereMaterial = new THREE.MeshStandardMaterial()
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)

gui.add(sphereMaterial, 'metalness', 0, 1, 0.001)
gui.add(sphereMaterial, 'roughness', 0, 1, 0.001)


/* 
 * Lights
*/

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(ambientLight, pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

camera.position.z = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    /*     if (textMesh) {
    
            textMesh.position.z = Math.cos(elapsedTime) * Math.PI
            textMesh.position.x = Math.sin(elapsedTime) * Math.PI
            textMesh.rotation.y = elapsedTime
    
        } */

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()