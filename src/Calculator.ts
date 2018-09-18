export const MAX_STEPS = 1_000
export const IN_MANDELBROT_SET = -1

interface CalculatingModule {
  calculate(maxSteps: number, inSet: number, real: number, imaginary: number): number;
}

export class Calculator {
  readonly name: string
  private readonly module: CalculatingModule

  constructor(name: string, module: CalculatingModule) {
    this.name = name
    this.module = module
  }

  calculate(real: number, imaginary: number): number {
    return this.module.calculate(MAX_STEPS, IN_MANDELBROT_SET, real, imaginary)
  }
}
