import { JavaScriptCalculator, WebAssemblyCalculator } from './Calculator'
import { Fractal } from './Fractal'

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
  const calculator = new JavaScriptCalculator()
  // const calculator = new WebAssemblyCalculator(await wasm)
  const fractal = new Fractal(canvas, calculator)

  const now = performance.now()
  fractal.render()
  console.log(`Mandelbrot generated in ${performance.now() - now}ms using ${calculator.name}`)

  window.addEventListener('resize', () => {
    // Update canvasses width and height
    fractal.resize(window.innerWidth, window.innerHeight - 48)
  })
})
