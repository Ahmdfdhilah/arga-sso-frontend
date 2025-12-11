import type { ReactNode } from 'react';
import { Header } from './Header';

interface MainLayoutProps {
    children: ReactNode;
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
}

export function MainLayout({ children, userName, userEmail, userAvatar }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
            <Header userName={userName} userEmail={userEmail} userAvatar={userAvatar} />
            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
