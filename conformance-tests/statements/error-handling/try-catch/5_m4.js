let b, c;
function d() {
  try {
    return b++;
  } catch (error) {
    return c++;
  } finally {
    return b + c;
  }
}
