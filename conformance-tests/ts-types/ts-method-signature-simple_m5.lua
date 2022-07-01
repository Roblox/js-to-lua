type MyInterface = {
	foo: (self: MyInterface) -> (),
	baz: (self: MyInterface) -> any,
	bar: (self: MyInterface) -> string,
	fizz: (self: MyInterface) -> number,
	buzz: (self: MyInterface) -> boolean,
}
