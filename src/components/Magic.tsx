import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Gift, Phone, Loader2, Ticket } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { storage } from "@/lib/storage";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

/**
 * Normalizes a Ugandan phone number to the +256 international format.
 * Handles inputs like: "0712345678", "256712345678", "+256712345678",
 * "0712 345 678", "+256 712 345 678", "712345678", etc.
 */
const formatPhoneNumber = (raw: string): string => {
    // Strip all non-digit characters except the leading +
    const stripped = raw.replace(/\s+/g, "").replace(/-/g, "");

    // Already in +256 format
    if (stripped.startsWith("+256")) {
        return stripped;
    }
    // Starts with 256 (no +)
    if (stripped.startsWith("256") && stripped.length >= 12) {
        return `+${stripped}`;
    }
    // Starts with 0 (local format)
    if (stripped.startsWith("0") && stripped.length >= 10) {
        return `+256${stripped.slice(1)}`;
    }
    // Starts with 7 (no prefix)
    if (stripped.startsWith("7") && stripped.length >= 9) {
        return `+256${stripped}`;
    }
    // Return as-is if we can't determine format — API will validate
    return stripped;
};

const Magic = () => {
    const navigate = useNavigate();

    // Best Practice: Initialize state from storage to avoid layout shift/flash
    const [phoneNumber, setPhoneNumber] = useState(() => storage.get<string>("sub_phone") || "");
    const [promoCode, setPromoCode] = useState("");
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [showRedeemDialog, setShowRedeemDialog] = useState(false);

    // Plan info state (Initialized from storage)
    const [planName] = useState(() => storage.get<string>("sub_plan_name") || "");
    const [planPrice] = useState(() => {
        const price = storage.get<string>("sub_plan_price");
        return price ? Number(price).toLocaleString() : "";
    });
    const [planCurrency] = useState(() => storage.get<string>("sub_plan_currency") || "UGX");
    const [planId] = useState(() => storage.get<string>("sub_plan_id") || "");

    // Logic Check: Redirect only if critical data is missing
    useEffect(() => {
        if (!planId) {
            navigate("/subscribe");
        }
    }, [planId, navigate]);

    const handleRedeemCode = async () => {
        if (!promoCode) {
            toast.error("Please enter a promo/voucher code");
            return;
        }
        if (!phoneNumber) {
            toast.error("Please enter your phone number");
            return;
        }

        const formattedPhone = formatPhoneNumber(phoneNumber);

        setIsRedeeming(true);
        try {
            const res = await apiClient.subscriptions.redeemAccessTokenSubscriptionsRedeemPost({
                code: promoCode.trim(),
                phone_number: formattedPhone,
            });

            toast.success(res.data.message || "Code redeemed successfully!");

            // Centralized cleanup
            storage.clearSubscriptionData();
            storage.set("pitbox_premium", "true");

            setShowRedeemDialog(false);

            navigate("/subscribe/wizard", {
                state: {
                    redeemed: true,
                    subscription: res.data.subscription
                }
            });
        } catch (error: any) {
            const message = error.error?.detail?.[0]?.msg ||
                error.error?.detail ||
                "Invalid or expired code";
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
        // Save the formatted phone number for consistent API usage
        const formattedPhone = formatPhoneNumber(phoneNumber);
        storage.set("sub_phone", formattedPhone);
        navigate("/subscribe/wizard");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
            <div className="w-full max-w-md space-y-10">
                <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-white -ml-4 rounded-none uppercase text-[10px] font-black"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="w-3 h-3 mr-2" />
                    Back to Plans
                </Button>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                        Activation <span className="text-primary">Details</span>
                    </h1>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                        Enter details to process the {planPrice} {planCurrency} payment
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Phone Input */}
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[10px] text-muted-foreground uppercase font-black flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            Phone Number
                        </Label>
                        <Input
                            id="phone"
                            placeholder="+256 7XX XXX XXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="bg-transparent border-white/10 rounded-none h-14 font-bold focus:border-primary transition-all px-0 border-x-0 border-t-0"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <Button
                        className="w-full h-14 bg-white text-black hover:bg-primary hover:text-black rounded-none font-black uppercase transition-all group"
                        onClick={handleProcessPayment}
                        disabled={!phoneNumber}
                    >
                        Pay {planPrice} {planCurrency}
                    </Button>

                    {/* Redeem Code Button */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-[9px] uppercase">
                            <span className="bg-background px-3 text-muted-foreground/40 font-black tracking-widest">Or</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowRedeemDialog(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/10 hover:border-primary/40 text-muted-foreground hover:text-primary transition-all group"
                    >
                        <Ticket className="w-4 h-4 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest">I have a redeem code</span>
                    </button>

                    {planId && (
                        <div className="flex items-center justify-between border-t border-white/5 pt-6 opacity-40">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black uppercase text-muted-foreground">Selected Plan</p>
                                <p className="text-[10px] font-black uppercase text-white">{planName}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-[8px] font-black uppercase text-muted-foreground">Status</p>
                                <p className="text-[10px] font-black uppercase text-primary outline-double px-2">Pending</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Redeem Code Dialog */}
            <div className="m-2 px-2">
                <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
                    <DialogContent className="sm:max-w-md border-white/10 bg-background ">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                                <Gift className="w-5 h-5 text-primary" />
                                Redeem <span className="text-primary">Code</span>
                            </DialogTitle>
                            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Enter your voucher or promo code to activate your subscription
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-5 pt-2">
                            {/* Phone in dialog (pre-filled from main form) */}
                            <div className="space-y-2">
                                <Label htmlFor="redeem-phone" className="text-[10px] text-muted-foreground uppercase font-black flex items-center gap-2">
                                    <Phone className="w-3 h-3" />
                                    Phone Number
                                </Label>
                                <Input
                                    id="redeem-phone"
                                    placeholder="+256 7XX XXX XXX"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="bg-transparent border-white/10 rounded-none h-12 font-bold focus:border-primary transition-all px-0 border-x-0 border-t-0"
                                />
                            </div>

                            {/* Code Input */}
                            <div className="space-y-2">
                                <Label htmlFor="redeem-code" className="text-[10px] text-muted-foreground uppercase font-black flex items-center gap-2">
                                    <Ticket className="w-3 h-3" />
                                    Voucher / Promo Code
                                </Label>
                                <Input
                                    id="redeem-code"
                                    placeholder="ENTER CODE"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    className="bg-transparent border-white/10 rounded-none h-12 uppercase font-bold tracking-widest focus:border-primary transition-all px-0 border-x-0 border-t-0 text-lg"
                                    autoFocus
                                />
                            </div>

                            <Button
                                className="w-full h-12 bg-primary text-black hover:bg-primary/90 rounded-none font-black uppercase text-xs tracking-widest transition-all"
                                onClick={handleRedeemCode}
                                disabled={isRedeeming || !promoCode}
                            >
                                {isRedeeming ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Redeeming...
                                    </span>
                                ) : (
                                    "Redeem Code"
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,_rgba(234,179,8,0.05)_0%,_transparent_50%)]" />
        </div>
    );
};

export default Magic;