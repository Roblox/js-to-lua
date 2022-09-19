-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/member/computed-with-as-cast_m5.ts
local foo = {}
local v = (foo :: any)["bar"]
