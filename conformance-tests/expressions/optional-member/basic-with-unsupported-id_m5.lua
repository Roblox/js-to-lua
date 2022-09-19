-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/optional-member/basic-with-unsupported-id_m5.js
local v = if typeof(foo) == "table" then foo["$$typeof"] else nil
