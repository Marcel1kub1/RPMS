import Head from 'next/head';

export default function Impressum(): JSX.Element {
  return (
    <>
      <Head><title>Impressum | RPMS</title></Head>
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="mb-6 text-3xl font-bold">Impressum</h1>
        <p>Replace this template with the legally required provider and contact information before publishing RPMS in Germany.</p>
        <p className="mt-4">Provider name, address, authorised representative, and contact details must be supplied by the operator.</p>
      </main>
    </>
  );
}
