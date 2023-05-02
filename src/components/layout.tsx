import Footer from "./Footer";
import Navbar from "./Navbar";
import { ReactNode } from "react"

type LayoutProps = { children?: ReactNode }

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}