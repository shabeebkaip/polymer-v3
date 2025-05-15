"use client";

import { getUserInfo } from "@/apiServices/user";
import { useState, useEffect } from "react";

export interface UserInfo {
  [Key: string]: any;
}

export function useUserInfo() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    getUserInfo().then((response) => {
      setUser(response.userInfo);
    });
  }, []);

  return { user };
}

// Usage example
// const { user } = useUserInfo();
