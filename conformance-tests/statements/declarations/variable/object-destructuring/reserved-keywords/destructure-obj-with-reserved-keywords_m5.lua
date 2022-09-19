-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/object-destructuring/reserved-keywords/destructure-obj-with-reserved-keywords_m5.js
local repeat_, error_, table_
do
	local ref = { ["repeat"] = "repeat", error = "error", table = "table" }
	repeat_, error_, table_ = ref["repeat"], ref.error, ref.table
end
