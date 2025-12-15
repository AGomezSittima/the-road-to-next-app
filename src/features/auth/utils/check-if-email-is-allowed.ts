export const checkIfEmailIsAllowed = ({shouldThrow}: {shouldThrow?: boolean} = {}) => {
  if (process.env.ALLOW_EMAIL !== "true") {
    if (shouldThrow) {
      throw new Error("Email sending is disabled");
    }

    return false;
  }

  return true;
}