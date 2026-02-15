import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles, Trophy, ArrowRight, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import type { PackageResponse } from "@/lib/api";

const planIcons: Record<number, JSX.Element> = {};
const getPlanIcon = (index: number, isSelected: boolean) => {
    const iconClass = isSelected ? "text-primary" : "text-white/40";
    if (index === 0) return <Zap className={`w-4 h-4 ${iconClass}`} />;
    if (index === 1) return <Sparkles className={`w-4 h-4 ${iconClass}`} />;
    return <Trophy className={`w-4 h-4 ${iconClass}`} />;
};

const OneTime = () => {
    const navigate = useNavigate();
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    const { data: packages, isLoading } = useQuery({
        queryKey: ["subscription-packages"],
        queryFn: async () => {
            const res = await apiClient.subscriptions.listPackagesSubscriptionsPackagesGet();
            return res.data as PackageResponse[];
        },
    });

    // Auto-select the second plan (most popular) or the first one
    const activePackages = packages?.filter((p) => p.is_active) || [];
    if (activePackages.length > 0 && !selectedPlanId) {
        const defaultPlan = activePackages.length > 1 ? activePackages[1] : activePackages[0];
        // We set this lazily in render — it's fine for initial selection
        setTimeout(() => setSelectedPlanId(defaultPlan.id), 0);
    }

    const handleNext = () => {
        if (selectedPlanId) {
            localStorage.setItem("sub_plan_id", selectedPlanId);
            const selectedPkg = activePackages.find((p) => p.id === selectedPlanId);
            if (selectedPkg) {
                localStorage.setItem("sub_plan_name", selectedPkg.name);
                localStorage.setItem("sub_plan_price", String(selectedPkg.price));
                localStorage.setItem("sub_plan_currency", selectedPkg.currency);
                localStorage.setItem("sub_plan_days", String(selectedPkg.duration_days));
            }
            navigate("/subscribe/magic");
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 md:p-12 animate-in fade-in duration-1000">
            <div className="w-full max-w-4xl space-y-12">
                <div className="text-center space-y-3">
                    <h1 className="text-3xl md:text-4xl font-bold  text-white uppercase">
                        Select Your <span className="text-primary ">Plan</span>
                    </h1>
                    <p className="text-muted-foreground text-xs font-medium  uppercase">
                        Choose a plan to continue watching
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : activePackages.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-sm">No plans available at this time.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {activePackages.map((pkg, index) => {
                            const isSelected = selectedPlanId === pkg.id;
                            const isPopular = index === 1 && activePackages.length > 1;

                            return (
                                <div
                                    key={pkg.id}
                                    onClick={() => setSelectedPlanId(pkg.id)}
                                    className={`relative cursor-pointer transition-all duration-500 rounded-[1px] border border-white/5 ${isSelected
                                        ? "bg-white/5 border-primary py-8 -translate-y-2"
                                        : "hover:bg-white/[0.02] py-6 border-primary opacity-40 hover:opacity-100"
                                        }`}
                                >
                                    {isPopular && (
                                        <div className="absolute -top-3 left-6 px-2 py-0.5 bg-primary text-black text-[9px] font-black uppercase">
                                            Popular
                                        </div>
                                    )}

                                    <div className="px-6 space-y-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                {getPlanIcon(index, isSelected)}
                                                <h3 className="text-xs font-black uppercase  text-white/90">{pkg.name}</h3>
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-white">{pkg.price.toLocaleString()}</span>
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase">{pkg.currency}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-[10px] text-white/50 font-medium">
                                                <div className={`w-1 h-1 rounded-full ${isSelected ? "bg-primary" : "bg-white/20"}`} />
                                                {pkg.duration_days} Days Validity
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-white/50 font-medium">
                                                <div className={`w-1 h-1 rounded-full ${isSelected ? "bg-primary" : "bg-white/20"}`} />
                                                All Premium Content
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-white/50 font-medium">
                                                <div className={`w-1 h-1 rounded-full ${isSelected ? "bg-primary" : "bg-white/20"}`} />
                                                HD Streaming
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <p className="text-[9px] text-muted-foreground uppercase font-black  leading-tight">
                                                {pkg.description || `${pkg.duration_days}-day access plan`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex flex-col items-center gap-6">
                    <Button
                        className="w-full max-w-sm h-14 bg-white text-black hover:bg-primary hover:text-black rounded-none font-black uppercase  transition-all duration-300 group"
                        onClick={handleNext}
                        disabled={!selectedPlanId || isLoading}
                    >
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <p className="text-[10px] text-muted-foreground font-bold  text-center opacity-40">
                        Secure payment powered by mobile money
                    </p>
                </div>
            </div>

            {/* Background decoration - very minimal */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,_rgba(234,179,8,0.03)_0%,_transparent_50%)]" />
        </div>
    );
};

export default OneTime;
