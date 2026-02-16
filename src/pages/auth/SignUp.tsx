import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, AlertCircle, UserPlus, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const signUpSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
    const navigate = useNavigate();
    const { register: registerAccount } = useAuth(); // Action from Provider
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpFormValues) => {
        setIsLoading(true);
        try {
            await registerAccount({
                email: data.email,
                password: data.password,
            });
            setIsSuccess(true);
            // Wait a bit before redirecting to login
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            // Error handled in AuthProvider via toast
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <AuthLayout>
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                            <CheckCircle2 className="w-12 h-12 text-primary" />
                        </div>
                        <div className="absolute inset-0 border border-primary/20 rounded-full animate-ping" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-white font-bold text-lg rounded-none ">Registration Complete</h3>
                        <p className="text-white/40 text-[10px] rounded-none ">
                            Preparing your dashboard...
                        </p>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                    <Label htmlFor="email" className="text-white/50 text-[10px] rounded-none  ml-1">Email Address</Label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="engine@pitbox.com"
                            className="bg-white/[0.03] border-white/5 text-white h-12 pl-12 rounded-none focus:border-primary/30 focus:ring-primary/10 transition-all placeholder:text-white/10"
                            {...register('email')}
                            disabled={isLoading}
                        />
                    </div>
                    {errors.email && (
                        <div className="flex items-center gap-1.5 text-[10px] text-red-400 mt-1 ml-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.email.message}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                    <Label htmlFor="password" className="text-white/50 text-[10px] rounded-none  ml-1">Password</Label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="bg-white/[0.03] border-white/5 text-white h-12 pl-12 rounded-none focus:border-primary/30 focus:ring-primary/10 transition-all placeholder:text-white/10"
                            {...register('password')}
                            disabled={isLoading}
                        />
                    </div>
                    {errors.password && (
                        <div className="flex items-center gap-1.5 text-[10px] text-red-400 mt-1 ml-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.password.message}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                    <Label htmlFor="confirmPassword" className="text-white/50 text-[10px] rounded-none ml-1">Confirm Password</Label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="bg-white/[0.03] border-white/5 text-white h-12 pl-12 rounded-none focus:border-primary/30 focus:ring-primary/10 transition-all placeholder:text-white/10"
                            {...register('confirmPassword')}
                            disabled={isLoading}
                        />
                    </div>
                    {errors.confirmPassword && (
                        <div className="flex items-center gap-1.5 text-[10px] text-red-400 mt-1 ml-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.confirmPassword.message}</span>
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-black font-black rounded-none  h-14 rounded-none transition-all shadow-[0_10px_20px_rgba(var(--primary),0.2)] active:scale-[0.98] mt-6"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
                            Calibrating...
                        </>
                    ) : (
                        <>
                            <UserPlus className="mr-2 h-4 w-4 text-black" />
                            Create Account
                        </>
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default SignUp;