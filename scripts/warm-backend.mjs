// Wakes the blog API before `next build` starts, and refuses to let a build
// begin that the API cannot answer at all.
//
// Two separate problems, one script.
//
// The first is the cold start. The API runs on a host that sleeps when idle,
// and waking it takes the better part of a minute. Next gives each page a
// budget of its own, so whichever page happened to ask first wore that whole
// wait — and since retries re-run the same page, the same card could burn the
// budget three times and fail the deployment. Paying the wait once out here
// turns a per-page risk into one line in the build log.
//
// The second is what happens when the API is not slow but down. Every blog
// read falls back to empty by design, so the build would succeed and ship a
// site whose blog has no articles in it: the index empty, 80-odd URLs gone
// from the sitemap, every one of them a 404 for anyone who had the link. A
// failed build is a far better outcome than that, so this exits non-zero and
// says why. Set ALLOW_EMPTY_BLOG=1 to ship anyway, deliberately.
//
// Never fails for any other reason: if it cannot tell, it lets the build run.
const BACKEND_URL =
  process.env.BACKEND_URL ?? "https://project-help-backend.onrender.com";

/** Total time to spend waiting for the API to wake, and the gap between tries. */
const BUDGET_MS = 180_000;
const GAP_MS = 5_000;
/** One attempt's own limit. Comfortably longer than a cold start. */
const ATTEMPT_MS = 75_000;

const started = Date.now();
const elapsed = () => ((Date.now() - started) / 1000).toFixed(1);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function attempt() {
  const response = await fetch(`${BACKEND_URL}/blog`, {
    signal: AbortSignal.timeout(ATTEMPT_MS),
    headers: { accept: "application/json" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const body = await response.json();
  // An API that answers with something other than a list of posts is awake but
  // not useful, and the build would read it as an empty blog just the same.
  if (!Array.isArray(body)) throw new Error("expected an array of posts");
  return body.length;
}

let lastError = "none";
for (let tries = 1; Date.now() - started < BUDGET_MS; tries += 1) {
  try {
    const count = await attempt();
    console.log(
      `warm-backend: API awake after ${elapsed()}s on try ${tries}, ${count} posts.`,
    );
    process.exit(0);
  } catch (error) {
    lastError = error instanceof Error ? error.message : String(error);
    console.log(`warm-backend: try ${tries} failed after ${elapsed()}s (${lastError}).`);
    if (Date.now() - started + GAP_MS >= BUDGET_MS) break;
    await sleep(GAP_MS);
  }
}

if (process.env.ALLOW_EMPTY_BLOG === "1") {
  console.warn(
    `warm-backend: API unreachable after ${elapsed()}s (${lastError}), ` +
      `but ALLOW_EMPTY_BLOG=1 is set — building with no articles.`,
  );
  process.exit(0);
}

console.error(
  `\nwarm-backend: the blog API did not answer in ${elapsed()}s (last error: ${lastError}).\n` +
    `\n  ${BACKEND_URL}/blog\n` +
    `\nStopping here on purpose. Every blog read falls back to empty, so this\n` +
    `build would succeed and publish a site with no articles in it — an empty\n` +
    `index, and every article URL a 404 for anyone holding the link.\n` +
    `\nBring the API up and redeploy, or set ALLOW_EMPTY_BLOG=1 to ship without\n` +
    `the blog on purpose.\n`,
);
process.exit(1);
