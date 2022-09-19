-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/export/single-named_m4.js
local exports = {}
local function foo() end
exports.foo = foo
return exports
