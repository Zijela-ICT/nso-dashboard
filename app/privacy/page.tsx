import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | CHPRBN National Standing Order</title>
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">Last updated: July 6, 2025</p>

        <p className="mb-4">
          Welcome to the CHPRBN National Standing Order platform. Your privacy
          is important to us. This Privacy Policy describes how we collect, use,
          and protect your information when you use our platform and services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">
          1. Information We Collect
        </h2>
        <p className="mb-4">
          We may collect personal information you provide to us, such as your
          name, email address, contact information, and any other details you
          choose to provide. We may also collect non-personal data automatically
          such as IP address, device information, and usage data.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">
          2. How We Use Your Information
        </h2>
        <p className="mb-4">We use the information to:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Provide and maintain our services</li>
          <li>Improve user experience</li>
          <li>Respond to inquiries and support requests</li>
          <li>Send important updates or security notices</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2">
          3. Sharing of Information
        </h2>
        <p className="mb-4">
          We do not sell your personal information. We may share it with
          third-party service providers who help us operate our platform, under
          confidentiality agreements, and only when necessary.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">4. Data Security</h2>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to
          protect your data. However, no method of transmission over the
          internet is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">5. Your Rights</h2>
        <p className="mb-4">
          You have the right to access, correct, or request deletion of your
          personal information. Contact us at{" "}
          <a
            href="mailto:support@chprbn.org"
            className="text-blue-600 underline"
          >
            support@chprbn.org
          </a>{" "}
          for any privacy concerns.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">
          6. Changes to This Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify
          you of any significant changes by posting the new policy on this page.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">7. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us
          at{" "}
          <a
            href="mailto:support@chprbn.org"
            className="text-blue-600 underline"
          >
            support@chprbn.org
          </a>
          .
        </p>
      </main>
    </>
  );
}
