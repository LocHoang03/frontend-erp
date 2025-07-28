import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import LayoutApp from './layout';
import { useRouter } from 'next/router';
import StoreProvider from './StoreProvider';
import { UserContextComponent } from '@/context/userContext';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const noLayoutRoutes = ['/login'];
  const isNoLayoutRoute = noLayoutRoutes.includes(router.pathname);

  const isErrorPage = Component.name === 'Error';

  return (
    <UserContextComponent>
      {isNoLayoutRoute || isErrorPage ? (
        <Component {...pageProps} />
      ) : (
        <StoreProvider>
          <LayoutApp>
            <Component {...pageProps} />
          </LayoutApp>
        </StoreProvider>
      )}
    </UserContextComponent>
  );
}
