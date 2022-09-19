-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/ts-method-signature-simple_m5.ts
type MyInterface = {
	foo: (self: MyInterface) -> (),
	baz: (self: MyInterface) -> any,
	bar: (self: MyInterface) -> string,
	fizz: (self: MyInterface) -> number,
	buzz: (self: MyInterface) -> boolean,
}
