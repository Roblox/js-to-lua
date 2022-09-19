-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/object-destructuring/reserved-keywords/destructure-obj-with-alias-with-reserved-keywords_m5.js
local until_, err, table_
do
	local ref = { ["repeat"] = "repeat", error = "error", table = "table" }
	until_, err, table_ = ref["repeat"], ref.error, ref.table
end
