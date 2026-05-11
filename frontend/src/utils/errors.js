export const getErrorMessage = (error, fallback) => {
  const apiError = error.response?.data;

  if (Array.isArray(apiError?.errors) && apiError.errors.length > 0) {
    return apiError.errors.map((item) => item.msg).join(", ");
  }

  return apiError?.message || fallback;
};
