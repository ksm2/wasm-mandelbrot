extern crate cfg_if;
extern crate wasm_bindgen;

mod utils;

use wasm_bindgen::prelude::*;

const IN_MANDELBROT_SET: i32 = -1;
const NUM_COLORS: i32 = 2048;

type Color = (u8, u8, u8);

#[wasm_bindgen]
extern {
}

#[wasm_bindgen]
pub fn calculate(max_steps: i32, pixels: &mut [u8], x: f64, y: f64, width: i32, height: i32) {
  // Initialize palette
  let palette = create_palette();

  let factor = max(3.0 / width as f64, 2.0 / height as f64);
  let wh = width / 2;
  let hh = height / 2;
  let mut offset = 0;
  for j in -hh..hh {
    for i in -wh..wh {
      let real = i as f64 * factor - x;
      let imaginary = j as f64 * factor - y;
      let (index, rr, ii) = calculate_pixel(max_steps, real, imaginary);

      offset = colorize(&palette, max_steps, index, rr, ii, pixels, offset)
    }
  }
}

fn calculate_pixel(max_steps: i32, real: f64, imaginary: f64) -> (i32, f64, f64) {
  let mut zr = 0.0;
  let mut zi = 0.0;
  for s in 0..max_steps {
    // Is the current step out of bounds?
    let rr = zr * zr;
    if rr > 4.0 {
      return (s, rr, zi * zi);
    }
    let ii = zi * zi;
    if ii > 4.0 {
      return (s, rr, ii);
    }

    if rr + ii > 4.0 {
      return (s, rr, ii);
    }

    // Calculate next step
    zi = 2.0 * zr * zi + imaginary;
    zr = rr - ii + real;
  }

  // Never left the bounds? We are in the Mandelbrot Set
  return (IN_MANDELBROT_SET, 0.0, 0.0);
}

fn colorize(palette: &Vec<Color>, max_steps: i32, index: i32, rr: f64, ii: f64, pixels: &mut [u8], offset: usize) -> usize {
  if index == IN_MANDELBROT_SET {
    return rgba(pixels, offset, (0, 0, 0));
  }

  let frac = ((rr + ii).log2() / 2.0).log2();
  let fixed_index = index as f64 + 1.0 - frac;
  let i = (fixed_index * (NUM_COLORS as f64 - 1.0)) / max_steps as f64;
  let lower = i.floor() as usize;
  let upper = lower + 1;

  let c1 = palette[lower];
  let c2 = palette[upper];
  rgba(pixels, offset, interpolate_colors(c1, c2, i % 1.0))
}

fn rgba(pixel: &mut [u8], offset: usize, color: Color) -> usize {
  let (red, green, blue) = color;
  let mut o = offset;
  pixel[o] = red;
  o += 1;
  pixel[o] = green;
  o += 1;
  pixel[o] = blue;
  o += 1;
  pixel[o] = 255;
  o + 1
}

fn max(n1: f64, n2: f64) -> f64 {
  if n1 > n2 { n1 } else { n2 }
}

fn create_palette() -> Vec<Color> {
  let mut colors = Vec::new();
  for i in 0..NUM_COLORS {
    let x = i as f64 / NUM_COLORS as f64;
    colors.push(color_stop(x));
  }

  colors
}

fn color_stop(i: f64) -> Color {
  let cl1 = (0x00, 0x07, 0x64);
  let cl2 = (0x20, 0x68, 0xCB);
  let cl3 = (0xED, 0xFF, 0xFF);
  let cl4 = (0xFF, 0xAA, 0x00);
  let cl5 = (0x00, 0x02, 0x00);

  if i < 0.16 {
    interpolate_colors(cl1, cl2, scale(i, 0.00, 0.16))
  } else if i < 0.42 {
    interpolate_colors(cl2, cl3, scale(i, 0.16, 0.42))
  } else if i < 0.6425 {
    interpolate_colors(cl3, cl4, scale(i, 0.42, 0.6425))
  } else if i < 0.8575 {
    interpolate_colors(cl4, cl5, scale(i, 0.6425, 0.8575))
  } else {
    cl5
  }
}

fn interpolate_colors(c1: Color, c2: Color, factor: f64) -> Color {
  let i_factor = 1.0 - factor;
  (
    (c1.0 as f64 * i_factor + c2.0 as f64 * factor) as u8,
    (c1.1 as f64 * i_factor + c2.1 as f64 * factor) as u8,
    (c1.2 as f64 * i_factor + c2.2 as f64 * factor) as u8,
  )
}

fn scale(i: f64, min: f64, max: f64) -> f64 {
  (i - min) / (max - min)
}
