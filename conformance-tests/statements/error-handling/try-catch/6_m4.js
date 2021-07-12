let b, c;
function d() {
  try {
    b = 'foo';
  } catch (e) {
    b = e.toString();
    return 'baz';
  } finally {
    c = 'bar';
  }
}
