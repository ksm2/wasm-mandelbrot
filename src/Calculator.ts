export const MAX_STEPS = 1_000
export const IN_MANDELBROT_SET = -1

interface CalculatingModule {
  calculate(maxSteps: number, inMandelbrotSet: number, pixels: Uint8Array, x: number, y: number, width: number, height: number): void;
}

export class Calculator {
  readonly name: string
  private readonly module: CalculatingModule

  constructor(name: string, module: CalculatingModule) {
    this.name = name
    this.module = module
  }

  calculate(x: number, y: number, width: number, height: number): Uint8Array {
    const pixels = new Uint8Array(width * height * 4)
    this.module.calculate(MAX_STEPS, IN_MANDELBROT_SET, pixels, x, y, width, height)

    return pixels
  }
}
