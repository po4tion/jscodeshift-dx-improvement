export const isServer = () => {
  console.log("utils-isServer", __filename);

  return typeof window !== undefined;
};
