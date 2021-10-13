mod utils;

use stylua_lib::{Config, IndentType, LineEndings, QuoteStyle, Range, OutputVerification};
use utils::{set_panic_hook, Configuration};
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

fn get_stylua_config(configuration: Configuration) -> Result<Config, JsValue> {
    Ok(Config::new()
        .with_column_width(configuration.column_width())
        .with_indent_width(configuration.indentation_width())
        .with_quote_style(match configuration.quote_style().as_str() {
            "double" => QuoteStyle::AutoPreferDouble,
            "single" => QuoteStyle::AutoPreferSingle,
            "force-double" => QuoteStyle::ForceDouble,
            "force-single" => QuoteStyle::ForceSingle,
            _ => {
                return Err(JsValue::from(
                    "invalid quote_style value (expected `double`, `single`, `force-double` or `force-single`)",
                ))
            }
        })
        .with_line_endings(
            match configuration.line_endings().as_str() {
                "unix" => LineEndings::Unix,
                "windows" => LineEndings::Windows,
                _ => {
                    return Err(JsValue::from(
                        "invalid line_endings value (expected `unix` or `windows`)",
                    ))
                }
            },
        )
        .with_indent_type(
            match configuration.indentation_type().as_str() {
                "spaces" => IndentType::Spaces,
                "tabs" => IndentType::Tabs,
                _ => {
                    return Err(JsValue::from(
                        "invalid indentation_type value (expected `spaces` or `tabs`)",
                    ))
                }
            },
        ))
}

#[wasm_bindgen]
pub fn format_code(code: &str, configuration: Option<Configuration>) -> Result<String, JsValue> {
    set_panic_hook();
    let config = get_stylua_config(configuration.unwrap_or_default())?;

    stylua_lib::format_code(code, config, None, OutputVerification::None).map_err(|error| JsValue::from(error.to_string()))
}

#[wasm_bindgen]
pub fn format_code_in_range(
    code: &str,
    start: Option<usize>,
    end: Option<usize>,
    configuration: Option<Configuration>,
) -> Result<String, JsValue> {
    set_panic_hook();
    let config = get_stylua_config(configuration.unwrap_or_default())?;

    stylua_lib::format_code(code, config, Some(Range::from_values(start, end)), OutputVerification::None)
        .map_err(|error| JsValue::from(error.to_string()))
}
