type Props = {
    name: string; // file name inside public/assets, e.g. "play_icon.svg"
    size?: number;
    className?: string;
};

export function AssetIcon({ name, size = 16, className }: Props) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={`/assets/${name}`}
            width={size}
            height={size}
            alt=""
            aria-hidden="true"
            className={className}
        />
    );
}