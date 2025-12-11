import { ExternalLink, Clock, ImageIcon } from 'lucide-react';
import type { AllowedAppResponse } from '@/services/applications/types';

interface ApplicationCardProps {
    app: AllowedAppResponse;
}

export function ApplicationCard({ app }: ApplicationCardProps) {
    return (
        <a
            href={app.base_url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-card/80 shadow-lg transition-all duration-300 hover:shadow-2xl hover-lift"
        >
            <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-tertiary/10">
                {app.img_url ? (
                    <>
                        <img
                            src={app.img_url}
                            alt={app.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                    </>
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                )}


            </div>

            {/* Card Content */}
            <div className="p-5">
                {/* App Icon & Title */}
                <div className="mb-4 flex items-start gap-3">
                    {/* App Icon - Always show */}
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary p-3 shadow-md ring-2 ring-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:ring-4">
                        {app.icon_url ? (
                            <img
                                src={app.icon_url}
                                alt={app.name}
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    if (target.nextElementSibling) {
                                        (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                    }
                                }}
                            />
                        ) : null}
                        <div
                            className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary-foreground"
                            style={{ display: app.icon_url ? 'none' : 'flex' }}
                        >
                            {app.name.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary truncate">
                            {app.name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono">{app.code}</p>
                    </div>
                </div>

                {/* Description */}
                {app.description && (
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {app.description}
                    </p>
                )}

                {/* Info Row */}
                <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Klik untuk membuka</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        <span>Tab Baru</span>
                    </div>
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-tertiary/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
        </a>
    );
}
