import { Calculator } from './Calculator'

export class Fractal {
  private readonly canvas: HTMLCanvasElement
  private readonly calculator: Calculator
  private x: number = 0.5
  private y: number = 0

  constructor(canvas: HTMLCanvasElement, calculator: Calculator) {
    this.canvas = canvas
    this.calculator = calculator
  }

  resize(width: number, height: number) {
    this.canvas.width = width
    this.canvas.height = height

    this.render()
  }

  render() {
    const { x, y, canvas: { width, height } } = this
    const ctx = this.canvas.getContext('2d')!

    // Draw to a buffer
    // const now = performance.now()
    const pixels = this.calculator.calculate(x, y, width, height)
    // console.log(`Mandelbrot generated in ${performance.now() - now}ms using ${this.calculator.name}`)
    const buffer = new ImageData(new Uint8ClampedArray(pixels), width, height)

    // Swap the buffer
    ctx.putImageData(buffer, 0, 0)
  }
}
