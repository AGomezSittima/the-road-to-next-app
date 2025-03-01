"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { deleteCookieByKey, getCookieByKey } from "@/actions/cookies";
import { appConfig } from "@/utils/app-config";

const RedirectToast = () => {
  // pathname shouldn't be needed since this will be used in a template
  // But there is a bug currently and the template doesn't re-render reliably between navigations
  // TODO: Remove pathname when no longer needed
  const pathname = usePathname();

  useEffect(() => {
    const showCookieToast = async () => {
      const message = await getCookieByKey(appConfig.cookiesKeys.toast);

      if (message) {
        toast.success(message);

        await deleteCookieByKey(appConfig.cookiesKeys.toast);
      }
    };

    showCookieToast();
  }, [pathname]);

  return null;
};

export { RedirectToast };
