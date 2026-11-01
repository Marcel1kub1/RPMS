import Head from 'next/head';

export default function Terms(): JSX.Element {
  return (
    <>
      <Head>
        <title>Terms of service | RPMS</title>
      </Head>
      <main className='mx-auto max-w-3xl p-8'>
        <img
          src='/rpms-logo.svg'
          alt='RPMS - Roleplay Management System'
          className='mb-10 h-auto w-56'
        />
        <h1 className='mb-6 text-3xl font-bold'>Terms of service</h1>
        <p>
          RPMS is provided by the instance operator. Use of this service requires compliance with
          the operator&apos;s rules and applicable law.
        </p>
        <p className='mt-4'>
          The operator must replace this template with reviewed terms, billing rules, liability
          limits, and an effective date.
        </p>
      </main>
    </>
  );
}
