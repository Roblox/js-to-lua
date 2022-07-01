type MyInterface = {
	foo: (self: MyInterface, ...string) -> string,
	bar: (self: MyInterface, ...number) -> number,
}
