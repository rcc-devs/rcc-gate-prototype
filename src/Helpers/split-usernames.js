/**
 * Split nicks.
 *
 * @param  {string} nicks
 * @return {string[]}
 */
export default function splitUsernames (nicks) {
  return [...new Set(nicks.split(/\\|\//).map((s) => s.trim()).filter((s) => /\S/.test(s)))]
}
