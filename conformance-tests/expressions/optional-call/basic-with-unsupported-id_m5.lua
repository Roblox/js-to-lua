-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/optional-call/basic-with-unsupported-id_m5.js
local ref = if typeof(foo) == "table" then foo["$$typeof"] else nil
local v = if ref ~= nil then ref() else nil
