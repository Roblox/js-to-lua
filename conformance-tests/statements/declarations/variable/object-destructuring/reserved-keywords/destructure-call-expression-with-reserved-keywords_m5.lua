local function func()
	return { ["repeat"] = "repeat", ["error"] = "error", ["table"] = "table" }
end
local repeat_, error_, table_
do
	local ref = func()
	repeat_, error_, table_ = ref["repeat"], ref.error, ref.table
end
