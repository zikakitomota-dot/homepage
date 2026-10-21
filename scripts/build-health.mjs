import { spawn } from 'node:child_process';
import { access, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const mainRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const healthRoot = path.resolve(mainRoot, '..', 'phase2-navigation-health');
const expectedMain = 'phase2-navigation-homepage';
const expectedHealth = 'phase2-navigation-health';

if (path.basename(mainRoot) !== expectedMain || path.basename(healthRoot) !== expectedHealth) {
  throw new Error(`Refusing Health build from unexpected roots: main=${mainRoot}; health=${healthRoot}`);
}

await access(path.join(healthRoot, 'astro.config.mjs'));
await access(path.join(healthRoot, 'src', 'pages', 'calculators', 'bmi.astro'));

console.log(`[Health migration] Main root: ${await realpath(mainRoot)}`);
console.log(`[Health migration] Health root: ${await realpath(healthRoot)}`);

const npmCli = process.env.npm_execpath;
const command = npmCli ? process.execPath : (process.platform === 'win32' ? 'npm.cmd' : 'npm');
const args = npmCli ? [npmCli, 'run', 'build'] : ['run', 'build'];
const child = spawn(command, args, {
  cwd: healthRoot,
  stdio: 'inherit',
  shell: false,
});

const exitCode = await new Promise((resolve, reject) => {
  child.once('error', reject);
  child.once('exit', (code) => resolve(code ?? 1));
});

if (exitCode !== 0) throw new Error(`Health build failed with exit code ${exitCode}.`);
