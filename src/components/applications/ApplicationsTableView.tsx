import { Eye, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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

interface ApplicationsTableViewProps {
    applications: ApplicationListItemResponse[];
    onView: (app: ApplicationListItemResponse) => void;
    onEdit?: (app: ApplicationListItemResponse) => void;
    onDelete?: (app: ApplicationListItemResponse) => void;
}

export function ApplicationsTableView({ applications, onView, onEdit, onDelete }: ApplicationsTableViewProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Application</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Base URL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Single Session</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.map((app) => (
                        <TableRow key={app.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={app.icon_url} alt={app.name} />
                                        <AvatarFallback>{getInitials(app.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{app.name}</div>
                                        {app.description && (
                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                {app.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <code className="text-xs bg-muted px-2 py-1 rounded">{app.code}</code>
                            </TableCell>
                            <TableCell>
                                <a
                                    href={app.base_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline text-sm"
                                >
                                    {app.base_url}
                                </a>
                            </TableCell>
                            <TableCell>
                                <Badge variant={app.is_active ? 'default' : 'secondary'}>
                                    {app.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={app.single_session ? 'outline' : 'secondary'}>
                                    {app.single_session ? 'Yes' : 'No'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onView(app)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Detail
                                        </DropdownMenuItem>
                                        {onEdit && (
                                            <DropdownMenuItem onClick={() => onEdit(app)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                        )}
                                        {onDelete && (
                                            <DropdownMenuItem onClick={() => onDelete(app)} className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hapus
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default ApplicationsTableView;
