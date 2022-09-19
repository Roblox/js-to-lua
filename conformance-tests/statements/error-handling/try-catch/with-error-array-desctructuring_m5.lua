-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/error-handling/try-catch/with-error-array-desctructuring_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local console = LuauPolyfill.console
do --[[ ROBLOX COMMENT: try-catch block conversion ]]
	local ok, result, hasReturned = xpcall(function()
		error({ "kaboom" })
	end, function(ref0)
		local message = ref0[1]
		console.log(message)
	end)
	if hasReturned then
		return result
	end
end
