local function foo(bar_: Array<any>?)
	local bar: Array<any> = if bar_ ~= nil then bar_ else {}
end
