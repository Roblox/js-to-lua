let b, c;
function d() {
  try {
    b = 'foo';
  } catch (error) {
    b = error.toString();
    return 'baz';
  } finally {
    c = 'bar';
  }
}
