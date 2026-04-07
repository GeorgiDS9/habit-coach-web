"use client";

import { useCallback } from "react";
import { useMutation, useApolloClient } from "@apollo/client/react";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "@/graphql/operations";
import { setToken, clearToken } from "@/lib/auth";
import toast from "react-hot-toast";
import { extractErrorMessage } from "@/lib/api-error";

export function useAuth() {
  const apolloClient = useApolloClient();

  const [loginMutation, loginState] = useMutation(LOGIN_MUTATION);
  const [signupMutation, signupState] = useMutation(SIGNUP_MUTATION);

  const login = useCallback(
    async (input: any): Promise<void> => {
      try {
        const { data } = await loginMutation({ variables: { input } });
        if (data?.login?.accessToken) {
          setToken(data.login.accessToken);
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
    async (input: any): Promise<void> => {
      try {
        const { data } = await signupMutation({ variables: { input } });
        if (data?.signup?.accessToken) {
          setToken(data.signup.accessToken);
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
    clearToken();
    await apolloClient.clearStore();
    toast.success("Logged out");
  }, [apolloClient]);

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
