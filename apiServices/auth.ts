import axiosInstance from "@/lib/axiosInstance";

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/user/login", {
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

export const register = async (data: any) => {
  try {
    const response = await axiosInstance.post("/auth/user/register", data);
    return response.data;
  } catch (error: any) {
    return {
      status: false,
      message: error.response?.data?.message || "An unexpected error occurred.",
    };
  }
};

// Verify registration OTP
export const verifyRegistrationOtp = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post("/auth/user/verify-registration-otp", { email, otp });
    return response.data;
  } catch (error: any) {
    return {
      status: false,
      message: error.response?.data?.message || "Invalid or expired OTP.",
    };
  }
};

// Resend registration OTP
export const resendRegistrationOtp = async (email: string) => {
  try {
    const response = await axiosInstance.post("/auth/user/resend-otp", { email });
    return response.data;
  } catch (error: any) {
    return {
      status: false,
      message: error.response?.data?.message || "Unable to resend OTP.",
    };
  }
};

// Forgot password (request OTP)
export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axiosInstance.post("/auth/user/forgot-password", { email });
    return response.data;
  } catch (error: any) {
    return {
      status: false,
      message: error.response?.data?.message || "Unable to send reset OTP.",
    };
  }
};

// Verify password reset OTP
export const verifyPasswordResetOtp = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post("/auth/user/verify-otp", { email, otp });
    return response.data;
  } catch (error: any) {
    return {
      status: false,
      message: error.response?.data?.message || "Invalid or expired OTP.",
    };
  }
};

// Reset password after OTP verification
export const resetPassword = async (email: string, newPassword: string) => {
  try {
    const response = await axiosInstance.post("/auth/user/reset-password", { email, newPassword });
    return response.data;
  } catch (error: any) {
    return {
      status: false,
      message: error.response?.data?.message || "Unable to reset password.",
    };
  }
};
