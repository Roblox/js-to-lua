function foo() {
  let a;
  try {
    a = 'foo';
  } finally {
    return 'bar';
  }
}
