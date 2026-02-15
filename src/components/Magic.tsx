import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Gift, Phone, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";

const Magic = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [promoCode, setPromoCode] = useState("");
    const [isRedeeming, setIsRedeeming] = useState(false);

    // Plan info from localStorage (set by OneTime)
    const [planName, setPlanName] = useState("");
    const [planPrice, setPlanPrice] = useState("");
    const [planCurrency, setPlanCurrency] = useState("UGX");
    const [planId, setPlanId] = useState("");

    useEffect(() => {
        const savedPhone = localStorage.getItem("sub_phone");
        const savedPlanId = localStorage.getItem("sub_plan_id");
        const savedPlanName = localStorage.getItem("sub_plan_name");
        const savedPlanPrice = localStorage.getItem("sub_plan_price");
        const savedPlanCurrency = localStorage.getItem("sub_plan_currency");

        if (savedPhone) setPhoneNumber(savedPhone);
        if (savedPlanId) setPlanId(savedPlanId);
        if (savedPlanName) setPlanName(savedPlanName);
        if (savedPlanPrice) setPlanPrice(Number(savedPlanPrice).toLocaleString());
        if (savedPlanCurrency) setPlanCurrency(savedPlanCurrency);

        if (!savedPlanId) {
            navigate("/subscribe");
        }
    }, [navigate]);

    const handleRedeemCode = async () => {
        if (!promoCode) {
            toast.error("Please enter a promo/voucher code");
            return;
        }
        if (!phoneNumber) {
            toast.error("Please enter your phone number");
            return;
        }

        setIsRedeeming(true);
        try {
            const res = await apiClient.subscriptions.redeemAccessTokenSubscriptionsRedeemPost({
                code: promoCode.trim(),
                phone_number: phoneNumber.trim(),
            });
            toast.success(res.data.message || "Code redeemed successfully!");
            // Clean up localStorage
            localStorage.removeItem("sub_plan_id");
            localStorage.removeItem("sub_plan_name");
            localStorage.removeItem("sub_plan_price");
            localStorage.removeItem("sub_plan_currency");
            localStorage.removeItem("sub_plan_days");
            localStorage.setItem("pitbox_premium", "true");
            // Go to success
            navigate("/subscribe/wizard", { state: { redeemed: true, subscription: res.data.subscription } });
        } catch (error: any) {
            const message = error.error?.detail?.[0]?.msg || error.error?.detail || "Invalid or expired code";
            toast.error(message);
        } finally {
            setIsRedeeming(false);
        }
    };

    const handleProcessPayment = () => {
        if (!phoneNumber) {
            toast.error("Please enter your phone number");
            return;
        }

        localStorage.setItem("sub_phone", phoneNumber);
        navigate("/subscribe/wizard");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
            <div className="w-full max-w-md space-y-10">
                <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-white -ml-4 rounded-none uppercase text-[10px] font-black "
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="w-3 h-3 mr-2" />
                    Back to Plans
                </Button>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white uppercase ">
                        Activation <span className="text-primary ">Details</span>
                    </h1>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase ">
                        Enter your details to process the {planPrice} {planCurrency} payment
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[10px] text-muted-foreground uppercase font-black  flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            Phone Number
                        </Label>
                        <Input
                            id="phone"
                            placeholder="07XX XXX XXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="bg-transparent border-white/10 rounded-none h-14 font-bold  focus:border-primary transition-all px-0 border-x-0 border-t-0"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="promo" className="text-[10px] text-muted-foreground uppercase font-black  flex items-center gap-2">
                            <Gift className="w-3 h-3" />
                            Voucher / Promo Code
                        </Label>
                        <div className="flex gap-3 items-end">
                            <Input
                                id="promo"
                                placeholder="ENTER CODE"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                className="bg-transparent border-white/10 rounded-none h-14 uppercase font-bold  focus:border-primary transition-all px-0 border-x-0 border-t-0 flex-1"
                            />
                            <Button
                                variant="outline"
                                className="rounded-none h-14 border-primary/30 text-primary hover:bg-primary/10 font-black uppercase text-[10px] px-6"
                                onClick={handleRedeemCode}
                                disabled={isRedeeming || !promoCode}
                            >
                                {isRedeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Redeem"}
                            </Button>
                        </div>
                        <p className="text-[9px] text-muted-foreground/50 uppercase font-bold">
                            Have a voucher code? Redeem it here to skip payment
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-[9px] uppercase">
                            <span className="bg-background px-3 text-muted-foreground/40 font-black tracking-widest">Or pay with mobile money</span>
                        </div>
                    </div>

                    <Button
                        className="w-full h-14 bg-white text-black hover:bg-primary hover:text-black rounded-none font-black uppercase  transition-all group"
                        onClick={handleProcessPayment}
                        disabled={!phoneNumber}
                    >
                        Pay {planPrice} {planCurrency}
                    </Button>

                    {planId && (
                        <div className="flex items-center justify-between border-t border-white/5 pt-6 opacity-40">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black uppercase  text-muted-foreground">Selected Plan</p>
                                <p className="text-[10px] font-black uppercase text-white ">{planName}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-[8px] font-black uppercase  text-muted-foreground">Status</p>
                                <p className="text-[10px] font-black uppercase text-primary   outline-double px-2">Pending</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,_rgba(234,179,8,0.05)_0%,_transparent_50%)]" />
        </div>
    );
};

export default Magic;
