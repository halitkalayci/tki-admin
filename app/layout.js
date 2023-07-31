"use client"
import Head from 'next/head'
import { Inter } from 'next/font/google'
import MainLayout from './components/MainLayout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import '../public/themes/lara-light-indigo/theme.css'
import './globals.css'

import { LayoutProvider } from './contexts/LayoutContext';
import { LoaderProvider } from './contexts/LoaderContext';
import Subscriber from './components/Subscriber/Subscriber';
import { useEffect } from 'react';
import { addLocale, locale } from 'primereact/api';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout(props) {


  useEffect(() => {
    fetch('/tr.json').then(response => response.json()).then((json) => {
      console.log(json);
      addLocale("tr", json);
      locale("tr");
    })
  }, [])

  return (
    <html lang="en">
      <Head>
        <title>TKI Admin Panel</title>
        <meta charSet="UTF-8" />
        <meta name="description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta property="og:type" content="website"></meta>
        <meta property="og:title" content="Sakai by PrimeReact | Free Admin Template for NextJS"></meta>
        <meta property="og:url" content="https://www.primefaces.org/sakai-react"></meta>
        <meta property="og:description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
        <meta property="og:image" content="https://www.primefaces.org/static/social/sakai-nextjs.png"></meta>
        <meta property="og:ttl" content="604800"></meta>
        <link rel="icon" href={`/favicon.ico`} type="image/x-icon"></link>
      </Head>
      <body>
        <LayoutProvider>
          <LoaderProvider>
            <MainLayout>
              <Subscriber></Subscriber>
              {props.children}
            </MainLayout>
          </LoaderProvider>
        </LayoutProvider>
      </body>
    </html>
  )
}
