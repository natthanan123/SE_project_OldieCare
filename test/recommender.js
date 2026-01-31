/*
  Recommender implementation commented out per request.

  Original behaviour (kept here for reference):
  - Primary sort: fewer queueCount (ascending)
  - Secondary sort: specialization match (exact match first), then yearsOfExperience

  The full implementation was removed from runtime and is preserved below as a comment.

  If you want to re-enable, copy the implementation back, or replace the stub below.

  --- Original implementation (commented) ---

  // Simple recommender for nurses
  // Primary sort: fewer queueCount (ascending)
  // Secondary sort: specialization match (exact match first), then yearsOfExperience

  /**
   * Recommend nurses ordered by queueCount, then specialization match, then experience.
   * @param {Array} nurses - array of nurse objects: { id, name, queueCount, specializations: [string], yearsOfExperience }
   * @param {String} requiredSpecialization - specialization needed (e.g., 'Elderly Care')
   * @param {Number} maxResults - max number of results to return
   * @returns {Array} sorted nurse objects
   */
  // function recommendNurses(nurses, requiredSpecialization, maxResults = 5) {
  //   if (!Array.isArray(nurses)) return [];
  //
  //   const specLower = (requiredSpecialization || '').toLowerCase();
  //
  //   // Compute score and sort
  //   const scored = nurses.map(n => {
  //     const queue = typeof n.queueCount === 'number' ? n.queueCount : Infinity;
  //
  //     const specs = Array.isArray(n.specializations) ? n.specializations : [];
  //     // specialization match score: exact match = 2, includes substring = 1, else 0
  //     let specScore = 0;
  //     for (const s of specs) {
  //       if (!s) continue;
  //       const sl = s.toLowerCase();
  //       if (sl === specLower && specLower !== '') {
  //         specScore = Math.max(specScore, 2);
  //         break;
  //       }
  //       if (sl.includes(specLower) && specLower !== '') {
  //         specScore = Math.max(specScore, 1);
  //       }
  //     }
  //
  //     // experience fallback
  //     const exp = typeof n.yearsOfExperience === 'number' ? n.yearsOfExperience : 0;
  //
  //     return Object.assign({}, n, { _score: { queue, specScore, exp } });
  //   });
  //
  //   scored.sort((a, b) => {
  //     // Primary: fewer queue
  //     if (a._score.queue !== b._score.queue) return a._score.queue - b._score.queue;
  //     // Secondary: higher specScore first
  //     if (a._score.specScore !== b._score.specScore) return b._score.specScore - a._score.specScore;
  //     // Tertiary: higher experience first
  //     if (a._score.exp !== b._score.exp) return b._score.exp - a._score.exp;
  //     // Finally stable by name
  //     return (a.name || '').localeCompare(b.name || '');
  //   });
  //
  //   return scored.slice(0, maxResults).map(({ _score, ...rest }) => rest);
  // }

*/

// Export a stub recommending function to avoid runtime errors elsewhere.
function recommendNurses() {
  throw new Error('recommendNurses is currently disabled/commented out.');
}

module.exports = {
  recommendNurses
};
