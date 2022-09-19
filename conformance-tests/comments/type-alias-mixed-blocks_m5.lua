-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/type-alias-mixed-blocks_m5.ts
type State = { --[[ before id ]]
	foo: any,
	bar --[[ after id ]]: any,
	baz:  --[[ before type ]]any,
}
