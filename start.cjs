const { spawn } = require('node:child_process');

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const environment = {
  ...process.env,
  HOSTNAME: process.env.HOSTNAME || '0.0.0.0',
  PORT: process.env.PORT || '9050',
};

const generate = spawn(
  npm,
  ['run', 'prisma:generate'],
  {
    stdio: 'inherit',
    env: environment,
  },
);

generate.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  if (code !== 0) {
    process.exit(code ?? 1);
  }

  const child = spawn(npm, ['run', 'start'], {
    stdio: 'inherit',
    env: environment,
  });

  child.on('exit', (childCode, childSignal) => {
    if (childSignal) {
      process.kill(process.pid, childSignal);
      return;
    }

    process.exit(childCode ?? 1);
  });
});
