local Array = {
	concat = function() end,
	spread = function() end,
	indexOf = function() end,
}

local Object = {
	assign = function(target, ...)
		for index = 1, select("#", ...) do
			local source = select(index, ...)

			if source ~= nil and typeof(source) == "table" then
				for key, value in pairs(source) do
					if value == None then
						target[key] = nil
					else
						target[key] = value
					end
				end
			end
		end

		return target
	end,
	keys = function() end,
}

local Boolean = {
	toJSBoolean = function() end,
}

local React = {
	createElement = function() end,
}

local describe = function() end
local it = function() end
