local foo, repeat_, error_, table_
do
	local ref = {
		foo = "bar",
		bar = { ["repeat"] = "repeat", ["error"] = "error", ["table"] = "table" },
	}
	foo, repeat_, error_, table_ = ref.foo, ref.bar["repeat"], ref.bar.error, ref.bar.table
end
