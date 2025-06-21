import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import LayoutApp from './layout';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const noLayoutRoutes = ['/login', '/signup']; // Bỏ /404
  const isNoLayoutRoute = noLayoutRoutes.includes(router.pathname);

  const isErrorPage = Component.name === 'Error';

  if (isNoLayoutRoute || isErrorPage) {
    return <Component {...pageProps} />;
  }

  return (
    <LayoutApp>
      <Component {...pageProps} />
    </LayoutApp>
  );
}
