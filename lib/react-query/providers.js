"use client";
import React from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { message } from "antd";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
      retry: 0,
      placeholderData: undefined,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      message.error(error.message);
    },
  }),
});

const ReactQueryProviders = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProviders;
