-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/object/spread-multiple-literals.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Object = LuauPolyfill.Object
local obj1 = Object.assign({}, { foo = "foo" }, { bar = "bar" })
local obj2 = Object.assign({}, { fizz = "fizz" }, { baz = "baz" })
local combined = Object.assign({}, obj1, obj2, { buzz = "buzz" }, { fuzz = "fuzz" })
