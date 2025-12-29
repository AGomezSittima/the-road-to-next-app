export const checkIfStripeAllowed = ({
  shouldThrow,
}: { shouldThrow?: boolean } = {}) => {
  if (process.env.ALLOW_STRIPE !== "true") {
    if (shouldThrow) {
      throw new Error("Stripe integration is disabled");
    }

    return false;
  }

  return true;
};
