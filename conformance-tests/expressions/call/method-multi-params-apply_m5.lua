local foo = { bar = { apply = function(self) end } }
foo.bar:apply(1, 2, 3)
