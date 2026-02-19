import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import SEO from '@/components/SEO';
import { requestsApi, MovieRequestResponse } from '@/lib/requests';
import { Loader2, Film, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function RequestsPage() {
    const { data: requests, isLoading, error } = useQuery({
        queryKey: ['movie-requests'],
        queryFn: () => requestsApi.getAllRequests(),
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    return (
        <div className="min-h-screen bg-black text-white">
            <SEO
                title="Movie Requests"
                description="View and track community movie requests on PitBox. Request your favorite movies and follow the latest content additions."
                canonicalPath="/requests"
            />
            <Navbar />

            <main className="max-w-4xl mx-auto pt-32 px-6 pb-24">
                {/* Header */}
                <div className="mb-16 text-center md:text-left">
                    <h1 className="text-xl md:text-2xl font-black mb-4  ">
                        Movie <span className="text-primary text-shadow-glow">Requests</span>
                    </h1>
                    <p className="text-white/40 text-sm max-w-xl">
                        A real-time timeline of content requested by the PitBox community.
                        Latest requests appear at the top.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-xs font-bold   text-white/20">Syncing with server...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 p-8 text-center rounded-md">
                        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                        <p className="text-sm font-bold text-red-400">Failed to load requests</p>
                        <p className="text-xs text-red-400/60 mt-2">Please check your connection or try again later.</p>
                    </div>
                ) : !requests || requests.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/5">
                        <Film className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-sm font-bold text-white/30  ">No requests yet</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-primary/20 -translate-x-1/2" />

                        <div className="space-y-12">
                            {requests.map((request, index) => (
                                <TimelineItem
                                    key={request.id}
                                    request={request}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                .text-shadow-glow {
                    text-shadow: 0 0 20px rgba(var(--primary), 0.5);
                }
                @keyframes slide-in-right {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slide-in-left {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}

function TimelineItem({ request, index }: { request: MovieRequestResponse; index: number }) {
    const isEven = index % 2 === 0;

    return (
        <div className={cn(
            "relative flex flex-col md:flex-row items-center gap-8 group",
            isEven ? "md:flex-row" : "md:flex-row-reverse"
        )}>
            {/* Timeline Dot */}
            <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-black border-2 border-primary rounded-full -translate-x-1/2 z-10" />

            {/* Content Card */}
            <div className={cn(
                "w-full md:w-[45%] pl-12 md:pl-0",
                isEven ? "md:text-right md:animate-slide-in-left" : "md:text-left md:animate-slide-in-right"
            )}>
                <div className="bg-white/[0.03] border-white/5 p-6 hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-500 group-hover:-translate-y-1">
                    <div className={cn(
                        "flex items-center gap-2 mb-3 text-[10px] font-black   text-primary/60",
                        isEven ? "md:justify-end" : "md:justify-start"
                    )}>
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(request.created_at))} ago
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {request.name}
                    </h3>

                    <div className={cn(
                        "flex items-start gap-3 p-3 bg-black/40 border border-white/5 text-sm text-white/60 ",
                        isEven ? "md:flex-row-reverse md:text-right" : "flex-row text-left"
                    )}>
                        <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0 text-white/20" />
                        <p>{request.reason || "No description provided."}</p>
                    </div>

                    <div className={cn(
                        "mt-4 flex flex-wrap gap-2",
                        isEven ? "md:justify-end" : "md:justify-start"
                    )}>
                        <Badge variant="outline" className="rounded-none border-white/10 text-[10px]  font-bold text-white/40">
                            ID: #{request.id}
                        </Badge>
                        <Badge variant="outline" className="rounded border-primary/20 bg-primary/5 text-[10px]  font-bold text-primary">
                            Status: Requested
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Empty space for the other side on MD+ */}
            <div className="hidden md:block w-[45%]" />
        </div>
    );
}
