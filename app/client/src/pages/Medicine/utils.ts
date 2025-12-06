export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
