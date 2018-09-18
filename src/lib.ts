export function calculate(maxSteps: number, inMandelbrotSet: number, pixel: Uint8Array, x: number, y: number, width: number, height: number): void {
  const factor = Math.max(3 / width, 2 / height)
  const wh = Math.floor(width / 2)
  let offset = 0
  for (let j = height / 2; j > -height / 2; j -= 1) {
    for (let i = -wh; i < wh + 1; i += 1) {
      const [real, imaginary] = [i * factor - x, j * factor - y]
      const index = calculatePixel(maxSteps, inMandelbrotSet, real, imaginary)

      offset = colorize(inMandelbrotSet, index, pixel, offset)
    }
  }
}

export function calculatePixel(maxSteps: number, inMandelbrotSet: number, real: number, imaginary: number): number {
  let [zr, zi] = [0, 0]
  for (let s = 0; s < maxSteps; s += 1) {
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
  return inMandelbrotSet
}

function colorize(inMandelbrotSet: number, index: number, pixel: Uint8Array, offset: number): number {
  if (index === inMandelbrotSet) {
    return rgba(pixel, offset, 0, 0, 0)
  }
  return rgba(pixel, offset, 255, 255, 255)
}

export function rgba(pixel: Uint8Array, offset: number, red: number, green: number, blue: number) {
  pixel[offset] = red
  offset += 1
  pixel[offset] = green
  offset += 1
  pixel[offset] = blue
  offset += 1
  pixel[offset] = 255
  return offset + 1
}
