import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'
import { Button } from '@/components/ui/button'
import SEO from '@/components/SEO'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Docs = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="API Documentation"
                description="PitBox Developer API Reference. Explore endpoints, authentication, and integration guides for the PitBox streaming platform."
                canonicalPath="/docs"
                noindex={true}
            />
            <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="text-white/60 hover:text-white hover:bg-white/10"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">API Reference</h1>
                            <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">PitBox Developer Portal</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                            <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Production API</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="scalar-theme-pitbox">
                <ApiReferenceReact
                    configuration={{
                        url: 'https://pitbox-ten.vercel.app/openapi.json',
                        theme: 'solarized',
                        layout: 'modern',
                        hideDownloadButton: true,
                        hideTestRequestButton: false,
                    }}
                />
            </div>

            <style jsx global>{`
        .scalar-theme-pitbox {
          --scalar-primary: hsl(var(--primary));
          --scalar-background-1: hsl(var(--background));
          --scalar-background-2: hsl(var(--card));
          --scalar-background-3: hsl(var(--accent));
          --scalar-color-1: hsl(var(--foreground));
          --scalar-color-2: hsla(var(--foreground), 0.7);
          --scalar-color-3: hsla(var(--foreground), 0.5);
          --scalar-border-color: hsl(var(--border));
          --scalar-font-family: var(--font-body);
          --scalar-font-family-mono: 'Space Mono', monospace;
        }
        
        /* Adjust Scalar internal styles to match PitBox aesthetic */
        .scalar-app {
          border: none !important;
          background: transparent !important;
        }
        
        .scalar-sidebar {
          background: hsl(var(--background)) !important;
          border-right: 1px solid hsla(var(--foreground), 0.05) !important;
        }
      `}</style>
        </div>
    )
}

export default Docs
