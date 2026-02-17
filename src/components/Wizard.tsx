import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, Smartphone, Timer, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { paymentApi } from "@/lib/payment";
import { storage } from "@/lib/storage";

const Wizard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState<"processing" | "confirming" | "success" | "error">("processing");
    const [progress, setProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const hasSubscribed = useRef(false);

    // If we came from a voucher redemption, skip straight to success
    const redeemed = location.state?.redeemed;

    // Plan info from storage/localStorage
    const planId = storage.get<string>("sub_plan_id") || "";
    const planName = storage.get<string>("sub_plan_name") || "";
    const planPrice = storage.get<string>("sub_plan_price") || "";
    const planCurrency = storage.get<string>("sub_plan_currency") || "UGX";
    const planDays = storage.get<string>("sub_plan_days") || "";
    const phoneNumber = storage.get<string>("sub_phone") || "";

    // Payment-first flow: Only subscribe AFTER payment is confirmed
    useEffect(() => {
        if (redeemed) {
            setProgress(100);
            setStatus("success");
            return;
        }

        if (hasSubscribed.current) return;
        if (!planId || !phoneNumber) {
            navigate("/subscribe");
            return;
        }

        hasSubscribed.current = true;

        const doPaymentFirst = async () => {
            try {
                // Generate a proper UUID v4 reference for the payment
                const tempReference = crypto.randomUUID();

                // 1. Initialize payment via MintosPay FIRST (no subscription created yet)
                const payRes = await paymentApi.initialize({
                    amount: Number(planPrice),
                    phone_number: phoneNumber,
                    reference: tempReference,
                    country: "UG",
                    description: `PitBox ${planName} Subscription`,
                    callback_url: "https://mintos-vd.vercel.app/api/payments/webhook",
                });

                const uuid = payRes.data.transaction.uuid;

                // 2. Update UI to confirming (waiting for user PIN)
                setStatus("confirming");
                toast.info("Collection initiated. Check your phone!");

                // 3. Poll for actual payment status
                const pollInterval = setInterval(async () => {
                    try {
                        const verifyRes = await paymentApi.verify(uuid);
                        const trxStatus = verifyRes.data.transaction.status;

                        if (trxStatus === 'success' || trxStatus === 'completed') {
                            clearInterval(pollInterval);

                            // 4. Payment confirmed! NOW create the subscription
                            try {
                                await apiClient.subscriptions.subscribeSubscriptionsSubscribePost({
                                    package_id: planId,
                                    phone_number: phoneNumber,
                                });

                                setProgress(100);
                                setTimeout(() => {
                                    setStatus("success");
                                    toast.success("Subscription activated!");
                                    storage.clearSubscriptionData();
                                    storage.set("pitbox_premium", "true");
                                }, 800);
                            } catch (subError: any) {
                                console.error("Subscription creation error after payment:", subError);
                                const subMessage = subError.error?.detail?.[0]?.msg ||
                                    subError.error?.detail ||
                                    "Payment was successful but subscription activation failed. Please contact support.";
                                setErrorMessage(subMessage);
                                setStatus("error");
                                toast.error(subMessage);
                            }
                        } else if (trxStatus === 'failed') {
                            clearInterval(pollInterval);
                            // Payment failed — NO subscription is created
                            setErrorMessage("Payment failed. Please try again or ensure you have sufficient balance.");
                            setStatus("error");
                            toast.error("Payment failed");
                        }
                        // If 'processing', continue polling
                    } catch (pollError) {
                        console.error("Polling error:", pollError);
                        // We continue polling despite temporary network errors
                    }
                }, 5000); // Poll every 5 seconds

                // Timeout: Stop polling after 3 minutes
                setTimeout(() => {
                    clearInterval(pollInterval);
                    // If still not resolved after timeout, show error
                    setStatus((currentStatus) => {
                        if (currentStatus !== "success" && currentStatus !== "error") {
                            setErrorMessage("Payment timed out. If you were charged, please contact support.");
                            toast.error("Payment timed out");
                            return "error";
                        }
                        return currentStatus;
                    });
                }, 180000);

            } catch (error: any) {
                console.error("Payment Initialization Error:", error);
                const message = error.message || "Failed to initialize payment. Please try again.";
                setErrorMessage(message);
                setStatus("error");
                toast.error(message);
            }
        };

        doPaymentFirst();
    }, [redeemed, planId, phoneNumber, planPrice, planName, navigate]);

    // Progress animation  
    useEffect(() => {
        if (redeemed || status === "error") return;
        if (progress >= 100) return;

        const timer = setInterval(() => {
            setProgress((old) => {
                // Cap at 90 until we get API response, then jump to 100
                const cap = status === "confirming" ? 95 : 85;
                if (old >= cap) {
                    clearInterval(timer);
                    return old;
                }
                const diff = Math.random() * 6;
                return Math.min(old + diff, cap);
            });
        }, 400);

        return () => clearInterval(timer);
    }, [status, redeemed]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
            <div className="w-full max-w-md space-y-12 text-center">
                {status === "error" ? (
                    <div className="space-y-10 animate-in fade-in duration-500">
                        <div className="space-y-2">
                            <div className="inline-block p-4 border-2 rounded-full border-destructive mb-4">
                                <AlertCircle className="w-10 h-10 text-destructive" />
                            </div>
                            <h1 className="text-3xl font-black text-white uppercase">
                                Payment <span className="text-destructive">Failed</span>
                            </h1>
                            <p className="text-muted-foreground text-[10px] font-black uppercase">
                                {errorMessage}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button
                                className="w-full h-14 bg-white text-black hover:bg-primary hover:text-black rounded-none font-black uppercase transition-all"
                                onClick={() => {
                                    hasSubscribed.current = false;
                                    navigate("/subscribe/magic");
                                }}
                            >
                                Try Again
                            </Button>
                            <Button
                                variant="ghost"
                                className="rounded-none uppercase text-[10px] font-black text-muted-foreground"
                                onClick={() => navigate("/subscribe")}
                            >
                                Change Plan
                            </Button>
                        </div>
                    </div>
                ) : status !== "success" ? (
                    <>
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-black text-white uppercase ">
                                    {status === "processing" ? "Processing" : "Final Step"}
                                </h1>
                                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
                                    {status === "processing" ? "Connecting to payment gateway..." : "Enter your PIN on your phone"}
                                </p>
                            </div>

                            <div className="relative h-1 w-full bg-white/5 overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 text-left">
                                <div className="p-6 border border-white/5 bg-white/[0.02] space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="w-4 h-4 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Push Sent</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold leading-relaxed">
                                        A Mobile Money prompt has been sent to {phoneNumber || "your device"}. Please confirm the transaction.
                                    </p>
                                </div>

                                <div className="p-6 border border-white/5 bg-white/[0.02] space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Timer className="w-4 h-4 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Time Limit</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold leading-relaxed">
                                        The request will expire in 2 minutes. Do not refresh this page.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 opacity-20">
                                <ShieldCheck className="w-4 h-4 text-white" />
                                <span className="text-[8px] font-black uppercase ">Encrypted Transaction</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="space-y-10 animate-in zoom-in-95 duration-700">
                        <div className="space-y-2">
                            <div className="inline-block p-4 border-2 rounded-full border-primary mb-4">
                                <CheckCircle2 className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl font-black text-white uppercase  ">
                                Access <span className="text-primary ">Granted</span>
                            </h1>
                            <p className="text-muted-foreground text-[10px] font-black uppercase ">
                                Subscription Activated Successfully
                            </p>
                        </div>

                        <div className="p-8 border border-primary/20 bg-primary/5 space-y-6 rounded-sm">
                            <div className="flex justify-between items-center text-left border-b border-primary/10 pb-6">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase text-muted-foreground ">Plan</p>
                                    <p className="text-[10px] font-black uppercase text-white tracking-widest">{planName || "Premium"}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[8px] font-black uppercase text-muted-foreground ">Validity</p>
                                    <p className="text-[10px] font-black uppercase text-primary tracking-widest  outline-double px-2">
                                        {planDays ? `${planDays} Days` : "Premium"}
                                    </p>
                                </div>
                            </div>

                            <Button
                                className="w-full h-14 bg-white text-black hover:bg-primary hover:text-black rounded-none font-black uppercase tracking-[0.2em] transition-all"
                                onClick={() => {
                                    navigate("/");
                                }}
                            >
                                WATCH PitBox MOVIES
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_100%,_rgba(234,179,8,0.03)_0%,_transparent_50%)]" />
        </div>
    );
};

export default Wizard;
