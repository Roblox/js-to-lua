local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Error = LuauPolyfill.Error
local console = LuauPolyfill.console
do --[[ ROBLOX COMMENT: try-catch block conversion ]]
	local ok, result, hasReturned = xpcall(function()
		error(Error.new("kaboom"))
	end, function(ref0)
		local message = ref0.message
		console.log(message)
	end)
	if hasReturned then
		return result
	end
end
