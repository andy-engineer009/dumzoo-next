import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/store/Provider";
import LocalStorageValueHandler from "@/components/localstroageValue-handler";
import { AuthProvider } from "@/providers/AuthProvider";
import MemoryManager from "@/components/common/MemoryManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dumzoo ",
  description: "Dumzoo is a platform for influencers to find brands to collaborate with",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" href="/images/fav/fav_icon.png" />   
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />  
      </head>
      <body
        className= {`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider> 
        <LocalStorageValueHandler />
          <AuthProvider>
            {children}
            <MemoryManager 
              enableDeviceOptimization={true}
              enableLogging={true}
              showDebugPanel={false}
            />
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
