local function reduce(ref0)
	local foo, bar, table_, error_, repeat_, until_ =
		ref0.foo, ref0.bar, ref0.table, ref0.error, ref0["repeat"], ref0["until"]
	return { foo, bar, table_, error_, repeat_, until_ }
end
