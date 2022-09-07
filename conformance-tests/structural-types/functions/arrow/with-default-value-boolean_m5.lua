local function foo(bar_: boolean?)
	local bar: boolean = if bar_ ~= nil then bar_ else true
end
