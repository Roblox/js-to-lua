local function foo(bar_: Object?)
	local bar: Object = if bar_ ~= nil then bar_ else {}
end
