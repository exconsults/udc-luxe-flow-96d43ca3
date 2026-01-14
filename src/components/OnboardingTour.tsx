import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Award, 
  Settings, 
  BookOpen,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string;
  position?: 'center' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to UDC Laundry! 🎉',
    description: 'Let us show you around your new dashboard. This quick tour will help you get started with our laundry service.',
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    position: 'center'
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    description: 'This is your home base. View your active orders, loyalty points, and recent activity at a glance.',
    icon: <LayoutDashboard className="h-8 w-8 text-blue-500" />,
    position: 'center'
  },
  {
    id: 'new-order',
    title: 'Create New Orders',
    description: 'Ready to schedule a pickup? Click "New Order" in the sidebar to choose your service, set pickup details, and confirm your order.',
    icon: <PlusCircle className="h-8 w-8 text-purple-500" />,
    position: 'center'
  },
  {
    id: 'order-history',
    title: 'Track Your Orders',
    description: 'View all your past and current orders in "Order History". Track status, download receipts, and reorder with one click.',
    icon: <History className="h-8 w-8 text-orange-500" />,
    position: 'center'
  },
  {
    id: 'rewards',
    title: 'Earn Rewards',
    description: 'Every order earns you loyalty points! Check your balance in "Rewards" and redeem them for discounts on future orders.',
    icon: <Award className="h-8 w-8 text-yellow-500" />,
    position: 'center'
  },
  {
    id: 'settings',
    title: 'Customize Settings',
    description: 'Update your profile, manage addresses, and set notification preferences in "Settings".',
    icon: <Settings className="h-8 w-8 text-gray-500" />,
    position: 'center'
  },
  {
    id: 'guide',
    title: 'Need Help? Check the Guide',
    description: 'Our comprehensive User Guide covers everything you need to know. You can download it as a PDF anytime!',
    icon: <BookOpen className="h-8 w-8 text-green-500" />,
    position: 'center'
  }
];

interface OnboardingTourProps {
  onComplete?: () => void;
}

const OnboardingTour = ({ onComplete }: OnboardingTourProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .maybeSingle();

        if (profile && !profile.onboarding_completed) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({ onboarding_completed: true })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error updating onboarding status:', error);
      }
    }
    
    setIsOpen(false);
    onComplete?.();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (isLoading || !isOpen) {
    return null;
  }

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleSkip}
      />
      
      {/* Tour Card */}
      <Card className="relative z-10 w-full max-w-md mx-4 shadow-2xl border-2 border-primary/20 animate-scale-in">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                {step.icon}
              </div>
              <div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
                <CardDescription className="text-xs mt-1">
                  Step {currentStep + 1} of {tourSteps.length}
                </CardDescription>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 -mt-1 -mr-2"
              onClick={handleSkip}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pb-4">
          <p className="text-muted-foreground leading-relaxed">
            {step.description}
          </p>
          
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between gap-2 pt-0">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip Tour
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            
            <Button
              size="sm"
              onClick={handleNext}
              className="gap-1"
            >
              {currentStep === tourSteps.length - 1 ? (
                'Get Started'
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingTour;
