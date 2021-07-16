let a = 0, b, breakFast;
switch (a++) {
  case 0:
    if (breakFast) {
      break;
    }
    b = 1;
  case 1:
    if (breakFast) {
      break;
    }
    b = 2;
  default:
    if (breakFast) {
      break;
    }
    b = 3;
}
