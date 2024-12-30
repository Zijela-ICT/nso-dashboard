"use client";
import {QueryClient, QueryClientProvider} from "react-query";
import {Toaster} from "sonner";
import {ReactNode, useState} from "react";

export function Providers({children}: {children: ReactNode}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: 1,
            staleTime: 5 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        duration={10000}
        closeButton
        richColors
        position="top-right"
        expand={true}
      />
      {children}
    </QueryClientProvider>
  );
}
