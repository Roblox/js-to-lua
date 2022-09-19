-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/arrow/with-default-values-param.js
local function reduce(value, name_: string?)
	local name: string = if name_ ~= nil then name_ else "roblox"
	return value
end
