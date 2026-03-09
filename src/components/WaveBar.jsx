export default function WaveBar({ duration, height, large }) {
    const cls = large ? 'wave-bar-lg' : 'wave-bar';
    return <div className={cls} style={{ '--d': duration, '--h': height }} />;
}
