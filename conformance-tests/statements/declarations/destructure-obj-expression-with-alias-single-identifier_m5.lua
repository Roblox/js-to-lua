local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Object = LuauPolyfill.Object
local obj = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
local foo1 = Object.assign({}, obj).foo
