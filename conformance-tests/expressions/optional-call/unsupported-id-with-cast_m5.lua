-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/optional-call/unsupported-id-with-cast_m5.ts
local ref = if typeof(foo :: any) == "table" then (foo :: any)["$$typeof"] else nil
local v = if ref ~= nil then ref() else nil
