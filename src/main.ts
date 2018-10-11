import { Calculator } from './Calculator'
import { Fractal } from './Fractal'
import * as js from './lib'

const wasm = import('mandelbrot')

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
  // const calculator = new Calculator('JavaScript', js)
  const calculator = new Calculator('WebAssembly', await wasm)
  const fractal = new Fractal(canvas, calculator)

  fractal.render()

  window.addEventListener('resize', () => {
    // Update canvasses width and height
    fractal.resize(window.innerWidth, window.innerHeight - 48)
  })
})
