import { PlanProvider } from "@/lib/contexts/PlanContext";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authData = await auth();

  // Safely evaluate plan permissions with safe fallback for unauthenticated or custom claims
  const hasProPlan = Boolean(
    authData?.has &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((authData.has as any)({ plan: "pro_user" }) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (authData.has as any)({ feature: "pro_user" }) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (authData.has as any)({ role: "org:pro_user" }))
  );

  const hasEnterprisePlan = Boolean(
    authData?.has &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((authData.has as any)({ plan: "enterprise_user" }) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (authData.has as any)({ feature: "enterprise_user" }) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (authData.has as any)({ role: "org:enterprise_user" }))
  );

  return (
    <PlanProvider hasProPlan={hasProPlan} hasEnterprisePlan={hasEnterprisePlan}>
      {children}
    </PlanProvider>
  );
}
