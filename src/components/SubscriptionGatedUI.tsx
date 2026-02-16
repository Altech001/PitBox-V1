import { ShieldAlert, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionGatedUI() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div></div>
      <div className="max-w-md w-full bg-secondary/20 p-8 md:p-12 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="inline-block p-4 bg-primary/10 rounded-full">
          <ShieldAlert className="w-10 h-10 text-primary" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase text-white">Access Restricted</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This premium content requires an active subscription. Join the PitBox community to unlock unlimited access.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate('/subscribe')}
            className="w-full h-14 rounded-none bg-primary text-black font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            View Plans
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-[10px] font-black uppercase text-muted-foreground hover:text-white"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}