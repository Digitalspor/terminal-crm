"use client";

import { Button } from "flowbite-react";
import { HiMail, HiRefresh } from "react-icons/hi";

interface Props {
  connected?: boolean;
}

export function GmailConnectButton({ connected }: Props) {
  const handleConnect = () => {
    window.location.href = "/api/auth/gmail";
  };

  if (connected) {
    return (
      <Button color="gray" size="sm" onClick={handleConnect}>
        <HiRefresh className="mr-2 size-4" />
        Koble til på nytt
      </Button>
    );
  }

  return (
    <Button color="blue" onClick={handleConnect}>
      <HiMail className="mr-2 size-5" />
      Koble til Gmail
    </Button>
  );
}
