import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            await login({
                username: data.email,
                password: data.password,
            });
            navigate('/');
        } catch (error) {
            // Error is handled in AuthProvider via toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
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
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-white/70">Password</Label>
                        <Link to="/forgot-password" className="text-xs text-primary/80 hover:text-primary transition-colors">
                            Forgot password?
                        </Link>
                    </div>
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

                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </Button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-black px-2 text-white/40 tracking-widest">New to PitBox?</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/5 py-6 rounded-xl"
                    onClick={() => navigate('/signup')}
                    disabled={isLoading}
                >
                    Create an account
                </Button>
            </form>
        </AuthLayout>
    );
};

export default Login;
