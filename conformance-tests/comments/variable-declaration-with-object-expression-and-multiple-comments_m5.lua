local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Object = LuauPolyfill.Object
local bar = "bar"
local baz = "baz"
local rest = { 1, 2, 3 }
local bazValue = "bazValue"
local foo--[[ comm 0 ]]:  --[[comm 1]]any--[[ comm 2 ]] = --[[ comm 3 ]]
	{ bar = bar, baz = bazValue }
--[[ comm 4 ]]
local foo1--[[ comm 0 ]]:  --[[comm 1]]any--[[ comm 2 ]] = --[[ comm 3 ]]
	Object.assign({}, { bar = bar, baz = bazValue }, rest)
--[[ comm 4 ]]
local foo2--[[ comm 0 ]]:  --[[comm 1]]any--[[ comm 2 ]] = --[[ comm 3 ]]
	bar
--[[ comm 4 ]]
--[[ comm 0.0 ]]
--[[ comm 1.0 ]]
local foo3--[[ comm 0.1 ]], foo4--[[ comm 1.1 ]] = --[[ comm 0.2 ]]
	bar, --[[ comm 1.2 ]]
	baz
--[[ comm 0.3 ]]
--[[ comm 1.3 ]]
