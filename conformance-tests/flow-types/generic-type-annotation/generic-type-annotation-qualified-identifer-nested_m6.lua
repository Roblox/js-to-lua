-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/generic-type-annotation/generic-type-annotation-qualified-identifer-nested_m6.js
local foo: A_B_C = bar
local function myFunc(): React_Node_Value end
local function myFunc2(baz: React_Node_Value): React_Node_Value end
local function myFunc3(
	baz: React_Node_Value,
	biz: React_Node_Value_AnotherType
): React_Node_Value_AnotherType
end
