let a, b, c;
function d() {
  try {
    return 'foo';
  } catch (error) {
    b = error.toString();
  } finally {
    c = 'baz';
  }
}
