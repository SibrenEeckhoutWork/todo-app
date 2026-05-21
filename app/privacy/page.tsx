export default function PrivacyPage() {
  return (
    <div className="px-5 py-8 max-w-lg mx-auto md:max-w-2xl">
      <h1 className="font-display font-semibold text-[28px] text-ink-primary mb-6">Privacy Policy</h1>

      <div className="prose prose-sm text-ink-secondary space-y-4 text-[15px] leading-relaxed">
        <p>
          <strong className="text-ink-primary">Todo</strong> is a fully offline, privacy-first task manager.
          All data is stored locally on your device using your browser&apos;s localStorage.
        </p>

        <h2 className="font-display font-semibold text-[18px] text-ink-primary mt-6 mb-2">Data collection</h2>
        <p>We collect no data. There are no analytics, no telemetry, no crash reporting, and no user accounts.</p>

        <h2 className="font-display font-semibold text-[18px] text-ink-primary mt-6 mb-2">Data storage</h2>
        <p>
          All tasks, lists, and tags are stored exclusively in your device&apos;s localStorage. No data is ever
          transmitted to any server. Your data never leaves your device.
        </p>

        <h2 className="font-display font-semibold text-[18px] text-ink-primary mt-6 mb-2">Third-party services</h2>
        <p>
          This application uses Google Fonts (Lora, DM Sans, JetBrains Mono), which are self-hosted at build time.
          No requests are sent to Google servers at runtime.
        </p>

        <h2 className="font-display font-semibold text-[18px] text-ink-primary mt-6 mb-2">Data deletion</h2>
        <p>
          You can delete all data at any time via <strong>Settings → Reset everything</strong>. Uninstalling the
          app from your device also removes all locally stored data.
        </p>

        <h2 className="font-display font-semibold text-[18px] text-ink-primary mt-6 mb-2">Contact</h2>
        <p>Questions? Reach us at the contact details provided on the app store listing.</p>

        <p className="font-mono text-[11px] text-ink-muted pt-4">Last updated: May 2026</p>
      </div>
    </div>
  )
}
