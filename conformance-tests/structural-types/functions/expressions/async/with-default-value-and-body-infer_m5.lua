local function fooBool(bar: boolean?)
	if bar == nil then
		bar = true
	end
	return Promise.resolve():andThen(function()
		return bar
	end)
end
local function fooNoom(bar: number?)
	if bar == nil then
		bar = 0
	end
	return Promise.resolve():andThen(function()
		return bar
	end)
end
local function fooStroom(bar: string?)
	if bar == nil then
		bar = "fallback"
	end
	return Promise.resolve():andThen(function()
		return bar
	end)
end
local function fooArroom(bar: Array<any>?)
	if bar == nil then
		bar = {}
	end
	return Promise.resolve():andThen(function()
		return bar
	end)
end
