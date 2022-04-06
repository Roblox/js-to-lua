local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Set = LuauPolyfill.Set
local set = Set.new({ value });
(set :: any).toJSON = jest.fn(function()
	return "map"
end) -- not using `not` as it's currently handled as `["not"]` on member expressions
expect((set :: any).toJSON)
	--[[.not]]
	.toBeCalled()
