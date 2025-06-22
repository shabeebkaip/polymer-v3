"use client";

import { getUserInfo } from "@/apiServices/user";
import { useState, useEffect } from "react";

export interface UserInfo {
  [Key: string]: any;
}

export function useUserInfo() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  useEffect(() => {
    getUserInfo().then((response) => {
      setUser(response.userInfo);
      setUserLoading(false);
    });
  }, []);

  return { user, userLoading };
}

// Usage example
// const { user, userLoading } = useUserInfo();
