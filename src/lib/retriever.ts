import { projects } from "./data";

export function retrieveRelevantProjects(query: string, topK: number = 3) {
  // Simple tokenization excluding common stop words for basic retrieval
  const stopWords = new Set(["what", "is", "your", "work", "on", "explain", "how", "the", "in", "of", "and", "a", "to", "for", "with"]);
  const queryTokens = query
    .toLowerCase()
    .split(/\W+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));

  if (queryTokens.length === 0) {
    // Fallback if no meaningful tokens: returning top 3 projects
    return projects.slice(0, 3);
  }

  const scored = projects.map((project) => {
    let score = 0;
    const titleLower = project.title.toLowerCase();
    const descLower = project.description.toLowerCase();
    const titleTokens = titleLower.split(/\W+/);
    const descTokens = descLower.split(/\W+/);

    queryTokens.forEach((token) => {
      // High score for exact word match in title
      if (titleTokens.includes(token)) score += 3;
      // Medium score for exact word match in description
      if (descTokens.includes(token)) score += 2;
      // Partial match in title
      if (titleLower.includes(token)) score += 1;
      // Partial match in description
      if (descLower.includes(token)) score += 0.5;
    });

    return { project, score };
  });

  // Filter out zero scores if possible, sort and slice
  return scored
    .filter((res) => res.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((res) => res.project)
    .slice(0, topK);
}
