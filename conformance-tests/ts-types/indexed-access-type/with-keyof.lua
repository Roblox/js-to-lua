type Foo = { bar: string, baz: number }
type Test = any --[[ ROBLOX FIXME: Unhandled type. ]] --[[ Upstream: Foo[keyof Foo] ]]
