-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/object-destructuring/reserved-keywords/destructure-member-expression-with-reserved-keywords_m5.js
local obj = { nested = { ["repeat"] = "repeat", error = "error", table = "table" } }
local repeat_, error_, table_
do
	local ref = obj.nested
	repeat_, error_, table_ = ref["repeat"], ref.error, ref.table
end
