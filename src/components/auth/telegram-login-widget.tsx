"use client";

import { useEffect, useRef } from "react";

export function TelegramLoginWidget({ botUsername }: { botUsername: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    ref.current.appendChild(script);
  }, [botUsername]);

  return <div ref={ref} className="flex justify-center" />;
}
