-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/export/reexport-relative/named-list_m4.js
local exports = {}
local barModule = require(script.Parent.foo.bar)
exports.a = barModule.a
exports.b = barModule.b
exports.foo = barModule.foo
exports.bar = barModule.bar
return exports
