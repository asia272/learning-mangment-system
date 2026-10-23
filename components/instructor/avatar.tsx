export function Avatar({ name, src }: { name: string; src?: string | null }) {
    if (src) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={name} className="h-11 w-11 rounded-full object-cover" />;
    }
    return (
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 font-medium text-gray-600">
            {name.charAt(0).toUpperCase()}
        </span>
    );
}