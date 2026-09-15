import { LinkButton } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Bits';
export function WelcomePage() {
    return (<div className="relative flex min-h-[100dvh] flex-col bg-white">
      <div className="relative flex-1 overflow-hidden">
        <img src="/img/welcome-hero.jpg" alt="A farmer holding a basket of freshly harvested vegetables" className="h-full w-full object-cover"/>
        <div className="absolute left-5 top-5">
          <Logo className="w-[130px] drop-shadow-sm sm:w-[150px]"/>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent"/>
      </div>

      <div className="relative z-10 -mt-6 rounded-t-3xl bg-white px-6 pb-10 pt-2">
        <div className="mx-auto w-full max-w-md space-y-4">
          <LinkButton to="/role" block>
            Get Started
          </LinkButton>
          <LinkButton to="/login" variant="outline" block>
            Login
          </LinkButton>
        </div>
      </div>
    </div>);
}
