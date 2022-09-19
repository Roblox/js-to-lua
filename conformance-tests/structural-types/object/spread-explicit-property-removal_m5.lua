-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/object/spread-explicit-property-removal_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Object = LuauPolyfill.Object
local obj0 = { foo = "foo", bar = "bar" }
local obj1 = Object.assign({}, obj0, { bar = Object.None })
local obj2 = Object.assign({}, obj0, { foo = Object.None })
