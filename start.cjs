const { spawn } = require('node:child_process');

const child = spawn(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['run', 'start'],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      HOSTNAME: process.env.HOSTNAME || '0.0.0.0',
      PORT: process.env.PORT || '9050',
    },
  },
);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
