import { LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/utils';
import logoKecil from '@/assets/logo_abi_lightmode.png';
import { useLogout } from '@/hooks/tanstackHooks/useAuth';

interface HeaderProps {
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
}

export function Header({ userName, userEmail, userAvatar }: HeaderProps) {
    const navigate = useNavigate();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                navigate('/login');
            },
        });
    };

    return (
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
                <Link to="/" className="flex items-center gap-4">
                    <img src={logoKecil} alt="Arga Bumi Indonesia" className="h-10 lg:h-12 w-auto" />
                </Link>

                <div className="flex flex-1 items-center justify-center px-8">
                </div>

                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-9 w-9 border-2 border-primary/20">
                                    <AvatarImage src={userAvatar} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                        {userName ? getInitials(userName) : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{userName || 'User'}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {userEmail || ''}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleProfileClick}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profil Saya</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>{isLoggingOut ? 'Keluar...' : 'Keluar'}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

