import { Calculator, IN_MANDELBROT_SET } from './Calculator'

type BlendStop = [number, number, number, number]

function rgba(pixel: Uint8ClampedArray, offset: number, red: number, green: number, blue: number, alpha = 255) {
  pixel[offset] = red
  pixel[offset += 1] = green
  pixel[offset += 1] = blue
  pixel[offset += 1] = alpha
  return offset + 1
}

function blend(pixel: Uint8ClampedArray, offset: number, index: number, ...blendStops: BlendStop[]) {
  const iterator = blendStops[Symbol.iterator]()
  const { done, value } = iterator.next()
  if (done) throw new Error(`A final blend step is missing for index ${index}.`)
  let [from, r1, g1, b1] = value

  for (const [to, r2, g2, b2] of iterator) {
    if (index >= from && index < to) {
      const f = (index - from) / (to - from)
      const g = 1 - f

      return rgba(pixel, offset, Math.round(r1 * g + r2 * f), Math.round(g1 * g + g2 * f), Math.round(b1 * g + b2 * f))
    }

    [from, r1, g1, b1] = [to, r2, g2, b2]
  }

  throw new Error(`No matching blend step found for index ${index}.`)
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
    const factor = Math.max(3 / width, 2 / height)
    let offset = 0
    for (let j = height / 2; j > -height / 2; j -= 1) {
      for (let i = -width / 2; i < width / 2; i += 1) {
        const [real, imaginary] = [i * factor - this.x, j * factor - this.y]
        const index = this.calculator.calculate(real, imaginary)

        offset = this.colorize(index, pixel, offset)
      }
    }

    // Swap the buffer
    ctx.putImageData(buffer, 0, 0)
  }

  private colorize(index: number, pixel: Uint8ClampedArray, offset: number) {
    if (index === IN_MANDELBROT_SET) {
      return rgba(pixel, offset, 0, 0, 0)
    }

    return blend(
      pixel,
      offset,
      index % 100,
      [0, 0x22, 0x22, 0xBB],
      [20, 0x88, 0x88, 0xFF],
      [40, 0xFF, 0xFF, 0xFF],
      [60, 0xFF, 0xFF, 0x00],
      [80, 0xFF, 0x88, 0x00],
      [100, 0x88, 0xFF, 0x00],
      [120, 0x00, 0xFF, 0x00],
    )
  }
}
