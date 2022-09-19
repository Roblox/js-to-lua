-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/object-destructuring/reserved-keywords/destructure-obj-identifier-with-alias-with-reserved-keywords_m5.js
local obj = { ["repeat"] = "repeat", error = "error", table = "table" }
local until_, err, table_ = obj["repeat"], obj.error, obj.table
