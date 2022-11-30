-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/member/with-flow-built-ins-as-key-computed_m6.js
local obj = {}
local MyKeys = obj[
	tostring(
		_Keys --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $Keys ]]
	)
]
local MyValues = obj[
	tostring(
		_Values --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $Values ]]
	)
]
local MyReadOnly = obj[
	tostring(
		_ReadOnly --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $ReadOnly ]]
	)
]
local MyExact = obj[
	tostring(
		_Exact --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $Exact ]]
	)
]
local MyDiff = obj[
	tostring(
		_Diff --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $Diff ]]
	)
]
local MyRest = obj[
	tostring(
		_Rest --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $Rest ]]
	)
]
local MyPropertyType = obj[
	tostring(
		_PropertyType --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $PropertyType ]]
	)
]
local MyElementType = obj[
	tostring(
		_ElementType --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $ElementType ]]
	)
]
local MyNonMaybeType = obj[
	tostring(
		_NonMaybeType --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $NonMaybeType ]]
	)
]
local MyObjMap = obj[
	tostring(
		_ObjMap --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $ObjMap ]]
	)
]
local MyObjMapi = obj[
	tostring(
		_ObjMapi --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $ObjMapi ]]
	)
]
local MyObjMapConst = obj[
	tostring(
		_ObjMapConst --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $ObjMapConst ]]
	)
]
local MyKeyMirror = obj[
	tostring(
		_KeyMirror --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $KeyMirror ]]
	)
]
local MyTupleMap = obj[
	tostring(
		_TupleMap --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $TupleMap ]]
	)
]
local MyCall = obj[
	tostring(
		_Call --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $Call ]]
	)
]
local MyClass = obj[tostring(Class)]
local MyShape = obj[
	tostring(
		_Shape --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $Shape ]]
	)
]
local MyExports = obj[
	tostring(
		_Exports --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $Exports ]]
	)
]
local MySupertype = obj[
	tostring(
		_Supertype --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $Supertype ]]
	)
]
local MySubtype = obj[
	tostring(
		_Subtype --[[ ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: $Subtype ]]
	)
]
