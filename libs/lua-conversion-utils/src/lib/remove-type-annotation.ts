export const removeTypeAnnotation = <T>(node: T) => {
  const newNode: T = { ...node };
  delete (newNode as any).typeAnnotation;
  return newNode;
};
