-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/object-destructuring/reserved-keywords/destructure-call-expression-with-reserved-keywords_m5.js
local function func()
	return { ["repeat"] = "repeat", error = "error", table = "table" }
end
local repeat_, error_, table_
do
	local ref = func()
	repeat_, error_, table_ = ref["repeat"], ref.error, ref.table
end
