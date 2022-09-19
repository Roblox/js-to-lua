-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/type-alias-inline_m5.ts
type State = {
	foo: any, -- test inline comment
	bar: any?, -- should be added after comma
	baz: any?, -- success
}
