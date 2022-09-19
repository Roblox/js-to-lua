-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/object-destructuring/reserved-keywords/destructure-obj-nested-obj-with-reserved-keywords_m5.js
local foo, repeat_, error_, table_
do
	local ref = { foo = "bar", bar = { ["repeat"] = "repeat", error = "error", table = "table" } }
	foo, repeat_, error_, table_ = ref.foo, ref.bar["repeat"], ref.bar.error, ref.bar.table
end
