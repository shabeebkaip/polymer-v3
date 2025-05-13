import axiosInstance from "@/lib/axiosInstance";

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("auth/user/login", {
      email,
      password,
    });

    return {
      status: true,
      token: response.data.token,
      userInfo: response.data.userInfo, // or whatever field it is
    };
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Invalid credentials
      return {
        status: false,
        message: "Invalid email or password.",
      };
    }

    // Handle other errors (network issues, 500, etc.)
    return {
      status: false,
      message: error.response?.data?.message || "An unexpected error occurred.",
    };
  }
};
