local function reduce(ref)
	local foo, bar, table_, error_, repeat_, until_ =
		ref.foo, ref.bar, ref.table, ref.error, ref["repeat"], ref["until"]
	return { foo, bar, table_, error_, repeat_, until_ }
end
