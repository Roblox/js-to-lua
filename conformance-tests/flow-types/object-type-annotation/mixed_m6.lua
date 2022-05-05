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
