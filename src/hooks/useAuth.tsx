import axios from "axios";
import { useEffect, useState } from "react";
import { BaseUrl } from "../App";

export type HandleLogin = ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => void;

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState(0);

  const handleLogin: HandleLogin = ({
    name,
    email,
  }: {
    name: string;
    email: string;
  }) => {
    axios
      .post(BaseUrl + "/auth/login", { name, email }, { withCredentials: true })
      .then((res) => {
        console.log(res);
        setStatus(res.status);
      })
      .catch((e) => {
        if (e.status) {
          setStatus(e.status);
        }
      });
  };

  useEffect(() => {
    if (status === 200) {
      console.log("setting auth");
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [status]);

  return { isAuthenticated, handleLogin };
};
