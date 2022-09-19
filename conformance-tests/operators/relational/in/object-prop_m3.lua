-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/in/object-prop_m3.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
local Object = LuauPolyfill.Object
local obj = { foo = "bar" }
local prop = "foo"
local hasFoo = Array.indexOf(Object.keys(obj), tostring(prop)) ~= -1
