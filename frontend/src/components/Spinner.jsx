/**
 * Spinner — Premium dual-ring with glow
 */

export default function Spinner() {
    return (
        <div className="flex items-center justify-center py-24">
            <div className="relative">
                <div className="w-14 h-14 rounded-full border-[3px] border-gray-800 border-t-primary-500 animate-spin" />
                <div className="absolute inset-0 w-14 h-14 rounded-full border-[3px] border-transparent border-b-accent-400/60 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
                <div className="absolute inset-2 w-10 h-10 rounded-full bg-primary-500/5 animate-pulse" />
            </div>
        </div>
    );
}
