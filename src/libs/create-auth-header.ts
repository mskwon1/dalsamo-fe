const createAuthHeader = (token: string) => {
  return {
    Authorization: `Bearer ${token}`,
  };
};

export default createAuthHeader;
