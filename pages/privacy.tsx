import Head from 'next/head';

export default function Privacy(): JSX.Element {
  return (
    <>
      <Head>
        <title>Privacy policy | RPMS</title>
      </Head>
      <main className='mx-auto max-w-3xl p-8'>
        <img
          src='/rpms-logo.svg'
          alt='RPMS - Roleplay Management System'
          className='mb-10 h-auto w-56'
        />
        <h1 className='mb-6 text-3xl font-bold'>Privacy policy</h1>
        <p>
          RPMS processes Roblox and Discord identifiers, authentication session metadata, and
          activity data to provide the service.
        </p>
        <p className='mt-4'>
          Authenticated users can submit an automatic deletion request through{' '}
          <code>/api/privacy/delete-request</code>. Operators must complete this policy with
          retention periods, legal bases, processors, and supervisory-authority details.
        </p>
      </main>
    </>
  );
}
