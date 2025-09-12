"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { consumeCookieByKey } from "@/actions/cookies";
import { ToastData } from "@/types/toast";
import { appConfig } from "@/utils/app-config";

const tryParseJsonObject = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const RedirectToast = () => {
  // pathname shouldn't be needed since this will be used in a template
  // But there is a bug currently and the template doesn't re-render reliably between navigations
  // TODO: Remove pathname when no longer needed
  const pathname = usePathname();

  useEffect(() => {
    const showCookieToast = async () => {
      const message = await consumeCookieByKey(appConfig.cookiesKeys.toast);

      if (message) {
        const toastData: ToastData = tryParseJsonObject(message);
        const toastMessage =
          typeof toastData === "string" ? (
            message
          ) : (
            <span>
              {toastData.message}&nbsp;-&nbsp;
              <Link href={toastData.link} className="underline">
                view
              </Link>
            </span>
          );

        toast.success(toastMessage);
      }
    };

    showCookieToast();
  }, [pathname]);

  return null;
};

export { RedirectToast };
