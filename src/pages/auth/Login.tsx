import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import AuthLayout from '@/components/auth/AuthLayout';
import SEO from '@/components/SEO';
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
        <AuthLayout>
            <SEO
                title="Sign In"
                description="Sign in to your PitBox account. Access premium movie streaming, Ugandan films, and exclusive content."
                canonicalPath="/login"
            />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
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

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between ml-1">
                        <Label htmlFor="password" className="text-white/50 text-[10px] rounded-none ">Password</Label>
                        <Link to="/forgot-password" title="Forgot Password" className="text-[10px] text-primary/60 hover:text-primary transition-colors rounded-none ">
                            Forgot?
                        </Link>
                    </div>
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

                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-black font-black rounded-none  h-14 transition-all shadow-[0_10px_20px_rgba(var(--primary),0.2)] active:scale-[0.98] mt-4"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
                            Igniting...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default Login;
