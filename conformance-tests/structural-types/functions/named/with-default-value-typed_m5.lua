local function foo(bar: (string | number)?)
	if bar == nil then
		bar = "bar"
	end
end
