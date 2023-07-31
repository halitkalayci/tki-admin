"use client"
import Image from 'next/image'
import styles from './page.module.css'
import { useContext, useEffect } from 'react'
import { LayoutContext } from './contexts/LayoutContext';
import { addLocale, locale } from 'primereact/api';

export default function Home() {
  const layoutContext = useContext(LayoutContext)
  useEffect(() => {
    layoutContext.setShowLayout(true);
  }, []);


  return (
    <p>
      Merhaba
    </p>
  )
}
