-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/export/default-direct-named-function_m4.js
local exports = {}
local function foo() end
exports.default = foo
return exports
