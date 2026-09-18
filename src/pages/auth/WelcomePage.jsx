import { LinkButton } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Bits";
import { ArrowRight } from "lucide-react";
export function WelcomePage() {
  return (
    <div className="relative h-[100dvh] min-h-[100dvh] overflow-hidden bg-white">
      <img
        src="/img/welcome-hero.jpg"
        alt="A farmer holding a basket of freshly harvested vegetables"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute left-6 top-8 sm:left-14 sm:top-10">
        <Logo className="w-[150px] drop-shadow-sm sm:w-[200px]" />
      </div>

      <div className="absolute left-1/2 top-[53%] z-10 w-[calc(100%-2rem)] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-[24px] bg-white/95 px-9 py-7 shadow-sm sm:w-[400px]">
        <div className="space-y-4">
          <LinkButton to="/role" block className="gap-3">
            Get Started
            <ArrowRight className="h-5 w-5" />
          </LinkButton>
          <LinkButton to="/login" variant="outline" block>
            Login
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
