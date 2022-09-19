-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/as/double-cast_m5.ts
local bar = "bar"
local foo = (bar :: any) :: string
