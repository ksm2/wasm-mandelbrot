const IN_MANDELBROT_SET = -1

export function calculate(maxSteps: number, pixel: Uint8Array, x: number, y: number, width: number, height: number): void {
  const factor = Math.max(3 / width, 2 / height)
  const wh = Math.floor(width / 2)
  const hh = Math.floor(height / 2)
  let offset = 0
  for (let j = -hh; j < hh; j += 1) {
    for (let i = -wh; i < wh; i += 1) {
      const real = i * factor - x
      const imaginary = j * factor - y
      const index = calculatePixel(maxSteps, real, imaginary)

      offset = colorize(index, pixel, offset)
    }
  }
}

export function calculatePixel(maxSteps: number, real: number, imaginary: number): number {
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
  return IN_MANDELBROT_SET
}

function colorize(index: number, pixel: Uint8Array, offset: number): number {
  if (index === IN_MANDELBROT_SET) {
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
