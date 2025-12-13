import { Eye, Pencil, Trash2, ExternalLink, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ApplicationListItemResponse } from '@/services/applications/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils';

interface ApplicationsCardViewProps {
    application: ApplicationListItemResponse;
    onView: (app: ApplicationListItemResponse) => void;
    onEdit?: (app: ApplicationListItemResponse) => void;
    onDelete?: (app: ApplicationListItemResponse) => void;
}

export function ApplicationsCardView({ application, onView, onEdit, onDelete }: ApplicationsCardViewProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={application.icon_url} alt={application.name} />
                                <AvatarFallback>{getInitials(application.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold">{application.name}</h3>
                                <code className="text-xs bg-muted px-2 py-0.5 rounded">{application.code}</code>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant={application.is_active ? 'default' : 'secondary'} className="text-xs">
                                        {application.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                    {application.single_session && (
                                        <Badge variant="outline" className="text-xs">
                                            Single Session
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {application.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {application.description}
                        </p>
                    )}

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <ExternalLink className="h-4 w-4" />
                            <a
                                href={application.base_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline truncate"
                            >
                                {application.base_url}
                            </a>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(application)}>
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
                                    <DropdownMenuItem onClick={() => onEdit(application)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                )}
                                {onDelete && (
                                    <DropdownMenuItem onClick={() => onDelete(application)} className="text-destructive">
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

export default ApplicationsCardView;
