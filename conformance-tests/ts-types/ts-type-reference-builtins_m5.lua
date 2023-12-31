-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/ts-type-reference-builtins_m5.ts
type Awaited<T> = any --[[ ROBLOX TODO: TS 'Awaited' built-in type is not available in Luau ]]
type Capitalize<S> = string --[[ ROBLOX TODO: TS 'Capitalize' built-in type is not available in Luau ]]
type ConstructorParameters<T> = any --[[ ROBLOX TODO: TS 'ConstructorParameters' built-in type is not available in Luau ]]
type Exclude<T, U> = any --[[ ROBLOX TODO: TS 'Exclude' built-in type is not available in Luau ]]
type Extract<T, U> = any --[[ ROBLOX TODO: TS 'Extract' built-in type is not available in Luau ]]
type InstanceType<T> = any --[[ ROBLOX TODO: TS 'InstanceType' built-in type is not available in Luau ]]
type Lowercase<S> = string --[[ ROBLOX TODO: TS 'Lowercase' built-in type is not available in Luau ]]
type NonNullable<T> = T --[[ ROBLOX TODO: TS 'NonNullable' built-in type is not available in Luau ]]
type Omit<T, K> = T --[[ ROBLOX TODO: TS 'Omit' built-in type is not available in Luau ]]
type OmitThisParameter<T> = any --[[ ROBLOX TODO: TS 'OmitThisParameter' built-in type is not available in Luau ]]
type Parameters<T> = any --[[ ROBLOX TODO: TS 'Parameters' built-in type is not available in Luau ]]
type Partial<T> = T --[[ ROBLOX TODO: TS 'Partial' built-in type is not available in Luau ]]
type Pick<T, K> = T --[[ ROBLOX TODO: TS 'Pick' built-in type is not available in Luau ]]
type Readonly<T> = T --[[ ROBLOX TODO: TS 'Readonly' built-in type is not available in Luau ]]
type Record<K, T> = { [K]: T } --[[ ROBLOX TODO: TS 'Record' built-in type is not available in Luau ]]
type Required<T> = T --[[ ROBLOX TODO: TS 'Required' built-in type is not available in Luau ]]
type ReturnType<T> = any --[[ ROBLOX TODO: TS 'ReturnType' built-in type is not available in Luau ]]
type ThisParameterType<T> = any --[[ ROBLOX TODO: TS 'ThisParameterType' built-in type is not available in Luau ]]
type ThisType<T> = any --[[ ROBLOX TODO: TS 'ThisType' built-in type is not available in Luau ]]
type Uncapitalize<S> = string --[[ ROBLOX TODO: TS 'Uncapitalize' built-in type is not available in Luau ]]
type Uppercase<S> = string --[[ ROBLOX TODO: TS 'Uppercase' built-in type is not available in Luau ]]
type A = any
type B = any
type MyAwaited = Awaited<A>
type MyPartial = Partial<A>
type MyRequired = Required<A>
type MyReadonly = Readonly<A>
type MyRecord = Record<A, B>
type MyPick = Pick<A, B>
type MyOmit = Omit<A, B>
type MyExclude = Exclude<A, B>
type MyExtract = Extract<A, B>
type MyNonNullable = NonNullable<A>
type MyParameters = Parameters<A>
type MyConstructorParameters = ConstructorParameters<A>
type MyReturnType = ReturnType<A>
type MyInstanceType = InstanceType<A>
type MyThisParameterType = ThisParameterType<A>
type MyOmitThisParameter = OmitThisParameter<A>
type MyThisType = ThisType<A>
type MyUppercase = Uppercase<A>
type MyLowercase = Lowercase<A>
type MyCapitalize = Capitalize<A>
type MyUncapitalize = Uncapitalize<A>
