import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { ThemeProvider } from '../components/ThemeProvider';
import "./globals.css";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
    title: "E-Commerce App",
    description: "A premium modern store",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="flex flex-col min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans antialiased transition-colors duration-200" suppressHydrationWarning>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <AuthProvider>
                        <CartProvider>
                            <Navbar />
                            <main className="flex-grow pt-20 pb-10 px-4 max-w-7xl mx-auto w-full">
                                {children}
                            </main>
                            <Footer />
                        </CartProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
