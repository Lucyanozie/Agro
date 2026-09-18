import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { SuccessScreen } from '@/components/ui/SuccessMark';
export function AccountCreatedPage() {
    const { user, role } = useAuth();
    const navigate = useNavigate();
    /** Farmers land in verification first; buyers go straight to the marketplace. */
    function continueOn() {
        if (role === 'farmer')
            navigate('/farmer/verify/profile', { replace: true });
        else
            navigate('/buyer', { replace: true });
    }
    return (<SuccessScreen title="Congratulations!" description={<>
          <p>Your account has been successfully created.</p>
          <p className="mt-4">
            You can now start selling or buying agricultural products.
          </p>
        </>} actions={<div className="space-y-3">
          <Button block onClick={continueOn}>
            {role === 'farmer' ? 'Verify my account' : 'Go to Dashboard'}
          </Button>
          {role === 'farmer' ? (<Button variant="ghost" block onClick={() => navigate('/farmer', { replace: true })}>
              Skip for now
            </Button>) : null}
        </div>}>
      {user ? (<p className="text-[15px] text-ink-soft">
          Signed in as <span className="font-bold text-ink">{user.name}</span>
        </p>) : null}
    </SuccessScreen>);
}