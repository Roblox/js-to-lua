-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/not-yet-handled/ts-call-signature-declaration_m5.ts
type Foo = {
	anotherPropBefore: string,
	__unhandledIdentifier__: nil, --[[ ROBLOX TODO: Unhandled node for type: TSCallSignatureDeclaration ]] --[[ (bar: number): number; ]]
	__unhandledIdentifier__: nil, --[[ ROBLOX TODO: Unhandled node for type: TSCallSignatureDeclaration ]] --[[ (bar: string): string; ]]
	anotherPropBetween: boolean,
	__unhandledIdentifier__: nil, --[[ ROBLOX TODO: Unhandled node for type: TSCallSignatureDeclaration ]] --[[ (bar: boolean): boolean; ]]
	anotherPropAfter: number,
}
