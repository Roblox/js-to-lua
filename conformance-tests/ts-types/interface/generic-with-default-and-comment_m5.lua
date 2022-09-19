-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/interface/generic-with-default-and-comment_m5.ts
type Foo<
	T = --[[leading]]
		string
	--[[trailing]]
> = { baz: T }
