-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/object-type-annotation/mixed_m6.js
type Foo = { foo: string }
type Bar = { bar: string }
type Test = Foo & Bar & {
	prop: string,
	[string]: boolean,
	--[[ ROBLOX TODO: Unhandled node for type: ObjectTypeCallProperty ]]
	--[[ (): any ]]
	--[[ (string): string ]]
	--[[ ROBLOX TODO: Unhandled node for type: ObjectTypeInternalSlot ]]
	--[=[ [[Slot]]: any ]=]
}
