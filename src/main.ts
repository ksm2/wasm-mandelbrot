import { JavascriptCalculator } from './Calculator'
import { Fractal } from './Fractal'

window.addEventListener('load', () => {
  // Retrieve HTML elements
  const container = document.querySelector('#canvas-container') as HTMLDivElement | null
  const canvas = document.querySelector('canvas')
  if (!container || !canvas) {
    throw new Error('HTML elements are missing.')
  }

  // Update canvasses width and height
  const [width, height] = [450, 300]
  canvas.width = width
  canvas.height = height

  // Render the fractal
  const calculator = new JavascriptCalculator()
  const fractal = new Fractal(canvas, calculator)

  const now = performance.now()
  fractal.render()
  console.log(`Mandelbrot generated in ${performance.now() - now}ms using JavaScript`)
})
