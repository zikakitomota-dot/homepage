import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const mainRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const healthRoot = path.join(mainRoot, 'health');

await access(path.join(healthRoot, 'astro.config.mjs'));
await access(path.join(healthRoot, 'src', 'pages', 'calculators', 'bmi.astro'));

console.log(`[Health build] Health root: ${healthRoot}`);

const npmCli = process.env.npm_execpath;

function runNpm(args) {
  const command = npmCli ? process.execPath : (process.platform === 'win32' ? 'npm.cmd' : 'npm');
  const fullArgs = npmCli ? [npmCli, ...args] : args;
  const child = spawn(command, fullArgs, {
    cwd: healthRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32' && !npmCli,
  });
  return new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code) => resolve(code ?? 1));
  });
}

const hasDependencies = await access(path.join(healthRoot, 'node_modules', 'astro', 'package.json'))
  .then(() => true, () => false);

if (!hasDependencies) {
  console.log('[Health build] Installing Health dependencies (npm ci)...');
  const installCode = await runNpm(['ci', '--no-audit', '--no-fund']);
  if (installCode !== 0) throw new Error(`Health dependency install failed with exit code ${installCode}.`);
}

const exitCode = await runNpm(['run', 'build']);
if (exitCode !== 0) throw new Error(`Health build failed with exit code ${exitCode}.`);
