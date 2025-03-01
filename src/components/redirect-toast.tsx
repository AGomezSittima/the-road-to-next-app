"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { deleteCookieByKey, getCookieByKey } from "@/actions/cookies";
import { appConfig } from "@/lib/app-config";

const RedirectToast = () => {
  useEffect(() => {
    const showCookieToast = async () => {
      const message = await getCookieByKey(appConfig.cookiesKeys.toast);

      if (message) {
        toast.success(message);

        await deleteCookieByKey(appConfig.cookiesKeys.toast);
      }
    };

    showCookieToast();
  }, []);

  return null;
};

export { RedirectToast };
