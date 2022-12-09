type A = any
type B = any
type MyKeys = $Keys<A>
type MyValues = $Values<A>
type MyReadOnly = $ReadOnly<A>
type MyExact = $Exact<A>
type MyDiff = $Diff<A, B>
type MyRest = $Rest<A, B>
type MyPropertyType = $PropertyType<A, B>
type MyElementType = $ElementType<A, B>
type MyNonMaybeType = $NonMaybeType<A>
type MyObjMap = $ObjMap<A,  B>
type MyObjMapi = $ObjMapi<A, B>
type MyObjMapConst = $ObjMapConst<A, B>
type MyKeyMirror = $KeyMirror<A>
type MyTupleMap = $TupleMap<A, B>
type MyCall = $Call<A, B>
type MyClass = Class<A>
type MyShape = $Shape<A>
type MyExports = $Exports<A>
type MySupertype = $Supertype<A>
type MySubtype = $Subtype<A>