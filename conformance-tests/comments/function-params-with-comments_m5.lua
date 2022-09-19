-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/function-params-with-comments_m5.ts
local function foo(
	bar: () -> () -- comment after bar
): number
	return 1
end
local function fizz(
	buzz: any -- comment after buzz
): ()
end
