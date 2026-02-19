import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, CreditCard, User as UserIcon, Lock, Loader2, AlertCircle, ShieldCheck, ShieldOff, ArrowUpRight, Film } from "lucide-react";
import { useAuthStore } from '@/hooks/use-auth-store'; //
import { apiClient } from '@/lib/api';
import type { LoginSessionResponse, SubscriptionStatusResponse, TransactionResponse } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { requestsApi } from '@/lib/requests';
import SEO from '@/components/SEO';

export default function Account() {
    const { user } = useAuthStore(); // Read from Store
    const navigate = useNavigate();

    // --- Change Password ---
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }
        setChangingPassword(true);
        try {
            await apiClient.auth.changePasswordAuthChangePasswordPut({
                old_password: oldPassword,
                new_password: newPassword,
            });
            toast.success('Password updated successfully');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            const message = error.error?.detail?.[0]?.msg || error.error?.detail || 'Failed to update password';
            toast.error(message);
        } finally {
            setChangingPassword(false);
        }
    };

    // --- Login Sessions ---
    const { data: sessions, isLoading: sessionsLoading } = useQuery({
        queryKey: ['login-sessions'],
        queryFn: async () => {
            const res = await apiClient.auth.getLoginSessionsAuthSessionsGet();
            return res.data as LoginSessionResponse[];
        },
    });

    // --- Subscription Status ---
    const { data: subStatus, isLoading: subLoading } = useQuery({
        queryKey: ['subscription-status'],
        queryFn: async () => {
            const res = await apiClient.subscriptions.subscriptionStatusSubscriptionsStatusGet();
            return res.data as SubscriptionStatusResponse;
        },
    });

    // --- Transactions ---
    const { data: transactions, isLoading: txLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const res = await apiClient.subscriptions.getTransactionsSubscriptionsTransactionsGet();
            return res.data as TransactionResponse[];
        },
    });

    // --- Movie Requests ---
    const [movieName, setMovieName] = useState('');
    const [movieReason, setMovieReason] = useState('');
    const [requestingMovie, setRequestingMovie] = useState(false);

    const handleMovieRequest = async () => {
        if (!movieName.trim()) {
            toast.error("Please enter a movie name");
            return;
        }
        setRequestingMovie(true);
        try {
            await requestsApi.requestMovie({
                name: movieName,
                reason: movieReason || 'Requested via PitBox dashboard',
            });
            toast.success(`Request for "${movieName}" sent successfully!`);
            setMovieName('');
            setMovieReason('');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send movie request');
        } finally {
            setRequestingMovie(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title="My Account"
                description="Manage your PitBox account, subscription, security settings, and request movies."
                canonicalPath="/account"
                noindex={true}
            />
            <Navbar />
            <main className="max-w-6xl mx-auto pt-24 md:pt-32 px-4 md:px-6 pb-20">

                <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-8 items-start rounded-none">
                    {/* PC Sidebar (Fixed width) | Mobile Tabbar (Full width scroll) */}
                    <TabsList className="flex flex-row md:flex-col h-auto bg-background md:bg-transparent p-0 px-4 md:px-0 gap-1 w-full md:w-64 md:shrink-0 items-start sticky top-[64px] md:top-32 overflow-x-auto scrollbar-hide z-30 py-2 md:py-0 border-b md:border-none border-white/5 rounded-none">
                        <TabsTrigger
                            value="profile"
                            className="flex-shrink-0 md:w-full justify-start gap-3 px-6 md:px-4 py-4 rounded-none border-b-2 md:border-b-0 md:data-[state=active]:border-r-2 data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all text-muted-foreground bg-transparent shadow-none font-bold whitespace-nowrap"
                        >
                            <UserIcon className="w-5 h-5" />
                            My Profile
                        </TabsTrigger>
                        <TabsTrigger
                            value="password"
                            className="flex-shrink-0 md:w-full justify-start gap-3 px-4 py-4 rounded-none border-b-2 md:border-b-0 md:data-[state=active]:border-r-2 data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all text-muted-foreground bg-transparent shadow-none font-bold whitespace-nowrap"
                        >
                            <Lock className="w-5 h-5" />
                            Change Password
                        </TabsTrigger>
                        <TabsTrigger
                            value="logs"
                            className="flex-shrink-0 md:w-full justify-start gap-3 px-4 py-4 rounded-none border-b-2 md:border-b-0 md:data-[state=active]:border-r-2 data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all text-muted-foreground bg-transparent shadow-none font-bold whitespace-nowrap"
                        >
                            <History className="w-5 h-5" />
                            Security Logs
                        </TabsTrigger>
                        <TabsTrigger
                            value="subscription"
                            className="flex-shrink-0 md:w-full justify-start gap-3 px-4 py-4 rounded-none border-b-2 md:border-b-0 md:data-[state=active]:border-r-2 data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all text-muted-foreground bg-transparent shadow-none font-bold whitespace-nowrap"
                        >
                            <CreditCard className="w-5 h-5" />
                            Subscription
                        </TabsTrigger>
                        <TabsTrigger
                            value="requests"
                            className="flex-shrink-0 md:w-full justify-start gap-3 px-4 py-4 rounded-none border-b-2 md:border-b-0 md:data-[state=active]:border-r-2 data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all text-muted-foreground bg-transparent shadow-none font-bold whitespace-nowrap"
                        >
                            <Film className="w-5 h-5" />
                            Request Movies
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 w-full min-w-0">
                        {/* ─────────────── PROFILE TAB ─────────────── */}
                        <TabsContent value="profile" className="mt-0 outline-none">
                            <div className="bg-secondary/20 rounded-none p-6 md:p-12">
                                <h3 className="text-sm font-bold mb-10">Personal Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
                                    <InfoItem label="Username" value={user?.username || '—'} />
                                    <InfoItem label="Email Address" value={user?.email || '—'} />
                                    <InfoItem label="A/C ID" value={user?.id ? user.id.substring(0, 8).toUpperCase() : '—'} />
                                    <InfoItem
                                        label="Subscription Status"
                                        value={user?.subscribed ? 'Premium' : 'Free'}
                                        badge={user?.subscribed ? 'Active' : undefined}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* ─────────────── PASSWORD TAB ─────────────── */}
                        <TabsContent value="password" className="mt-0 outline-none">
                            <div className="bg-secondary/20 rounded-none p-6 md:p-12 max-w-2xl">
                                <h3 className="text-sm font-bold mb-8">Change Password</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold  text-muted-foreground">Current Password</label>
                                        <Input
                                            type="password"
                                            placeholder="********"
                                            className="bg-background/50 rounded-none"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            disabled={changingPassword}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold   text-muted-foreground">New Password</label>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                className="bg-background/50 rounded-none"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                disabled={changingPassword}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold   text-muted-foreground">Confirm New Password</label>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                className="bg-background/50 rounded-none"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                disabled={changingPassword}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        className="rounded-none bg-primary text-primary-foreground font-semibold hover:bg-primary/90 px-8 py-6 mt-4"
                                        onClick={handleChangePassword}
                                        disabled={changingPassword || !oldPassword || !newPassword || !confirmPassword}
                                    >
                                        {changingPassword ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Password'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        {/* ─────────────── SECURITY LOGS TAB ─────────────── */}
                        <TabsContent value="logs" className="mt-0 outline-none">
                            <div className="bg-secondary/20 rounded-none p-6 md:p-12 overflow-x-auto">
                                <h3 className="text-sm font-bold mb-8">Recent Device Logs</h3>

                                {sessionsLoading ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    </div>
                                ) : !sessions || sessions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                                        <AlertCircle className="w-6 h-6" />
                                        <p className="text-sm">No login sessions found</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader className="border-b ">
                                            <TableRow className="hover:bg-transparent border-white/5">
                                                <TableHead className="text-xs font-bold uppercase ">Device / Browser</TableHead>
                                                <TableHead className="text-xs font-bold uppercase ">IP Address</TableHead>
                                                <TableHead className="text-xs font-bold uppercase ">OS</TableHead>
                                                <TableHead className="text-xs font-bold uppercase  text-right">Time</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sessions.map((session, index) => (
                                                <TableRow key={session.id} className="border-white/5 hover:bg-white/5">
                                                    <TableCell className="font-medium align-middle py-4">
                                                        <div className="flex items-center gap-3">
                                                            {session.browser || session.device || 'Unknown'}
                                                            {index === 0 && (
                                                                <Badge variant="default" className="bg-primary text-[10px] h-5 rounded-none font-bold uppercase">Latest</Badge>
                                                            )}
                                                            {session.is_active && index !== 0 && (
                                                                <Badge variant="outline" className="text-[10px] h-5 rounded-none font-bold uppercase border-green-500/30 text-green-400">Active</Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground align-middle font-mono text-xs">
                                                        {session.ip_address || '—'}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground align-middle text-xs">
                                                        {session.os || '—'}
                                                    </TableCell>
                                                    <TableCell className="text-right text-muted-foreground align-middle text-xs">
                                                        {formatDate(session.created_at)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        </TabsContent>

                        {/* ─────────────── SUBSCRIPTION TAB ─────────────── */}
                        <TabsContent value="subscription" className="mt-0 outline-none space-y-6">
                            {/* Status Card */}
                            <div className="bg-secondary/20 rounded-none p-6 md:p-12 bg-gradient-to-br from-primary/5 to-transparent">
                                {subLoading ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    </div>
                                ) : subStatus?.is_subscribed && subStatus.subscription ? (
                                    <>
                                        <div className="flex items-center gap-3 mb-4">
                                            <ShieldCheck className="w-6 h-6 text-primary" />
                                            <h3 className="text-xl font-bold">PitBox Premium</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">
                                            {subStatus.message}
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                            <div className="flex-1 p-6 bg-background/50 rounded-none ">
                                                <span className="text-[10px] uppercase  text-muted-foreground font-bold">Plan</span>
                                                <p className="text-lg font-bold mt-1">{subStatus.subscription.package.name}</p>
                                            </div>
                                            <div className="flex-1 p-6 bg-background/50 rounded-none ">
                                                <span className="text-[10px] uppercase  text-muted-foreground font-bold">Expires</span>
                                                <p className="text-lg font-bold mt-1">{formatDate(subStatus.subscription.end_date)}</p>
                                            </div>
                                            <div className="flex-1 p-6 bg-background/50 rounded-none ">
                                                <span className="text-[10px] uppercase  text-muted-foreground font-bold">Amount Paid</span>
                                                <p className="text-lg font-bold mt-1">
                                                    {subStatus.subscription.package.currency} {subStatus.subscription.package.price.toLocaleString()}
                                                    <span className="text-xs text-muted-foreground ml-1">/ {subStatus.subscription.package.duration_days} days</span>
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 mb-4">
                                            <ShieldOff className="w-6 h-6 text-muted-foreground" />
                                            <h3 className="text-xl font-bold">No Active Subscription</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">
                                            {subStatus?.message || 'Subscribe to unlock premium content and enjoy unlimited streaming.'}
                                        </p>
                                        <Button
                                            className="rounded-none bg-primary text-primary-foreground font-bold hover:bg-primary/90 px-8 py-6 h-auto"
                                            onClick={() => navigate('/subscribe')}
                                        >
                                            <ArrowUpRight className="mr-2 h-4 w-4" />
                                            Browse Plans
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Transaction History */}
                            <div className="bg-secondary/20 rounded-none p-6 md:p-12 overflow-x-auto">
                                <h3 className="text-sm font-bold mb-8">Transaction History</h3>

                                {txLoading ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    </div>
                                ) : !transactions || transactions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                                        <AlertCircle className="w-6 h-6" />
                                        <p className="text-sm">No transactions yet</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader className="border-b">
                                            <TableRow className="hover:bg-transparent border-white/5">
                                                <TableHead className="text-xs font-bold uppercase">Description</TableHead>
                                                <TableHead className="text-xs font-bold uppercase">Type</TableHead>
                                                <TableHead className="text-xs font-bold uppercase">Amount</TableHead>
                                                <TableHead className="text-xs font-bold uppercase">Status</TableHead>
                                                <TableHead className="text-xs font-bold uppercase text-right">Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {transactions.map((tx) => (
                                                <TableRow key={tx.id} className="border-white/5 hover:bg-white/5">
                                                    <TableCell className="font-medium align-middle py-4 max-w-[200px] truncate">
                                                        {tx.description}
                                                    </TableCell>
                                                    <TableCell className="align-middle">
                                                        <Badge variant="outline" className="text-[10px] rounded-none font-bold uppercase">
                                                            {tx.transaction_type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground align-middle font-mono text-xs">
                                                        {tx.amount != null ? `${tx.currency} ${tx.amount.toLocaleString()}` : '—'}
                                                    </TableCell>
                                                    <TableCell className="align-middle">
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-[10px] rounded-none font-bold uppercase ${tx.status === 'completed' || tx.status === 'success'
                                                                ? 'border-green-500/30 text-green-400'
                                                                : tx.status === 'pending'
                                                                    ? 'border-yellow-500/30 text-yellow-400'
                                                                    : 'border-red-500/30 text-red-400'
                                                                }`}
                                                        >
                                                            {tx.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right text-muted-foreground align-middle text-xs">
                                                        {formatDate(tx.created_at)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="requests" className="mt-0 outline-none">
                            <div className="bg-secondary/20 rounded-none p-6 md:p-12 max-w-2xl">
                                <h3 className="text-sm font-bold mb-8">Requests</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold  text-muted-foreground">Movie Name</label>
                                        <Input
                                            type="text"
                                            placeholder="@ Bunny, Avengers"
                                            className="bg-background/50 rounded-none"
                                            value={movieName}
                                            onChange={(e) => setMovieName(e.target.value)}
                                            disabled={requestingMovie}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold   text-muted-foreground">Description</label>
                                            <Textarea
                                                placeholder="@My Serie 2- 5"
                                                className="bg-background/50 rounded-none h-32"
                                                value={movieReason}
                                                onChange={(e) => setMovieReason(e.target.value)}
                                                disabled={requestingMovie}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        className="rounded-none bg-primary text-primary-foreground font-semibold hover:bg-primary/90 px-8 py-6 mt-4"
                                        onClick={handleMovieRequest}
                                        disabled={requestingMovie || !movieName.trim()}
                                    >
                                        {requestingMovie ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Requesting...
                                            </>
                                        ) : (
                                            'Request Movie'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </main>
        </div>
    );
}

function InfoItem({ label, value, badge }: { label: string; value: string; badge?: string }) {
    return (
        <div className="space-y-2">
            <span className="text-[10px] uppercase text-muted-foreground font-bold">{label}</span>
            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                <p className="text-md font-medium">{value}</p>
                {badge && <Badge variant="default" className="bg-primary text-[10px] h-5 rounded-none font-bold uppercase">{badge}</Badge>}
            </div>
        </div>
    );
}

function formatDate(dateString: string): string {
    try {
        return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
    } catch {
        return dateString;
    }
}