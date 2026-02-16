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
            <AuthLayout title="Account Created" subtitle="You're all set!">
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <p className="text-white/60 text-center">
                        Redirecting you to the login page...
                    </p>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Create Account" subtitle="Join the PitBox community">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/70">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="bg-white/[0.05] border-white/10 text-white pl-10 focus:border-primary/50 focus:ring-primary/20"
                            {...register('email')}
                            disabled={isLoading}
                        />
                    </div>
                    {errors.email && (
                        <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.email.message}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/70">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="bg-white/[0.05] border-white/10 text-white pl-10 focus:border-primary/50 focus:ring-primary/20"
                            {...register('password')}
                            disabled={isLoading}
                        />
                    </div>
                    {errors.password && (
                        <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.password.message}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white/70">Confirm Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="bg-white/[0.05] border-white/10 text-white pl-10 focus:border-primary/50 focus:ring-primary/20"
                            {...register('confirmPassword')}
                            disabled={isLoading}
                        />
                    </div>
                    {errors.confirmPassword && (
                        <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.confirmPassword.message}</span>
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Create Account
                        </>
                    )}
                </Button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-black px-2 text-white/40 tracking-widest">Already have an account?</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/5 py-6 rounded-xl"
                    onClick={() => navigate('/login')}
                    disabled={isLoading}
                >
                    Sign In
                </Button>
            </form>
        </AuthLayout>
    );
};

export default SignUp;