import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserListItemResponse } from '@/services/users/types';
import { getRoleBadgeVariant, getInitials, getFormattedDate } from '@/utils';
import { Mail, Phone, Calendar, User, MapPin, FileText } from 'lucide-react';

interface UsersDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: UserListItemResponse | null;
}

export function UsersDetailDialog({ open, onOpenChange, user }: UsersDetailDialogProps) {
    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Detail User</DialogTitle>
                    <DialogDescription>Informasi lengkap user</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatar_url} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-semibold">{user.name}</h3>
                            {user.alias && <p className="text-muted-foreground">@{user.alias}</p>}
                            <div className="flex gap-2 mt-2">
                                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                    {user.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {user.email && (
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user.email}</span>
                            </div>
                        )}

                        {user.phone && (
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{user.phone}</span>
                            </div>
                        )}

                        {user.gender && (
                            <div className="flex items-center gap-3 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{user.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</span>
                            </div>
                        )}

                        {user.date_of_birth && (
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{getFormattedDate(user.date_of_birth)}</span>
                            </div>
                        )}

                        {user.address && (
                            <div className="flex items-start gap-3 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <span>{user.address}</span>
                            </div>
                        )}

                        {user.bio && (
                            <div className="flex items-start gap-3 text-sm">
                                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <span>{user.bio}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t pt-4 space-y-2 text-sm text-muted-foreground">
                        <div>Dibuat: {getFormattedDate(user.created_at)}</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default UsersDetailDialog;
