local function foo(bar_: string?)
	local bar: string = if bar_ ~= nil then bar_ else "bar"
end
