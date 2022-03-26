local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
local function expandRange(args, options)
	if typeof(options.expandRange) == "function" then
		return options:expandRange(table.unpack(Array.concat({}, Array.spread(args), { options })))
	end
end
