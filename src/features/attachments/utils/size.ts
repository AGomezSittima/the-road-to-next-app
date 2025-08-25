export const sizeInMB = (
  sizeInBytes: number,
  decimalsNum: number = 2,
): number => {
  const result = sizeInBytes / (1024 * 1024);

  return Number(result.toFixed(decimalsNum));
};
