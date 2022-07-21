local foo: () ->  --[[ Comment before foo void ]]() --[[ Comment after foo void ]]
function foo(): () end
local function fizz():  --[[ Comment before fizz void ]]()
	--[[ Comment after fizz void ]]
end
local buzz: () ->  --[[ Comment before lhs buzz void ]]() --[[ Comment after lhs buzz void ]]
function buzz():  --[[ Comment before rhs buzz void ]]()
	--[[ Comment after rhs buzz void ]]
end
local function jazz():  --[[ Comment before jazz void ]]()
	--[[ Comment after jazz void ]]
end
