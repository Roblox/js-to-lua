-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/nested-call_m2.js
local function foo() end
local function bar() end
foo(bar(1, 2, 3))
