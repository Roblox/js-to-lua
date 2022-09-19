-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/export/named-with-type-annotation-arrow-function_m5.ts
local exports = {}
local foo: any
function foo() end
exports.foo = foo
return exports
