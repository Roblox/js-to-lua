local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
addDescription(function(ref: DirectiveDefinitionNode)
	local name, args, repeatable, locations = ref.name, ref.arguments, ref.repeatable, ref.locations
	return "directive @"
		.. tostring(name)
		.. tostring(
			if Boolean.toJSBoolean(hasMultilineItems(args))
				then wrap("(\n", indent(join(args, "\n")), "\n)")
				else wrap("(", join(args, ", "), ")")
		)
		.. (if Boolean.toJSBoolean(repeatable) then " repeatable" else "")
		.. " on "
		.. tostring(join(locations, " | "))
end)
