local function foo(bar_: number?)
	local bar: number = if bar_ ~= nil then bar_ else 1
end
