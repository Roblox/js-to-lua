-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/simple-params-apply_m5.js
local function foo() end
foo(nil, table.unpack(args))
