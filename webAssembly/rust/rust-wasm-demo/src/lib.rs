use wasm_bindgen::prelude::*;

// 这个函数将被导出，供 JavaScript 调用
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}