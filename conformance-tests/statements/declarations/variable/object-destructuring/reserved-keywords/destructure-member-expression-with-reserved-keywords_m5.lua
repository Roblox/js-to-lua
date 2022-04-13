local obj = { nested = { ["repeat"] = "repeat", error = "error", table = "table" } }
local repeat_, error_, table_
do
	local ref = obj.nested
	repeat_, error_, table_ = ref["repeat"], ref.error, ref.table
end
