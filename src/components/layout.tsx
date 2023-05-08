import Footer from "./Footer";
import Navbar from "./Navbar";
import type { ReactNode } from "react"

type LayoutProps = { children?: ReactNode }

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}