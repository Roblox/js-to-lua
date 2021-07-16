let a = 0, b, breakFast;
switch (a++) {
  case 0:
    b = 1;
    break;
  case 1:
    b = 2;
    break;
  default:
    if (breakFast) {
      break;
    }
    b = 3;
}
