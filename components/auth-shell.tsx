export function AuthShell({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#E6FFFF] to-white p-4">
            {children}
        </main>
    );
}