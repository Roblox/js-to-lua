local function foo(bar: any?)
	if bar == nil then
		bar = defaultBar
	end
	return Promise.resolve():andThen(function()
		local foo = "foo"
		bar:expect()
		return foo
	end)
end
