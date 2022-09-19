-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/export/named-with-type-annotation-function_m5.ts
local exports = {}
local function foo(): any end
exports.foo = foo
return exports
