export default function WaveBar({ duration, height, large }) {
    const style = { '--d': duration || '1s', '--h': height || '32px' };
    return <div className={large ? 'wave-bar-lg' : 'wave-bar'} style={style}></div>;
}
