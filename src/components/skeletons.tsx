import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton for the hero carousel area
 */
export function HeroSkeleton() {
    return (
        <div className="relative h-[40vh] min-h-[350px] mb-12 overflow-hidden bg-muted/30">
            <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-8 md:p-12 max-w-2xl">
                <Skeleton className="h-10 w-80 mb-3 rounded-none" />
                <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full max-w-md mb-2 rounded-none" />
                <Skeleton className="h-4 w-72 mb-6 rounded-none" />
                <div className="flex gap-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-12 w-32 rounded-none" />
                </div>
            </div>
        </div>
    );
}

/**
 * Skeleton for a single media card
 */
export function MediaCardSkeleton({ size = 'md' }: { size?: 'sm' | 'md' }) {
    const w = size === 'sm' ? 'w-28 md:w-36' : 'w-32 md:w-44';
    return (
        <div className={`${w} shrink-0`}>
            <Skeleton className="aspect-[2/3] rounded-none mb-2" />
            <div className="flex items-center gap-2 mt-0.5">
                <Skeleton className="h-3 w-10 rounded-none" />
                <Skeleton className="h-3 w-8 rounded-none" />
            </div>
        </div>
    );
}

/**
 * Skeleton for a media row (title + scrolling cards)
 */
export function MediaRowSkeleton({ count = 8 }: { count?: number }) {
    return (
        <section className="mb-6 md:mb-10 -mx-4 md:mx-0">
            <div className="px-4 md:px-1 mb-3 md:mb-4">
                <Skeleton className="h-4 w-40 rounded-none" />
            </div>
            <div className="flex gap-2.5 md:gap-4 overflow-hidden px-4 md:px-1">
                {Array.from({ length: count }).map((_, i) => (
                    <MediaCardSkeleton key={i} />
                ))}
            </div>
        </section>
    );
}

/**
 * Skeleton for a grid of media cards
 */
export function MediaGridSkeleton({ count = 21 }: { count?: number }) {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 md:gap-8 gap-2">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i}>
                    <Skeleton className="aspect-[2/3] rounded-none mb-2" />
                    <div className="flex items-center gap-2 mt-0.5">
                        <Skeleton className="h-3 w-10 rounded-none" />
                        <Skeleton className="h-3 w-8 rounded-none" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Skeleton for the movie detail page
 */
export function MovieDetailSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto px-6 pt-8">
                <Skeleton className="h-5 w-16 mb-6 rounded-none" />
                <Skeleton className="w-full aspect-video rounded-none mb-8" />
                <Skeleton className="h-8 w-72 mb-4 rounded-none" />
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-6 w-14 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex gap-2 mb-6">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-2 max-w-2xl">
                    <Skeleton className="h-4 w-full rounded-none" />
                    <Skeleton className="h-4 w-full rounded-none" />
                    <Skeleton className="h-4 w-3/4 rounded-none" />
                </div>
            </div>
        </div>
    );
}

/**
 * Skeleton for discover grid cards (smaller)
 */
export function DiscoverGridSkeleton({ count = 18 }: { count?: number }) {
    return (
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="p-0.1">
                    <Skeleton className="aspect-[2/3] rounded-none mb-2" />
                    <div className="flex items-center gap-2 mt-0.5">
                        <Skeleton className="h-2.5 w-8 rounded-none" />
                        <Skeleton className="h-2.5 w-6 rounded-none" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Full page skeleton for the home/index page
 */
export function IndexPageSkeleton() {
    return (
        <>
            <HeroSkeleton />
            <MediaRowSkeleton />
            <MediaRowSkeleton count={6} />
            <MediaRowSkeleton />
            <MediaRowSkeleton count={7} />
        </>
    );
}
