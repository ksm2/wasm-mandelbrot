const IN_MANDELBROT_SET = -1
const NUM_COLORS = 2048

type Color = [number, number, number]

export function calculate(maxSteps: number, pixel: Uint8Array, x: number, y: number, width: number, height: number): void {
  const palette = create_palette()
  const factor = Math.max(3 / width, 2 / height)
  const wh = Math.floor(width / 2)
  const hh = Math.floor(height / 2)
  let offset = 0
  for (let j = -hh; j < hh; j += 1) {
    for (let i = -wh; i < wh; i += 1) {
      const real = i * factor - x
      const imaginary = j * factor - y
      const [index, rr, ii] = calculatePixel(maxSteps, real, imaginary)

      offset = colorize(palette, maxSteps, index, rr, ii, pixel, offset)
    }
  }
}

export function calculatePixel(maxSteps: number, real: number, imaginary: number): [number, number, number] {
  let [zr, zi] = [0, 0]
  for (let s = 0; s < maxSteps; s += 1) {
    // Is the current step out of bounds?
    const rr = zr * zr
    if (rr > 4) return [s, rr, zi * zi]
    const ii = zi * zi
    if (ii > 4) return [s, rr, ii]
    if (rr + ii > 4) return [s, rr, ii]

    // Calculate next step
    zi = 2 * zr * zi + imaginary
    zr = rr - ii + real
  }

  // Never left the bounds? We are in the Mandelbrot Set
  return [IN_MANDELBROT_SET, 0, 0]
}

function colorize(palette: Color[], maxSteps: number, index: number, rr: number, ii: number, pixels: Uint8Array, offset: number): number {
  if (index === IN_MANDELBROT_SET) {
    return rgba(pixels, offset, [0, 0, 0])
  }

  const frac = Math.log2(Math.log2(rr + ii) / 2.0)
  const fixedIndex = index + 1.0 - frac
  const i = (fixedIndex * (NUM_COLORS - 1.0)) / maxSteps
  const lower = Math.floor(i)
  const upper = lower + 1

  const c1 = palette[lower]
  const c2 = palette[upper]
  return rgba(pixels, offset, interpolateColors(c1, c2, i % 1.0))
}

export function rgba(pixel: Uint8Array, offset: number, color: Color) {
  pixel[offset] = color[0]
  offset += 1
  pixel[offset] = color[1]
  offset += 1
  pixel[offset] = color[2]
  offset += 1
  pixel[offset] = 255
  return offset + 1
}

function create_palette(): Color[] {
  const colors: Color[] = []
  for (let i = 0; i < NUM_COLORS; i += 1) {
    const x = i / NUM_COLORS
    colors.push(colorStop(x))
  }

  return colors
}

function colorStop(i: number): Color {
  const cl1: Color = [0x00, 0x07, 0x64]
  const cl2: Color = [0x20, 0x68, 0xCB]
  const cl3: Color = [0xED, 0xFF, 0xFF]
  const cl4: Color = [0xFF, 0xAA, 0x00]
  const cl5: Color = [0x00, 0x02, 0x00]

  if (i < 0.16) {
    return interpolateColors(cl1, cl2, scale(i, 0.00, 0.16))
  } else if (i < 0.42) {
    return interpolateColors(cl2, cl3, scale(i, 0.16, 0.42))
  } else if (i < 0.6425) {
    return interpolateColors(cl3, cl4, scale(i, 0.42, 0.6425))
  } else if (i < 0.8575) {
    return interpolateColors(cl4, cl5, scale(i, 0.6425, 0.8575))
  } else {
    return cl5
  }
}

function interpolateColors(c1: Color, c2: Color, factor: number): Color {
  const i_factor = 1.0 - factor
  return [
    c1[0] * i_factor + c2[0] * factor,
    c1[1] * i_factor + c2[1] * factor,
    c1[2] * i_factor + c2[2] * factor,
  ]
}

function scale(i: number, min: number, max: number): number {
  return (i - min) / (max - min)
}
