extern crate cfg_if;
extern crate wasm_bindgen;

mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
}

#[wasm_bindgen]
pub fn calculate(max_steps: i32, in_mandelbrot_set: i32, pixels: &mut [u8], x: i32, y: i32, width: i32, height: i32) {
  let fx = x as f64;
  let fy = y as f64;
  let factor = max(3.0 / width as f64, 2.0 / height as f64);
  let wh = width / 2;
  let hh = height / 2;
  let mut offset = 0;
  for j in -hh..hh {
    for i in -wh..=wh {
      let real = i as f64 * factor - fx;
      let imaginary = j as f64 * factor - fy;
      let index = calculate_pixel(max_steps, in_mandelbrot_set, real, imaginary);

      offset = colorize(in_mandelbrot_set, index, pixels, offset)
    }
  }
}

fn calculate_pixel(max_steps: i32, in_mandelbrot_set: i32, real: f64, imaginary: f64) -> i32 {
  let mut zr = 0.0;
  let mut zi = 0.0;
  for s in 0..max_steps {
    // Is the current step out of bounds?
    let rr = zr * zr;
    if rr > 4.0 {
      return s;
    }
    let ii = zi * zi;
    if ii > 4.0 {
      return s;
    }

    if rr + ii > 4.0 {
      return s;
    }

    // Calculate next step
    zi = 2.0 * zr * zi + imaginary;
    zr = rr - ii + real;
  }

  // Never left the bounds? We are in the Mandelbrot Set
  return in_mandelbrot_set
}

fn colorize(in_mandelbrot_set: i32, index: i32, pixels: &mut [u8], offset: usize) -> usize {
  if index == in_mandelbrot_set {
    rgba(pixels, offset, 0, 0, 0)
  } else {
    rgba(pixels, offset, 255, 255, 255)
  }
}

fn rgba(pixel: &mut [u8], offset: usize, red: u8, green: u8, blue: u8) -> usize {
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
