local exports = {}
local barModule = require(script.Parent.foo.bar)
exports.a = barModule.a
exports.b = barModule.b
exports.c = barModule.foo
exports.d = barModule.bar
return exports
