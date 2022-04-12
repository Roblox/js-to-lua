type Foo<
	T = --[[leading]]
		string
	--[[trailing]]
> = { baz: T }
