local function foo(bar_: (string | number)?)
	local bar: string | number = if bar_ ~= nil then bar_ else "bar"
end
