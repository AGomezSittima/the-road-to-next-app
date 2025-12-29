export const checkIfAttachmentsAreAllowed = ({
  shouldThrow,
}: { shouldThrow?: boolean } = {}) => {
  if (process.env.NEXT_PUBLIC_ALLOW_ATTACHMENTS !== "true") {
    if (shouldThrow) {
      throw new Error("Attachments are not allowed");
    }

    return false;
  }

  return true;
};
