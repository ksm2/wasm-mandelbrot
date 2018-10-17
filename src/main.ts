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
  canvas.width = 1920
  canvas.height = 1080

  // Render the fractal
  const module = USE_WASM ? await wasm : js
  const name = USE_WASM ? 'WebAssembly' : 'JavaScript'
  const calculator = new Calculator(name, module)
  const fractal = new Fractal(canvas, calculator)

  const now = performance.now()
  const latencies: number[] = []
  let then
  while ((then = performance.now()) < now + 30_000) {
    fractal.render()
    latencies.push(performance.now() - then)
  }
  const end = performance.now()

  latencies.sort()

  const tp = latencies.length / (end - now) * 1000;
  const sum = latencies.reduce((latency, sum) => latency + sum, 0)
  const avg = sum / latencies.length
  const med = latencies[Math.floor(latencies.length / 2)]

  console.log(`
Measurement for ${calculator.name}
===============

Total Time:  ${(end - now).toFixed(2)} ms
Count:       ${latencies.length}
Latency avg: ${avg.toFixed(2)} ms 
Latency med: ${med.toFixed(2)} ms 
Throughput:  ${tp.toFixed(2)} 1/s 
`)

  // window.addEventListener('resize', () => {
  //   // Update canvasses width and height
  //   fractal.resize(window.innerWidth, window.innerHeight - 48)
  // })
})
