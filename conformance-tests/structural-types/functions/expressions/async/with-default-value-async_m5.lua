local function foo(bar: any?)
	if bar == nil then
		bar = defaultBar
	end
	return Promise.resolve(nil)
end
