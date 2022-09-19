-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/complex/jest-reporters-stream-fns_m5.ts
type DefaultReporter = {}
type DefaultReporter_statics = { new: () -> DefaultReporter }
local DefaultReporter = {} :: DefaultReporter & DefaultReporter_statics;
(DefaultReporter :: any).__index = DefaultReporter
function DefaultReporter.new(): DefaultReporter
	local self = setmetatable({}, DefaultReporter)
	local stream = {}
	--[[ we assign an arrow function to write so we want to capture `this` from lexical scope and ignore the one passed ]]
	stream.write = function(_self: any, chunk: string)
		self:__clearStatus()
		write(chunk)
		self:__printStatus()
		return true
	end
	--[[ we assign a regular function to write so we want to use the passed in `this` ]]
	stream.write2 = function(self: any, chunk: string)
		self:__clearStatus()
		write(chunk)
		self:__printStatus()
		return true
	end
	self.stream = stream
	return (self :: any) :: DefaultReporter
end
