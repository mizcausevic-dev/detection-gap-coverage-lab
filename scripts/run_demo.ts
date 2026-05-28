import { coverageGaps, detectionLane, summary } from "../src/services/detectionGapCoverageLabService.js";

console.log("detection-gap-coverage-lab demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(`lane packets: ${detectionLane().length}`);
console.log(`coverage gaps: ${coverageGaps().length}`);
