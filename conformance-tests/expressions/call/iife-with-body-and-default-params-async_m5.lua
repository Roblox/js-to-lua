(function(bar: any?)
	if bar == nil then
		bar = defaultBar
	end
	return Promise.resolve():andThen(function()
		return bar:expect()
	end)
end)()
