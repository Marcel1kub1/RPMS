const { spawn } = require('node:child_process');

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const environment = {
  ...process.env,
  HOSTNAME: '0.0.0.0',
  PORT: process.env.PORT || '9050',
};

function run(command, args, onSuccess) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: environment,
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    if (code !== 0) {
      process.exit(code ?? 1);
    }

    onSuccess();
  });
}

run(npm, ['run', 'prisma:push'], () => {
  run(npm, ['run', 'prisma:generate'], () => {
    run(npm, ['run', 'start'], () => {});
  });
});
