const documentationRules = {
  README: {
    points: 40,
    files: ["README.md", "README"]
  },

  LICENSE: {
    points: 20,
    files: ["LICENSE", "LICENSE.md"]
  },

  CONTRIBUTING: {
    points: 15,
    files: ["CONTRIBUTING.md", "CONTRIBUTING"]
  },

  CODE_OF_CONDUCT: {
    points: 10,
    files: ["CODE_OF_CONDUCT.md", "CODE_OF_CONDUCT"]
  },

  GITIGNORE: {
    points: 15,
    files: [".gitignore"]
  }
};

export const analyzeDocumentation = (files) => {
  const fileNames = new Set(
    files.map((file) => file.path.toLowerCase())
  );

  const documentation = {};

  let score = 0;

  for (const [name, rule] of Object.entries(documentationRules)) {
    const found = rule.files.some((file) =>
      fileNames.has(file.toLowerCase())
    );

    documentation[name] = found;

    if (found) {
      score += rule.points;
    }
  }

  return {
    score,
    documentation
  };
};