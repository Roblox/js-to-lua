local function foo(bar_: any?)
	local bar: any = if bar_ ~= nil then bar_ else defaultBar
	return Promise.resolve():andThen(function()
		local foo = "foo"
		bar:expect()
		return foo
	end)
end
