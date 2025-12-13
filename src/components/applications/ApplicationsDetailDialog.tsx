import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Code, ExternalLink, Globe, Lock, Image as ImageIcon } from 'lucide-react';
import type { ApplicationResponse } from '@/services/applications/types';
import { getFormattedDate } from '@/utils';

interface ApplicationsDetailDialogProps {
    open: boolean;
    onClose: () => void;
    application: ApplicationResponse | null;
}

export function ApplicationsDetailDialog({ open, onClose, application }: ApplicationsDetailDialogProps) {
    if (!application) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detail Aplikasi</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {application.img_url && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <ImageIcon className="h-4 w-4 text-primary" />
                                <span>Banner Image</span>
                            </div>
                            <img
                                src={application.img_url}
                                alt={application.name}
                                className="w-full h-48 object-cover rounded-lg border"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Nama Aplikasi</div>
                            <div className="font-medium">{application.name}</div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Code className="h-4 w-4" />
                                <span>Kode</span>
                            </div>
                            <code className="text-sm bg-muted px-2 py-1 rounded">{application.code}</code>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            <span>Base URL</span>
                        </div>
                        <a
                            href={application.base_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-2"
                        >
                            {application.base_url}
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>

                    {application.description && (
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Deskripsi</div>
                            <div className="text-sm">{application.description}</div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Status</div>
                            <Badge variant={application.is_active ? 'default' : 'secondary'}>
                                {application.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Lock className="h-4 w-4" />
                                <span>Single Session</span>
                            </div>
                            <Badge variant={application.single_session ? 'outline' : 'secondary'}>
                                {application.single_session ? 'Ya' : 'Tidak'}
                            </Badge>
                        </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Tanggal dibuat</span>
                        </div>
                        <div className="text-sm">{getFormattedDate(application.created_at)}</div>
                    </div>

                    {application.updated_at && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Terakhir diperbarui</span>
                            </div>
                            <div className="text-sm">{getFormattedDate(application.updated_at)}</div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ApplicationsDetailDialog;
