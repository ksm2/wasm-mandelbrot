extern crate cfg_if;
extern crate wasm_bindgen;

mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
}

const MAX_STEPS: i32 = 1_000;
const IN_MANDELBROT_SET: i32 = -1;

#[wasm_bindgen]
pub fn calculate(real: f64, imaginary: f64) -> i32 {
  let mut zr = 0.0;
  let mut zi = 0.0;
  for s in 0..MAX_STEPS {
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
  return IN_MANDELBROT_SET
}
