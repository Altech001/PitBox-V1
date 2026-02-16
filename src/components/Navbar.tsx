import { Search, User, Tv, Film, Sparkles, LogOut, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NavLink } from './NavLink';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const navItems = [
    { label: 'Movies', to: '/movies', icon: Film },
    { label: 'Series', to: '/series', icon: Tv },
    { label: 'API Docs', to: '/docs', icon: Sparkles },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4 md:gap-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="relative">
            <img src="/pitpal.png" alt="" className="w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-display text-base md:text-lg font-black text-foreground tracking-tighter">
            Pit<span className="text-primary">Box</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="text-sm font-bold  text-muted-foreground hover:text-primary transition-colors relative py-1 group/nav"
              activeClassName="text-foreground"
            >
              {item.label}
              <span className={cn(
                "absolute -bottom-1 left-0 right-0 h-0.5 bg-primary origin-left transition-transform duration-300",
                location.pathname === item.to ? "scale-x-100" : ""
              )} />
            </NavLink>
          ))}
        </div>

        {/* Search Bar - Responsive */}
        <div className="flex-1 flex justify-center max-w-lg">
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-3 bg-secondary/50 hover:bg-secondary text-muted-foreground text-xs md:text-sm px-4 py-2.5 rounded-none border-white/5 hover:border-primary/30 transition-all w-full md:max-w-md group"
          >
            <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span className="hidden sm:inline">Search movies & series...</span>
            <span className="sm:hidden">Search...</span>
          </button>
        </div>

        {/* Right Section: Mobile Nav + Account */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Mobile-only Icons */}
          <div className="flex md:hidden items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "p-2 rounded-full hover:bg-secondary transition-colors",
                  location.pathname === item.to ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
              </Link>
            ))}
          </div>

          {/* Premium Button */}
          {!user?.subscribed && (
            <Link
              to="/subscribe"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border-primary/20 rounded-none transition-all group"
            >
              <span className="text-xs font-bold uppercase tracking-wider">Subscribe</span>
            </Link>
          )}

          {/* Account Button / Dropdown */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 bg-secondary/50 p-1 md:pr-4 rounded-full hover:bg-secondary transition-all">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                      {user?.email?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-xs font-bold">{user?.username || 'User'}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/[0.005] backdrop-blur-2xl border-white/10 text-white" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-white/40">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={() => navigate('/account')} className="cursor-pointer hover:bg-white/5">
                  <User className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                {user?.subscribed && (
                  <DropdownMenuItem className="text-primary hover:bg-primary/10 cursor-default">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>Premium Member</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={() => logout()} className="text-red-400 cursor-pointer hover:bg-red-500/10 hover:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border-white/5 text-foreground hover:bg-secondary hover:border-primary/20 rounded-full transition-all"
            >
              <User className="w-5 h-5 md:w-4 md:h-4" />
              <span className="hidden md:inline text-xs font-bold">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
