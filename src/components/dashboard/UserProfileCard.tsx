import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { UserResponse } from '@/services/users/types';
import { Mail, Phone, Calendar, Edit } from 'lucide-react';

interface UserProfileCardProps {
    user: UserResponse;
    onEdit?: () => void;
}

export function UserProfileCard({ user, onEdit }: UserProfileCardProps) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'superadmin':
                return 'destructive';
            case 'admin':
                return 'default';
            default:
                return 'secondary';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <div className="glass-card group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-secondary to-tertiary opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20" />

            <div className="relative z-10 flex flex-col items-center space-y-4 text-center sm:flex-row sm:space-x-6 sm:space-y-0 sm:text-left">
                {/* Avatar */}
                <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-lg transition-transform duration-300 group-hover:scale-105">
                    <AvatarImage src={user.avatar_url} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-primary-foreground">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-1 space-y-3">
                    <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            {user.name}
                        </h2>
                        <Badge
                            variant={getRoleBadgeVariant(user.role)}
                            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                            {user.role}
                        </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                        {user.email && (
                            <div className="flex items-center justify-center gap-2 sm:justify-start">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>
                        )}
                        {user.phone && (
                            <div className="flex items-center justify-center gap-2 sm:justify-start">
                                <Phone className="h-4 w-4" />
                                <span>{user.phone}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-center gap-2 sm:justify-start">
                            <Calendar className="h-4 w-4" />
                            <span>Bergabung {formatDate(user.created_at)}</span>
                        </div>
                    </div>
                </div>

                {/* Edit Button */}
                {onEdit && (
                    <Button
                        onClick={onEdit}
                        variant="outline"
                        size="icon"
                        className="hover-lift transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                    >
                        <Edit className="h-5 w-5" />
                    </Button>
                )}
            </div>
        </div>
    );
}
