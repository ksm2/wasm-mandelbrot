import { Calculator, IN_MANDELBROT_SET } from './Calculator'

function rgba(pixel: Uint8ClampedArray, offset: number, red: number, green: number, blue: number, alpha = 255) {
  pixel[offset] = red
  pixel[offset += 1] = green
  pixel[offset += 1] = blue
  pixel[offset += 1] = alpha
  return offset + 1
}

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
    const { width, height } = this.canvas
    const ctx = this.canvas.getContext('2d')!

    // Create a buffer
    const buffer = ctx.createImageData(width, height)

    // Create a writable pixel
    const pixel = buffer.data
    let offset = 0
    for (let j = 0; j < height; j += 1) {
      for (let i = 0; i < width; i += 1) {
        const [real, imaginary] = this.convertCoordinates(i, j)
        const index = this.calculator.calculate(real, imaginary)

        offset = this.colorize(index, pixel, offset)
      }
    }

    // Swap the buffer
    ctx.putImageData(buffer, 0, 0)
  }

  private convertCoordinates(x: number, y: number) {
    const { width, height } = this.canvas
    const [cw, ch] = [x - width / 2, height / 2 - y]
    const factor = Math.max(3 / width, 2 / height)
    return [cw * factor - this.x, ch * factor - this.y]
  }

  private colorize(index: number, pixel: Uint8ClampedArray, offset: number) {
    if (index === IN_MANDELBROT_SET) {
      return rgba(pixel, offset, 0, 0, 0)
    }

    return rgba(pixel, offset, 255, 255, 255, 0)
  }
}
