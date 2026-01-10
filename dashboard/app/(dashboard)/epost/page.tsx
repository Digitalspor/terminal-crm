"use client";

import { Button, Card } from "flowbite-react";
import { HiMail, HiInformationCircle, HiExternalLink } from "react-icons/hi";

export default function EpostPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          E-post
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Google Workspace e-post integrasjon
        </p>
      </div>

      <Card className="max-w-2xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <HiMail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>

          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Gmail-integrasjon
          </h2>

          <p className="mb-6 text-gray-500 dark:text-gray-400">
            Koble til Gmail for a automatisk behandle innkommende e-poster,
            klassifisere henvendelser og opprette oppgaver.
          </p>

          <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start gap-3">
              <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div className="text-left text-sm text-blue-700 dark:text-blue-300">
                <p className="mb-2 font-medium">For a aktivere Gmail-integrasjonen:</p>
                <ol className="list-inside list-decimal space-y-1">
                  <li>Opprett et Google Cloud prosjekt</li>
                  <li>Aktiver Gmail API</li>
                  <li>Konfigurer OAuth 2.0 credentials</li>
                  <li>Legg til miljovariablene i .env</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button color="blue" size="lg" disabled className="w-full">
              <HiMail className="mr-2 h-5 w-5" />
              Koble til Gmail (kommer snart)
            </Button>

            <a
              href="https://console.cloud.google.com/apis/library/gmail.googleapis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              <HiExternalLink className="mr-1 h-4 w-4" />
              Google Cloud Console
            </a>
          </div>
        </div>
      </Card>

      {/* Placeholder for future email list */}
      <Card className="mt-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Innboks
        </h3>
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Ingen e-poster enna. Koble til Gmail for a se e-poster her.
          </p>
        </div>
      </Card>
    </div>
  );
}
