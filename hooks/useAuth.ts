"use client";

import { useCallback } from "react";
import { useMutation, useApolloClient } from "@apollo/client/react";
import {
  LOGIN_MUTATION,
  SIGNUP_MUTATION,
  LOGOUT_MUTATION,
} from "@/graphql/operations";
import {
  setToken,
  setRefreshToken,
  clearTokens,
  getRefreshToken,
} from "@/lib/auth";
import toast from "react-hot-toast";
import { extractErrorMessage } from "@/lib/api-error";
import type { LoginInput, SignupInput } from "@/graphql/generated/graphql";

export function useAuth() {
  const apolloClient = useApolloClient();

  const [loginMutation, loginState] = useMutation(LOGIN_MUTATION);
  const [signupMutation, signupState] = useMutation(SIGNUP_MUTATION);
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  const login = useCallback(
    async (input: LoginInput): Promise<void> => {
      try {
        const { data } = await loginMutation({ variables: { input } });
        if (data?.login?.accessToken && data?.login?.refreshToken) {
          setToken(data.login.accessToken);
          setRefreshToken(data.login.refreshToken);
          toast.success("Welcome back!");
        }
      } catch (err) {
        toast.error(extractErrorMessage(err));
        throw err;
      }
    },
    [loginMutation]
  );

  const signup = useCallback(
    async (input: SignupInput): Promise<void> => {
      try {
        const { data } = await signupMutation({ variables: { input } });
        if (data?.signup?.accessToken && data?.signup?.refreshToken) {
          setToken(data.signup.accessToken);
          setRefreshToken(data.signup.refreshToken);
          toast.success("Account created successfully!");
        }
      } catch (err) {
        toast.error(extractErrorMessage(err));
        throw err;
      }
    },
    [signupMutation]
  );

  const logout = useCallback(async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await logoutMutation({ variables: { refreshToken } });
      } catch (err) {
        console.warn("Logout mutation failed", err);
      }
    }
    clearTokens();
    await apolloClient.clearStore();
    toast.success("Logged out");
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
  }, [apolloClient, logoutMutation]);

  return {
    login,
    signup,
    logout,
    loginLoading: loginState.loading,
    signupLoading: signupState.loading,
    loginError: loginState.error,
    signupError: signupState.error,
  };
}
