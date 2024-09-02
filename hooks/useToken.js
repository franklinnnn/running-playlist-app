"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "../utils/spotify";

const useToken = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const { token } = getAccessToken();
    setToken(token);
  }, []);

  return token;
};

export default useToken;
