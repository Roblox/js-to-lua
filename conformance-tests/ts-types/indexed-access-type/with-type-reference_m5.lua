type Foo = { bar: string }
type Bar = "bar"
type Test = any --[[ ROBLOX FIXME: Luau types cannot be used for indexing. ]] --[[ Upstream: Foo[Bar] ]]
