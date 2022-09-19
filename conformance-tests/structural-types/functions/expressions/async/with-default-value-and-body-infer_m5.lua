-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/expressions/async/with-default-value-and-body-infer_m5.js
local function fooBool(bar_: boolean?)
	local bar: boolean = if bar_ ~= nil then bar_ else true
	return Promise.resolve():andThen(function()
		return bar
	end)
end
local function fooNoom(bar_: number?)
	local bar: number = if bar_ ~= nil then bar_ else 0
	return Promise.resolve():andThen(function()
		return bar
	end)
end
local function fooStroom(bar_: string?)
	local bar: string = if bar_ ~= nil then bar_ else "fallback"
	return Promise.resolve():andThen(function()
		return bar
	end)
end
local function fooArroom(bar_: Array<any>?)
	local bar: Array<any> = if bar_ ~= nil then bar_ else {}
	return Promise.resolve():andThen(function()
		return bar
	end)
end
