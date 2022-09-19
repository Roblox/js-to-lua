-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/unhandled-assignment_m5.js
local a, b, c = 1, 2, 3
error("not implemented") --[[ ROBLOX TODO: Unhandled node for type: AssignmentExpression ]] --[[ a ||= 1 ]]
error("not implemented") --[[ ROBLOX TODO: Unhandled node for type: AssignmentExpression ]] --[[ b ||= c ]]
error("not implemented") --[[ ROBLOX TODO: Unhandled node for type: AssignmentExpression ]] --[[ c ||= true ]]
