-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/ts-method-signature-with-rest-params_m5.ts
type MyInterface = {
	foo: (self: MyInterface, ...string) -> string,
	bar: (self: MyInterface, ...number) -> number,
}
