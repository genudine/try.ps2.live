import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>try.ps2.live</title>
        <meta name="description" content="PlanetSide 2 Census API Playground" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
