import { spawn } from 'node:child_process';
import { mkdir, readFile, rm, rmdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  INDEXNOW_DEPLOYMENT_MANIFEST_PATH,
  INDEXNOW_DEPLOYMENT_MANIFEST_URL,
  createDeploymentManifest,
  runAutomaticIndexNowFailOpen,
} from './lib/indexnow-deployment.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicManifestPath = path.join(projectRoot, 'public', ...INDEXNOW_DEPLOYMENT_MANIFEST_PATH.split('/').filter(Boolean));
const publicManifestDirectory = path.dirname(publicManifestPath);

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: projectRoot, stdio: 'inherit', shell: false });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} failed${signal ? ` with signal ${signal}` : ` with exit code ${code}`}.`));
    });
  });
}

function runNpm(args) {
  const npmCli = process.env.npm_execpath;
  if (npmCli) return run(process.execPath, [npmCli, ...args]);
  return run(process.platform === 'win32' ? 'npm.cmd' : 'npm', args);
}

async function readPreviousDeploymentManifest() {
  try {
    const url = `${INDEXNOW_DEPLOYMENT_MANIFEST_URL}?read=${Date.now()}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`[IndexNow] Could not read the prior deployment manifest: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

async function main() {
  const deploymentStartedAt = new Date().toISOString();
  const previousManifest = await readPreviousDeploymentManifest();
  const currentManifest = await createDeploymentManifest({ projectRoot, generatedAt: deploymentStartedAt });
  let originalManifest = null;
  let manifestExisted = false;
  try {
    originalManifest = await readFile(publicManifestPath);
    manifestExisted = true;
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }

  await mkdir(publicManifestDirectory, { recursive: true });
  await writeFile(publicManifestPath, `${JSON.stringify(currentManifest)}\n`, 'utf8');
  try {
    await runNpm(['exec', '--', 'opennextjs-cloudflare', 'build']);
  } finally {
    if (manifestExisted) await writeFile(publicManifestPath, originalManifest);
    else {
      await rm(publicManifestPath, { force: true });
      try { await rmdir(publicManifestDirectory); } catch { /* Keep a pre-existing or non-empty directory. */ }
    }
  }

  await runNpm(['exec', '--', 'opennextjs-cloudflare', 'deploy']);
  const deploymentCompletedAt = new Date().toISOString();
  console.log(`[Deploy] Production deployment completed successfully at ${deploymentCompletedAt}.`);

  await runAutomaticIndexNowFailOpen({ previousManifest, currentManifest, deploymentTimestamp: deploymentCompletedAt });
}

main().catch((error) => {
  console.error(`[Deploy] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
