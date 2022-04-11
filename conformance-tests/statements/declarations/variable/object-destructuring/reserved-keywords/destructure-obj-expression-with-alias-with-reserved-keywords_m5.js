const obj = {
  repeat: 'repeat',
  error: 'error',
  err: 'err',
  table: 'table',
  tbl: 'tbl'
};
const { repeat: until, error: err, err: error, table: tbl, tbl: table } = { ...obj };
