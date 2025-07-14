import Head from "next/head";
import Link from "next/link";

export default function SupportPage() {
  return (
    <>
      <Head>
        <title>Support | CHPRBN National Standing Order</title>
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Support</h1>
        <p className="mb-4">
          Welcome to the CHPRBN National Standing Order support page. We are
          here to assist you with any issues or questions you may have regarding
          our platform and services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Contact Support</h2>
        <p className="mb-4">
          If you need assistance, please reach out to our support team at:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            Email:{" "}
            <a
              href="mailto:support@chprbn.org"
              className="text-blue-600 underline"
            >
              support@chprbn.org
            </a>
          </li>
          {/* <li>Phone: +1-800-123-4567</li> */}
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2">
          Frequently Asked Questions
        </h2>
        <p className="mb-4">
          Visit our{" "}
          <Link href="/" className="text-blue-600 underline">
            FAQ page
          </Link>{" "}
          for answers to common questions.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Technical Support</h2>
        <p className="mb-4">
          For technical issues, please provide detailed information about the
          problem, including screenshots if possible, and send it to our support
          email.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Feedback</h2>
        <p className="mb-4">
          We value your feedback. If you have suggestions or comments, please
          email us at{" "}
          <a
            href="mailto:feedback@chprbn.org"
            className="text-blue-600 underline"
          >
            feedback@chprbn.org
          </a>
          .
        </p>
      </main>
    </>
  );
}
