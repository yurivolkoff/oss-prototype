import React from 'react';
import { TopPromoBar } from './TopPromoBar';
import { AppHeader } from './AppHeader';
import { AddressBar } from './AddressBar';
import { Footer } from './Footer';
import { Stepper, STEPPER_LABELS, type StepperStep } from './Stepper';

export interface PageShellProps {
  address: string;
  showStepper?: boolean;
  steps?: StepperStep[];
  onStepClick?: (idx: number) => void;
  children: React.ReactNode;
}

export function PageShell({
  address,
  showStepper = false,
  steps,
  onStepClick,
  children,
}: PageShellProps) {
  const stepperSteps: StepperStep[] =
    steps ??
    STEPPER_LABELS.map((label) => ({ label, state: 'pending' as const }));

  return (
    <div className="app">
      <TopPromoBar />
      <AppHeader />
      <AddressBar address={address} />
      <main className="main">
        <div className="container">
          {showStepper && (
            <Stepper steps={stepperSteps} onStepClick={onStepClick} />
          )}
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
