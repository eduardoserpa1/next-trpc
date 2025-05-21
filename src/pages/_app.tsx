   import { trpc, trpcClient } from '../utils/trpc';
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   import '../app/globals.css';

   const queryClient = new QueryClient();

   export default function App({ Component, pageProps }: any) {
     return (
       <trpc.Provider client={trpcClient} queryClient={queryClient}>
         <QueryClientProvider client={queryClient}>
           <Component {...pageProps} />
         </QueryClientProvider>
       </trpc.Provider>
     );
   }