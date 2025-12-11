export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t bg-card/50 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="text-center md:text-left">
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} <span className="font-semibold text-foreground">PT. Arga Bumi Indonesia</span>. All rights reserved.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <a
                            href="/privacy-policy"
                            className="transition-colors hover:text-foreground"
                        >
                            Kebijakan Privasi
                        </a>
                        <span className="text-border">|</span>
                        <a
                            href="https://argabumi.id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-foreground"
                        >
                            Website
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
