import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  QueryFunction,
} from '@tanstack/react-query';

import App from './App';
import api from 'services/api';
import apiDev from 'services/api-dev';
import apiDevV2 from 'services/api-dev-v2';
import { ToastProvider } from 'context/ToastContext';
import 'styles/main.scss';
import '../i18n';
import { CookiesProvider } from 'react-cookie';

const defaultQueryFn: QueryFunction | undefined = async ({ queryKey }) => {
  if (queryKey.includes('prod')) {
    const { data } = await apiDev.get(queryKey[0] as string);
    return data;
  }

  if (queryKey[1] === 'prod-2') {
    const { data } = await apiDevV2.get(queryKey[0] as string);
    return data?.response;
  }

  if (checkNotNullOrUndefined(queryKey[1]) && (queryKey[1] as string).startsWith('http') ) {
    const  response  = await api({ url: queryKey[0] as string, baseURL: queryKey[1] as string });
    return response;
  }

  const { data } = await api.get(queryKey[0] as string);
  return data;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

function checkNotNullOrUndefined(variable: any) {
  if (variable == null) {
      return false;
  }

  if (variable === null) {
      return false;
  }

  if (typeof variable === 'undefined') {
      return false;
  }

  return true;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ToastProvider>
          <CookiesProvider>
            <App />
          </CookiesProvider>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
