local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
type Parser = { parseVariableDefinition: (self: Parser) -> VariableDefinitionNode }
type Parser_statics = { new: () -> Parser }
local Parser = {} :: Parser & Parser_statics;
(Parser :: any).__index = Parser
function Parser.new(): Parser
	local self = setmetatable({}, Parser)
	return (self :: any) :: Parser
end
function Parser:parseVariableDefinition(): VariableDefinitionNode
	local refArg0 = self._lexer.token
	local refProp0 = Kind.VARIABLE_DEFINITION
	local refProp1 = self:parseVariable()
	self:expectToken(TokenKind.COLON)
	local refProp2 = self:parseTypeReference()
	return self:node(refArg0, {
		kind = refProp0,
		variable = refProp1,
		type = refProp2,
		defaultValue = if Boolean.toJSBoolean(self:expectOptionalToken(TokenKind.EQUALS))
			then self:parseConstValueLiteral()
			else nil,
		directives = self:parseConstDirectives(),
	})
end
