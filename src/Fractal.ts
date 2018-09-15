import { Calculator, IN_MANDELBROT_SET } from './Calculator'

function rgba(pixel: Uint8ClampedArray, red: number, green: number, blue: number, alpha = 255) {
  pixel[0] = red
  pixel[1] = green
  pixel[2] = blue
  pixel[3] = alpha
}

export class Fractal {
  private readonly canvas: HTMLCanvasElement
  private readonly calculator: Calculator
  private x: number = 0
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
    // Create a writable pixel
    const ctx = this.canvas.getContext('2d')!
    const id = ctx.createImageData(1, 1)
    const pixel = id.data

    const { width, height } = this.canvas
    for (let j = 0; j < height; j += 1) {
      for (let i = 0; i < width; i += 1) {
        const [real, imaginary] = this.convertCoordinates(i, j)
        const index = this.calculator.calculate(real, imaginary)

        this.colorize(index, pixel)
        ctx.putImageData(id, i, j)
      }
    }
  }

  private convertCoordinates(x: number, y: number) {
    const { width, height } = this.canvas
    const factor = Math.max(3 / width, 2 / height)
    return [(x - this.x) * factor - 2, (height - y + this.y) * factor - 1]
  }

  private colorize(index: number, pixel: Uint8ClampedArray) {
    if (index === IN_MANDELBROT_SET) {
      rgba(pixel, 0, 0, 0)
      return
    }

    rgba(pixel, 255, 255, 255, 0)
  }
}
