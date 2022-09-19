-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/optional-member/unsupported-id-with-cast_m5.ts
local v = if typeof(foo :: any) == "table" then (foo :: any)["$$typeof"] else nil
