import { generateRandomToken, hashToken } from "@/utils/crypto";
import { passwordResetPath } from "@/utils/paths";
import { getBaseUrl } from "@/utils/url";

import * as authDataAccess from "../data";

export const generatePasswordResetLink = async (userId: string) => {
  await authDataAccess.clearPasswordResetTokens(userId);

  const tokenId = generateRandomToken();
  const tokenHash = hashToken(tokenId);

  await authDataAccess.createPasswordResetToken(userId, tokenHash);

  const pageUrl = getBaseUrl() + passwordResetPath();
  const passwordResetLink = pageUrl + `/${tokenId}`;

  return passwordResetLink;
};
