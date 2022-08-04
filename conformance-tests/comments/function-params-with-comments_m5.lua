local function foo(
	bar: () -> () -- comment after bar
): number
	return 1
end
local function fizz(
	buzz: any -- comment after buzz
): ()
end
