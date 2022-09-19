-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/object-destructuring/reserved-keywords/destructure-obj-identifier-with-reserved-keywords_m5.js
local obj = { ["repeat"] = "repeat", error = "error", table = "table" }
local repeat_, error_, table_ = obj["repeat"], obj.error, obj.table
