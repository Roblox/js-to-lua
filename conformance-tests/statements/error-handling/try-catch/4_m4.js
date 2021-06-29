let b;
function d() {
  try {
    return 'foo';
  } catch (error) {
    b = error.toString();
  } finally {
    return 'baz';
  }
}
