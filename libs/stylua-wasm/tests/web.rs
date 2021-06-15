//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn format_empty_code() {
    assert_eq!(stylua_wasm::format_code("", None).unwrap(), "");
}

#[wasm_bindgen_test]
fn format_declaration() {
    assert_eq!(stylua_wasm::format_code("local\na", None).unwrap(), "local a\n");
}
