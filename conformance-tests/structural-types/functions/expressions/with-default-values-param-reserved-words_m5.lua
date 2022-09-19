-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/expressions/with-default-values-param-reserved-words_m5.js
local function reduce(next_, repeat__: string?)
	local repeat_: string = if repeat__ ~= nil then repeat__ else "roblox"
	return next_
end
