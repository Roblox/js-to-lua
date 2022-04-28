local foo:  --[[ Before A ]]--[[ Before B ]]--[[ Before C ]]
A_B_C--[[ After A ]]--[[ After B ]]
--[[ After C ]]
 =
	bar
local function myFunc(
):  --[[ Before React ]]--[[ Before Node ]]--[[ Before Value ]]
React_Node_Value
	--[[ After React ]]
	--[[ After Node ]]
	--[[ After Value ]]
end
local function myFunc2(
	baz:  --[[ Before React ]] --[[ Before Node ]]	--[[ Before Value ]]
React_Node_Value
	--[[ After React ]]
	--[[ After Node ]]
	--[[ After Value ]]
):  --[[ Before React ]]--[[ Before Node ]]--[[ Before Value ]]
React_Node_Value
	--[[ After React ]]
	--[[ After Node ]]
	--[[ After Value ]]
end
local function myFunc3(
	baz:  --[[ Before React ]] --[[ Before Node ]]	--[[ Before Value ]]
React_Node_Value --[[ After React ]]	--[[ After Node ]]
	--[[ After Value ]]
,
	biz:  --[[ Before React ]] --[[ Before Node ]]	--[[ Before Value ]]
	--[[ Before AnotherType ]]
React_Node_Value_AnotherType
	--[[ After React ]]
	--[[ After Node ]]
	--[[ After Value ]]
	--[[ After AnotherType ]]
):  --[[ Before React ]]--[[ Before Node ]]--[[ Before Value ]]
--[[ Before AnotherType ]]
React_Node_Value_AnotherType
	--[[ After React ]]
	--[[ After Node ]]
	--[[ After Value ]]
	--[[ After AnotherType ]]
end
