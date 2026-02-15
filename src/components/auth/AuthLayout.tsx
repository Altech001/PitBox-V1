import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
            </div>

            {/* Header/Nav */}
            <div className="relative z-10 p-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/')}
                    className="text-white/60 hover:text-white hover:bg-white/10 gap-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Home
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">{title}</h1>
                        <p className="text-white/40 font-medium uppercase tracking-[0.2em] text-[10px]">
                            {subtitle}
                        </p>
                    </div>

                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                        {children}
                    </div>

                    <p className="mt-8 text-center text-white/40 text-sm">
                        &copy; {new Date().getFullYear()} PitBox. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
