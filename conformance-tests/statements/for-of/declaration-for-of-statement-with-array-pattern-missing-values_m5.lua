-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-of/declaration-for-of-statement-with-array-pattern-missing-values_m5.js
for _, ref in entries do
	local field = ref[2]
	bar(field)
end
