local function foo(bar_: any?)
	local bar: any = if bar_ ~= nil then bar_ else defaultBar
	return Promise.resolve():andThen(function()
		return bar:expect()
	end)
end
