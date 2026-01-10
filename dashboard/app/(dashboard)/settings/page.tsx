"use client";

import { Card } from "flowbite-react";
import {
  HiCog,
  HiDatabase,
  HiMail,
  HiServer,
} from "react-icons/hi";

export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Innstillinger
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Administrer integrasjoner og innstillinger
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gmail Integration */}
        <Card>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900/20">
                <HiMail className="size-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Gmail
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  E-post integrasjon (kommer snart)
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gmail-integrasjon krever Google Cloud OAuth-oppsett.
              Se E-post-siden for mer informasjon.
            </p>
          </div>
        </Card>

        {/* Database Settings */}
        <Card>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
                <HiDatabase className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Database
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  SQLite database
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Type</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  SQLite (better-sqlite3)
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Plassering</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  ../data/crm.db
                </dd>
              </div>
            </dl>
          </div>
        </Card>

        {/* System Info */}
        <Card>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-900/20">
                <HiServer className="size-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  System
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Systeminformasjon
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Framework</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  Next.js 16
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">UI</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  Flowbite React
                </dd>
              </div>
            </dl>
          </div>
        </Card>

        {/* General Settings */}
        <Card>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/20">
                <HiCog className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Generelt
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Generelle innstillinger
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Valuta</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  NOK
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Sprak</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  Norsk
                </dd>
              </div>
            </dl>
          </div>
        </Card>
      </div>
    </div>
  );
}
