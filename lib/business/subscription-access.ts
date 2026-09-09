type SubscriptionProvider = {
  subscriptionExempt?: boolean | null;
  subscriptionStatus?: string | null;
  subscriptionCurrentPeriodEnd?: Date | null;

  businessSubscriptionExempt?: boolean | null;
  businessSubscriptionStatus?: string | null;
  businessSubscriptionCurrentPeriodEnd?: Date | null;
};

function activeStatus(status?: string | null) {
  return ["ACTIVE", "TRIALING"].includes(
    String(status || "").toUpperCase()
  );
}

function periodValid(
  end?: Date | null
) {
  if (!end) return true;

  return end.getTime() >
    Date.now();
}

export function getBusinessSubscriptionAccess(
  provider: SubscriptionProvider
) {
  const baseSubscriptionActive =
    Boolean(
      provider.subscriptionExempt
    ) ||
    (
      activeStatus(
        provider.subscriptionStatus
      ) &&
      periodValid(
        provider.subscriptionCurrentPeriodEnd
      )
    );

  const businessSubscriptionActive =
    Boolean(
      provider.businessSubscriptionExempt
    ) ||
    (
      activeStatus(
        provider.businessSubscriptionStatus
      ) &&
      periodValid(
        provider.businessSubscriptionCurrentPeriodEnd
      )
    );

  return {
    baseSubscriptionActive,
    businessSubscriptionActive,

    hasBusinessAccess:
      baseSubscriptionActive &&
      businessSubscriptionActive,
  };
}
