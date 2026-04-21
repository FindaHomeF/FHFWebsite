import { Mulish, Abhaya_Libre } from "next/font/google";

export const mulish = Mulish({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-mulish',
});

export const abhayaLibre = Abhaya_Libre({
  weight: '800',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-abhaya-libre',
});
