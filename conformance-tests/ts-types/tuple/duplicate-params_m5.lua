-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/tuple/duplicate-params_m5.ts
local arr: Array<number | string | boolean | Type1 | Type2 | Generic<T> | Generic<V> | Generic<T, V>> =
	{ 1, "foo", 2, true, false, true, false, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
