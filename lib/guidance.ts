import type { GuidanceQueryAnalysis } from "@/lib/types";

type ThemeRule = {
  themes: string[];
  intent: string;
  words: string[];
};

const THEME_RULES: ThemeRule[] = [
  {
    themes: ["épreuve", "patience", "espoir"],
    intent: "réconfort",
    words: [
      "triste",
      "tristesse",
      "decourage",
      "decouragement",
      "mal",
      "perdu",
      "perdue",
      "seul",
      "seule",
      "fatigue",
      "fatiguee",
      "difficile",
      "epreuve",
      "souffre",
      "souffrance",
    ],
  },
  {
    themes: ["repentir", "pardon", "miséricorde"],
    intent: "retour à Allah",
    words: [
      "peche",
      "peches",
      "repentir",
      "pardon",
      "pardonne",
      "pardonnee",
      "culpabilite",
      "regret",
      "tawba",
    ],
  },
  {
    themes: ["peur", "confiance en Allah", "apaisement"],
    intent: "apaisement",
    words: [
      "peur",
      "angoisse",
      "angoisse",
      "anxieux",
      "anxieuse",
      "anxiete",
      "avenir",
      "inquiet",
      "inquiete",
      "inquietude",
    ],
  },
  {
    themes: ["gratitude", "bienfaits", "rappel"],
    intent: "remerciement",
    words: ["remercier", "gratitude", "reconnaissant", "reconnaissante", "bienfaits"],
  },
  {
    themes: ["patience", "épreuve", "constance"],
    intent: "compréhension",
    words: ["patience", "patienter", "sabr", "attendre", "endurer", "constance"],
  },
  {
    themes: ["miséricorde", "pardon", "espérance"],
    intent: "compréhension",
    words: ["misericorde", "rahma", "compassion", "clemence", "clemence"],
  },
  {
    themes: ["prière", "rappel", "apaisement"],
    intent: "orientation",
    words: ["priere", "salat", "doua", "invocation", "adoration"],
  },
];

const SENSITIVE_WORDS = [
  "suicide",
  "me suicider",
  "mourir",
  "envie de mourir",
  "disparaitre",
  "disparaître",
  "je veux mourir",
  "me faire du mal",
  "plus envie de vivre",
  "je n en peux plus",
  "je n'en peux plus",
  "depression severe",
  "dépression sévère",
];

export const DEFAULT_GUIDANCE_SUGGESTIONS = [
  "Je traverse une épreuve",
  "Je cherche la patience",
  "Je veux comprendre le repentir",
  "Je me sens perdu",
  "J’ai besoin d’espoir",
  "Je veux comprendre la miséricorde d’Allah",
];

const EXPLORE_BY_THEME: Record<string, string> = {
  épreuve: "Versets sur la patience dans l’épreuve",
  patience: "Versets sur la patience",
  espoir: "Versets sur l’espoir",
  repentir: "Versets sur le repentir",
  pardon: "Versets sur le pardon",
  miséricorde: "Versets sur la miséricorde d’Allah",
  peur: "Versets sur la peur et l’apaisement",
  "confiance en Allah": "Versets sur la confiance en Allah",
  gratitude: "Versets sur la gratitude",
  prière: "Versets sur la prière",
  apaisement: "Versets sur l’apaisement",
};

export function normalizeFrenchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(values: string[]) {
  return [...new Set(values)].filter(Boolean);
}

export function detectFrenchThemes(query: string): GuidanceQueryAnalysis {
  const normalized = normalizeFrenchText(query);
  const matchedRules = THEME_RULES.filter((rule) =>
    rule.words.some((word) => normalized.includes(normalizeFrenchText(word))),
  );
  const isSensitive = SENSITIVE_WORDS.some((word) =>
    normalized.includes(normalizeFrenchText(word)),
  );

  const themes = unique(matchedRules.flatMap((rule) => rule.themes)).slice(0, 5);
  const intent = matchedRules[0]?.intent ?? "exploration";

  if (isSensitive && themes.length === 0) {
    return {
      themes: ["apaisement", "espoir", "protection"],
      intent: "soutien urgent",
      isSensitive: true,
    };
  }

  return {
    themes: themes.length > 0 ? themes : ["recherche par le sens"],
    intent,
    isSensitive,
  };
}

export function getReasonForThemes(themes: string[]) {
  const normalizedThemes = themes.map((theme) => normalizeFrenchText(theme));

  if (normalizedThemes.includes("epreuve") || normalizedThemes.includes("patience")) {
    return "Ce passage est lié à la difficulté, à la patience et au soulagement.";
  }

  if (normalizedThemes.includes("repentir") || normalizedThemes.includes("pardon")) {
    return "Ce passage est lié au pardon, au retour à Allah et à la miséricorde.";
  }

  if (normalizedThemes.includes("peur") || normalizedThemes.includes("apaisement")) {
    return "Ce passage peut être exploré pour les thèmes de la confiance, de l’apaisement et de la protection.";
  }

  if (normalizedThemes.includes("gratitude") || normalizedThemes.includes("bienfaits")) {
    return "Ce passage est lié au rappel des bienfaits et à la reconnaissance.";
  }

  if (normalizedThemes.includes("misericorde")) {
    return "Ce passage peut être exploré pour le thème de la miséricorde.";
  }

  return "Ce passage ressort comme pertinent par proximité sémantique avec votre recherche.";
}

export function getExploreMoreQueries(themes: string[]) {
  const fromThemes = themes
    .map((theme) => EXPLORE_BY_THEME[theme])
    .filter((value): value is string => Boolean(value));

  return unique([
    ...fromThemes,
    "Versets sur la patience",
    "Versets sur l’espoir",
    "Versets sur la confiance en Allah",
    "Versets sur la miséricorde",
  ]).slice(0, 6);
}

export function getSuggestedReformulations(themes: string[]) {
  const normalizedThemes = themes.map((theme) => normalizeFrenchText(theme));

  if (normalizedThemes.includes("repentir") || normalizedThemes.includes("pardon")) {
    return [
      "Je cherche des versets sur le repentir et le pardon",
      "Je veux comprendre la miséricorde d’Allah",
      "Je ressens de la culpabilité et je cherche de l’espoir",
    ];
  }

  if (normalizedThemes.includes("peur") || normalizedThemes.includes("apaisement")) {
    return [
      "Je cherche des versets pour apaiser ma peur",
      "Je veux renforcer ma confiance en Allah",
      "Je suis inquiet pour l’avenir",
    ];
  }

  if (normalizedThemes.includes("gratitude")) {
    return [
      "Je cherche des versets sur la gratitude",
      "Je veux méditer sur les bienfaits d’Allah",
      "Je veux apprendre à remercier Allah",
    ];
  }

  return [
    "Je cherche des versets sur la patience dans l’épreuve",
    "Je veux retrouver de l’espoir",
    "Je veux comprendre le soulagement après la difficulté",
  ];
}
