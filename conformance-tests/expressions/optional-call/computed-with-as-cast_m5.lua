-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/optional-call/computed-with-as-cast_m5.ts
local ref = if typeof(foo :: any) == "table" then (foo :: any)["bar"] else nil
local v = if ref ~= nil then ref() else nil
