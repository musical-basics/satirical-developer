export const LOADING_MESSAGES: string[] = [
  "> npm install @over-engineering/core",
  "> resolving 847 dependency conflicts...",
  "> bootstrapping Next.js for laundry management...",
  "> abstracting the socks array into a microservice...",
  "> deploying Kubernetes cluster for towel folding...",
  "> configuring reverse proxy for shirt organization...",
  "> initializing Redis cache for underwear state...",
  "> setting up Apache Kafka for chore event streaming...",
  "> writing 14 unit tests for a 2-line function...",
  "> arguing with Cursor about semicolons...",
  "> refactoring the dishwasher into a monorepo...",
  "> containerizing your procrastination with Docker...",
  "> provisioning AWS Lambda for trash takeout...",
  "> training a neural network to fold hoodies...",
  "> implementing OAuth2 for your sock drawer...",
  "> spinning up Terraform for bed-making infrastructure...",
  "> migrating your grocery list to PostgreSQL...",
  "> setting up CI/CD pipeline for vacuuming...",
  "> debugging race condition in the laundry queue...",
  "> optimizing GraphQL resolver for dish placement...",
  "> compiling TypeScript for 47 minutes...",
  "> stack overflow: 'how to automate touching grass'",
  "> generating 200-page RFC for taking out recycling...",
  "> scheduling standup to discuss mop architecture...",
  "> adding Sentry error tracking to toaster operations...",
];

/**
 * Returns a shuffled copy of the loading messages array.
 */
export function getShuffledMessages(): string[] {
  const shuffled = [...LOADING_MESSAGES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
