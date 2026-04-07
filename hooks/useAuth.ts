"use client";

import { useCallback } from "react";
import { useMutation, useApolloClient } from "@apollo/client/react";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "@/graphql/operations";
import { setToken, clearToken } from "@/lib/auth";
import type { AuthPayload, SignupInput, LoginInput } from "@/types/api";

interface LoginData {
  login: AuthPayload;
}

interface SignupData {
  signup: AuthPayload;
}

export function useAuth() {
  const apolloClient = useApolloClient();

  const [loginMutation, loginState] = useMutation<LoginData>(LOGIN_MUTATION);
  const [signupMutation, signupState] = useMutation<SignupData>(SIGNUP_MUTATION);

  const login = useCallback(
    async (input: LoginInput): Promise<void> => {
      const { data } = await loginMutation({ variables: { input } });
      if (data?.login?.accessToken) {
        setToken(data.login.accessToken);
      }
    },
    [loginMutation]
  );

  const signup = useCallback(
    async (input: SignupInput): Promise<void> => {
      const { data } = await signupMutation({ variables: { input } });
      if (data?.signup?.accessToken) {
        setToken(data.signup.accessToken);
      }
    },
    [signupMutation]
  );

  const logout = useCallback(async (): Promise<void> => {
    clearToken();
    await apolloClient.clearStore();
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
