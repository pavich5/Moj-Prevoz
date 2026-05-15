export const truncateName = (name: string, maxLength: number = 16): string => {
  return name?.length > maxLength ? `${name.slice(0, maxLength - 3)}...` : name;
};
