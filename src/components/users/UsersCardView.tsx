import { Eye, Pencil, Trash2, Mail, Phone, Calendar, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserListItemResponse } from '@/services/users/types';
import { getRoleBadgeVariant, getInitials } from '@/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UsersCardViewProps {
    user: UserListItemResponse;
    onView: (user: UserListItemResponse) => void;
    onEdit?: (user: UserListItemResponse) => void;
    onDelete?: (user: UserListItemResponse) => void;
}

export function UsersCardView({ user, onView, onEdit, onDelete }: UsersCardViewProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar_url} alt={user.name} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold">{user.name}</h3>
                                {user.alias && (
                                    <p className="text-sm text-muted-foreground">@{user.alias}</p>
                                )}
                                <div className="flex gap-2 mt-1">
                                    <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                                        {user.role}
                                    </Badge>
                                    <Badge
                                        variant={user.status === 'active' ? 'default' : 'secondary'}
                                        className="text-xs"
                                    >
                                        {user.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        {user.email && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>
                        )}
                        {user.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>{user.phone}</span>
                            </div>
                        )}
                        {user.gender && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{user.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Detail
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {onEdit && (
                                    <DropdownMenuItem onClick={() => onEdit(user)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                )}
                                {onDelete && (
                                    <DropdownMenuItem onClick={() => onDelete(user)} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Hapus
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default UsersCardView;
