import "./globals.css";
import ToasterProvider from './components/global/ToasterProvider';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CartProvider } from '@/contexts/CartContext';
import { DataProvider } from '@/contexts/DataContext';
import { QueryProvider } from '@/components/providers/QueryProvider';
import AuthSessionGuard from '@/components/providers/AuthSessionGuard';
import { mulish } from '@/lib/fonts';

export const metadata = {
  title: "Find-a-Home FUTA | Your Trusted Student Housing Platform",
  description: "The #1 platform for FUTA student accommodation. Find verified properties, connect with trusted service providers, and discover affordable essentials. Simple, safe, student-focused.",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body
          className={`${mulish.className}  antialiased`}
        >   
         <QueryProvider>
           <DataProvider>
            <WishlistProvider>
              <CartProvider>
                <AuthSessionGuard />
                <ToasterProvider />
                {children}
              </CartProvider>
            </WishlistProvider>
           </DataProvider>
         </QueryProvider>
        </body>
      </html>
  );
}
