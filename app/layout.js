import Header from '@/components/Header'
import './globals.css'
import { Inter } from 'next/font/google'
import SideBar from '@/components/SideBar'
import MobileNavs from '@/components/MobileNavs'
import DataContextProvider from '@/context/DataContext'
import ToastComponent from '@/components/ToastComponent'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'nextagram',
  description: 'Next js chat application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DataContextProvider>
          <div className="flex w-full h-screen flex-col">
            <ToastComponent />
            <Header />
            <div className="container h-5/6 md:h-full w-full flex flex-row">
              <div className="container hidden md:block w-0 md:w-2/12"><SideBar /></div>
              <div className="container h-full w-full md:w-8/12 mx-auto overflow-auto">{children}</div>
              <div className="container hidden md:block md:w-2/12"></div>
            </div>
            <MobileNavs />
          </div>
        </DataContextProvider>
      </body>
    </html>
  )
}
