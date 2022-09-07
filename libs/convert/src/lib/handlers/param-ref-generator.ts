export const createParamRefGenerator = () => {
  let paramRefIdCount = 0;

  return {
    next: () => `ref${paramRefIdCount++}`,
  };
};
