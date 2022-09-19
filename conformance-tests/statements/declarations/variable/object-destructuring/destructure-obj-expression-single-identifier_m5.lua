-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/object-destructuring/destructure-obj-expression-single-identifier_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Object = LuauPolyfill.Object
local obj = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
local foo = Object.assign({}, obj).foo
