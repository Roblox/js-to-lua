-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/optional-member/with-as-cast_m5.ts
local v = if typeof(foo :: any) == "table" then (foo :: any).bar else nil
