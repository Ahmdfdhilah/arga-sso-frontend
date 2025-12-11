import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
    children: ReactNode;
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
}

export function MainLayout({ children, userName, userEmail, userAvatar }: MainLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-muted/30 to-background">
            <Header userName={userName} userEmail={userEmail} userAvatar={userAvatar} />
            <main className="container mx-auto flex-1 px-6 py-8 lg:py-2">
                {children}
            </main>
            <Footer />
        </div>
    );
}
