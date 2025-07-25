
export default function DeleteAccountPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Request Account Deletion</h1>
      <p className="mb-4">
        We're sorry to see you go. To delete your Facilify account, please follow the steps below:
      </p>
      <ol className="list-decimal list-inside mb-6 space-y-2">
        <li>
          Open your registered email address (the one associated with your NSO account).
        </li>
        <li>
          Send an email to <a href="mailto:support@facilify.africa" className="text-blue-600 underline">info@chprbngov.ng</a>
          {' '}with the subject line: <strong>"Account Deletion Request"</strong>.
        </li>
        <li>
          In the email, include a brief message confirming that you would like to permanently delete your account.
        </li>
      </ol>
      <p className="text-sm text-gray-600">
        For your security, we only process deletion requests from the registered email address linked to your NSO account.
      </p>
    </main>
  );
}