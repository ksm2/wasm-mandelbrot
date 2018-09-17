export const MAX_STEPS = 1_000
export const IN_MANDELBROT_SET = -1

export interface Calculator {
  readonly name: string
  calculate(real: number, imaginary: number): number
}

export class JavaScriptCalculator implements Calculator {
  readonly name = 'JavaScript'

  calculate(real: number, imaginary: number): number {
    let [zr, zi] = [0, 0]
    for (let s = 0; s < MAX_STEPS; s += 1) {
      // Is the current step out of bounds?
      const rr = zr * zr
      if (rr > 4) return s
      const ii = zi * zi
      if (ii > 4) return s
      if (rr + ii > 4) return s

      // Calculate next step
      zi = 2 * zr * zi + imaginary
      zr = rr - ii + real
    }

    // Never left the bounds? We are in the Mandelbrot Set
    return IN_MANDELBROT_SET
  }
}

export class WebAssemblyCalculator implements Calculator {
  readonly name = 'WebAssembly'
  private wasm: typeof import('mandelbrot')

  constructor(wasm: typeof import('mandelbrot')) {
    this.wasm = wasm
  }

  calculate(real: number, imaginary: number): number {
    return this.wasm.calculate(real, imaginary)
  }
}
