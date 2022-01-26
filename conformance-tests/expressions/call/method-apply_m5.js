const foo = {
  bar() {}
};
const args = [1, 2, 3]
foo.bar.apply(foo, args);
