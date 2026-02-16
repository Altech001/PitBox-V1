import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tmdb, IMG_BASE } from '@/lib/tmdb';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const FALLBACK_POSTERS = [
    "https://image.tmdb.org/t/p/w500/8W97O9S9YI6R7R8R6e4X6r8r6e4.jpg",
    "https://image.tmdb.org/t/p/w500/kuf6evRbcS3UO3ghoVv9p9Iub7q.jpg",
    "https://image.tmdb.org/t/p/w500/ggm8ihBbiuBhvgyKGq8srSWhS30.jpg",
    "https://image.tmdb.org/t/p/w500/ui4DrH1cKk2vkH6CdbmsecOKtS3.jpg",
];

const MasonryColumn = ({ images, speed, reverse = false }: { images: string[], speed: number, reverse?: boolean }) => {
    if (!images.length) return null;

    return (
        <div className="flex flex-col gap-4 animate-scroll shrink-0" style={{
            animationDuration: `${speed}s`,
            animationDirection: reverse ? 'reverse' : 'normal'
        } as React.CSSProperties}>
            {[...images, ...images, ...images].map((src, i) => (
                <div key={i} className="w-full aspect-[2/3] rounded overflow-hidden border border-white/5 bg-white/[0.01]">
                    <img
                        src={src.startsWith('http') ? src : `${IMG_BASE}/w500${src}`}
                        alt="Poster"
                        className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-500"
                        loading="lazy"
                    />
                </div>
            ))}
        </div>
    );
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLogin = location.pathname === '/login';
    const isSignUp = location.pathname === '/signup';
    const [posters, setPosters] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosters = async () => {
            try {
                const response = await tmdb.popularMovies(1);
                const paths = response.results
                    .filter(m => m.poster_path)
                    .map(m => m.poster_path as string);
                setPosters(paths.length >= 10 ? paths : FALLBACK_POSTERS);
            } catch (error) {
                console.error('Failed to fetch TMDB posters:', error);
                setPosters(FALLBACK_POSTERS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosters();
    }, []);

    const getColumnImages = (index: number) => {
        if (!posters.length) return [];
        const itemsPerCol = Math.ceil(posters.length / 5);
        return posters.slice(index * itemsPerCol, (index + 1) * itemsPerCol);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
            {/* Masonry Background */}
            <div className="absolute inset-0 z-0 opacity-40">
                {!isLoading && posters.length > 0 ? (
                    <div className="flex gap-4 h-[280%] -rotate-12 scale-125 -translate-y-[10%] -translate-x-[5%] pointer-events-none">
                        <MasonryColumn images={getColumnImages(0)} speed={40} />
                        <MasonryColumn images={getColumnImages(1)} speed={60} reverse />
                        <MasonryColumn images={getColumnImages(2)} speed={50} />
                        <MasonryColumn images={getColumnImages(3)} speed={70} reverse />
                        <MasonryColumn images={getColumnImages(4)} speed={45} />
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-primary animate-spin opacity-20" />
                    </div>
                )}
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
                <div className="absolute inset-0 backdrop-blur-[1px]" />
            </div>

            {/* Header/Nav */}
            <div className="relative z-10 p-6 md:p-10 flex justify-between items-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/')}
                    className="text-white/60 hover:text-white hover:bg-white/10 gap-2 transition-all group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Button>

                <div className="font-bold text-white ">
                    PIT<span className="text-primary">BOX</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center relative z-10">
                <div className="w-full max-w-[440px] animate-fade-in">
                    <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-none m-2 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                        {/* Tabs */}
                        <div className="flex border-b border-white/5 bg-white/[0.02]">
                            <Link
                                to="/login"
                                className={cn(
                                    "flex-1 py-5 text-center text-xs font-bold uppercase  transition-all relative overflow-hidden",
                                    isLogin ? "text-white" : "text-white/30 hover:text-white/50"
                                )}
                            >
                                Sign In
                                {isLogin && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                )}
                            </Link>
                            <Link
                                to="/signup"
                                className={cn(
                                    "flex-1 py-5 text-center text-xs font-bold uppercase  transition-all relative overflow-hidden",
                                    isSignUp ? "text-white" : "text-white/30 hover:text-white/50"
                                )}
                            >
                                Sign Up
                                {isSignUp && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                )}
                            </Link>
                        </div>

                        <div className="p-8 md:p-10">
                            {children}
                        </div>
                    </div>

                    <p className="mt-10 text-center text-white/30 text-[10px]">
                        &copy; {new Date().getFullYear()} PitBox
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes scroll {
                    from { transform: translateY(0); }
                    to { transform: translateY(-33.33%); }
                }
                .animate-scroll {
                    animation: scroll linear infinite;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default AuthLayout;


