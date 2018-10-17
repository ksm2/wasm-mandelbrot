import { Calculator } from './Calculator'
import { Fractal } from './Fractal'
import * as js from './lib'

const wasm = import('mandelbrot')

declare const USE_WASM: boolean

console.log(USE_WASM)

window.addEventListener('load', async () => {
  // Retrieve HTML elements
  const container = document.querySelector('#canvas-container') as HTMLDivElement | null
  const canvas = document.querySelector('canvas')
  if (!container || !canvas) {
    throw new Error('HTML elements are missing.')
  }

  // Update canvasses width and height
  const { offsetWidth: width, offsetHeight: height } = container
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight - 48

  // Render the fractal
  const module = USE_WASM ? await wasm : js
  const name = USE_WASM ? 'WebAssembly' : 'JavaScript'
  const calculator = new Calculator(name, module)
  const fractal = new Fractal(canvas, calculator)

  fractal.render()

  window.addEventListener('resize', () => {
    // Update canvasses width and height
    fractal.resize(window.innerWidth, window.innerHeight - 48)
  })
})
