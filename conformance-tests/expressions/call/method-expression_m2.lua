local foo = { ["some-method"] = function(self) end }
local method = "method"
foo["some-" .. tostring(method)](foo)
