import React from "react";

export const useToken = () => {
  const [token, setToken] = React.useState(localStorage.getItem("token"));
  React.useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  return token;
};
