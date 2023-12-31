-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/type-reference-builtins_m6.js
type Call<F, T...> = any --[[ ROBLOX TODO: Flow 'Call' built-in type is not available in Luau ]]
type Class<T> = T --[[ ROBLOX TODO: Flow 'Class' built-in type is not available in Luau ]]
type Diff<T, K> = T --[[ ROBLOX TODO: Flow 'Diff' built-in type is not available in Luau ]]
type ElementType<T, K> = any --[[ ROBLOX TODO: Flow 'ElementType' built-in type is not available in Luau ]]
type Exact<T> = T --[[ ROBLOX TODO: Flow 'Exact' built-in type is not available in Luau ]]
type Exports<T> = any --[[ ROBLOX TODO: Flow 'Exports' built-in type is not available in Luau ]]
type KeyMirror<O> = any --[[ ROBLOX TODO: Flow 'KeyMirror' built-in type is not available in Luau ]]
type Keys<T> = string --[[ ROBLOX TODO: Flow 'Keys' built-in type is not available in Luau ]]
type NonMaybeType<T> = any --[[ ROBLOX TODO: Flow 'NonMaybeType' built-in type is not available in Luau ]]
type ObjMap<T, F> = any --[[ ROBLOX TODO: Flow 'ObjMap' built-in type is not available in Luau ]]
type ObjMapConst<O, T> = any --[[ ROBLOX TODO: Flow 'ObjMapConst' built-in type is not available in Luau ]]
type ObjMapi<T, F> = any --[[ ROBLOX TODO: Flow 'ObjMapi' built-in type is not available in Luau ]]
type PropertyType<T, K> = any --[[ ROBLOX TODO: Flow 'PropertyType' built-in type is not available in Luau ]]
type ReadOnly<T> = T --[[ ROBLOX TODO: Flow 'ReadOnly' built-in type is not available in Luau ]]
type Rest<T, K> = T --[[ ROBLOX TODO: Flow 'Rest' built-in type is not available in Luau ]]
type Shape<T> = any --[[ ROBLOX TODO: Flow 'Shape' built-in type is not available in Luau ]]
type Subtype<T> = any --[[ ROBLOX TODO: Flow 'Subtype' built-in type is not available in Luau ]]
type Supertype<T> = any --[[ ROBLOX TODO: Flow 'Supertype' built-in type is not available in Luau ]]
type TupleMap<T, F> = any --[[ ROBLOX TODO: Flow 'TupleMap' built-in type is not available in Luau ]]
type Values<T> = any --[[ ROBLOX TODO: Flow 'Values' built-in type is not available in Luau ]]
type A = any
type B = any
type MyKeys = Keys<A>
type MyValues = Values<A>
type MyReadOnly = ReadOnly<A>
type MyExact = Exact<A>
type MyDiff = Diff<A, B>
type MyRest = Rest<A, B>
type MyPropertyType = PropertyType<A, B>
type MyElementType = ElementType<A, B>
type MyNonMaybeType = NonMaybeType<A>
type MyObjMap = ObjMap<A, B>
type MyObjMapi = ObjMapi<A, B>
type MyObjMapConst = ObjMapConst<A, B>
type MyKeyMirror = KeyMirror<A>
type MyTupleMap = TupleMap<A, B>
type MyCall = Call<A, B>
type MyClass = Class<A>
type MyShape = Shape<A>
type MyExports = Exports<A>
type MySupertype = Supertype<A>
type MySubtype = Subtype<A>
