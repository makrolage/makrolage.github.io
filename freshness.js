/* Snapshot age is checked on the reader's clock, even when publishing stops. */
(function(root) {
  function snapshotFreshness(manifest, now = Date.now()) {
    const built = Date.parse(manifest?.generated_at);
    const until = Date.parse(manifest?.valid_until);
    const verified = manifest && "data_verified_at" in manifest ? Date.parse(manifest.data_verified_at) : built;
    if (!Number.isFinite(built) || !Number.isFinite(until) || !Number.isFinite(verified) || until <= built || built > now + 300000 || verified > now + 300000)
      return {status: "UNKNOWN", label: "Aktualitet kan inte verifieras"};
    return now > Math.min(until, verified + 96 * 3600000)
      ? {status: "EXPIRED", label: "Publiceringen är föråldrad — bedömningen kan ha ändrats"}
      : {status: "CURRENT", label: "Publiceringen är inom aktualitetsgränsen"};
  }
  root.snapshotFreshness = snapshotFreshness;
  if (typeof module !== "undefined") module.exports = {snapshotFreshness};
})(globalThis);
