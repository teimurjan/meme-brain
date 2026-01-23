import type { LLMGeneratedContent } from '../../shared/types';
import { config } from '../config';

type ValidationResult =
  | { valid: true; content: LLMGeneratedContent }
  | { valid: false; error: string };

const VALID_OPTION_IDS = ['A', 'B', 'C'] as const;

export function validateLLMOutput(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, error: 'Output is not an object' };
  }

  const content = raw as Record<string, unknown>;

  // Check situation
  if (typeof content.situation !== 'string') {
    return { valid: false, error: 'Missing or invalid situation' };
  }
  if (content.situation.length > config.content.maxSituationLength) {
    return { valid: false, error: `Situation exceeds ${config.content.maxSituationLength} chars` };
  }

  // Check options array
  if (!Array.isArray(content.options) || content.options.length !== 3) {
    return { valid: false, error: 'Options must be an array of exactly 3 items' };
  }

  const seenIds = new Set<string>();
  const archetypeIds: string[] = [];

  for (const option of content.options) {
    if (!option || typeof option !== 'object') {
      return { valid: false, error: 'Invalid option object' };
    }

    const opt = option as Record<string, unknown>;

    // Validate option id
    if (!VALID_OPTION_IDS.includes(opt.id as (typeof VALID_OPTION_IDS)[number])) {
      return { valid: false, error: `Invalid option id: ${opt.id}` };
    }
    if (seenIds.has(opt.id as string)) {
      return { valid: false, error: `Duplicate option id: ${opt.id}` };
    }
    seenIds.add(opt.id as string);

    // Validate option text
    if (typeof opt.text !== 'string' || !opt.text) {
      return { valid: false, error: 'Missing or invalid option text' };
    }
    if (opt.text.length > config.content.maxOptionLength) {
      return { valid: false, error: `Option text exceeds ${config.content.maxOptionLength} chars` };
    }

    // Validate archetypeId
    if (typeof opt.archetypeId !== 'string' || !opt.archetypeId) {
      return { valid: false, error: 'Missing or invalid archetypeId' };
    }
    archetypeIds.push(opt.archetypeId);
  }

  // Check archetypes object
  if (!content.archetypes || typeof content.archetypes !== 'object') {
    return { valid: false, error: 'Missing or invalid archetypes object' };
  }

  const archetypes = content.archetypes as Record<string, unknown>;

  // Validate that all referenced archetypes exist
  for (const id of archetypeIds) {
    if (!(id in archetypes)) {
      return { valid: false, error: `Archetype not found: ${id}` };
    }

    const archetype = archetypes[id] as Record<string, unknown>;

    if (typeof archetype.label !== 'string' || !archetype.label) {
      return { valid: false, error: `Missing label for archetype: ${id}` };
    }
    if (archetype.label.length > config.content.maxArchetypeLabelLength) {
      return {
        valid: false,
        error: `Archetype label exceeds ${config.content.maxArchetypeLabelLength} chars: ${id}`,
      };
    }

    if (typeof archetype.blurb !== 'string' || !archetype.blurb) {
      return { valid: false, error: `Missing blurb for archetype: ${id}` };
    }

    if (typeof archetype.shareText !== 'string' || !archetype.shareText) {
      return { valid: false, error: `Missing shareText for archetype: ${id}` };
    }
  }

  // Content safety check
  const safetyResult = checkContentSafety(content);
  if (!safetyResult.safe) {
    return { valid: false, error: `Content safety violation: ${safetyResult.reason}` };
  }

  return { valid: true, content: content as unknown as LLMGeneratedContent };
}

function checkContentSafety(content: Record<string, unknown>): { safe: boolean; reason?: string } {
  const textsToCheck: string[] = [];

  if (typeof content.situation === 'string') {
    textsToCheck.push(content.situation);
  }

  if (Array.isArray(content.options)) {
    for (const opt of content.options) {
      if (opt && typeof opt === 'object' && 'text' in opt) {
        textsToCheck.push(String(opt.text));
      }
    }
  }

  if (content.archetypes && typeof content.archetypes === 'object') {
    for (const archetype of Object.values(content.archetypes)) {
      if (archetype && typeof archetype === 'object') {
        const arch = archetype as Record<string, unknown>;
        if (typeof arch.label === 'string') textsToCheck.push(arch.label);
        if (typeof arch.blurb === 'string') textsToCheck.push(arch.blurb);
        if (typeof arch.shareText === 'string') textsToCheck.push(arch.shareText);
      }
    }
  }

  for (const text of textsToCheck) {
    const lowerText = text.toLowerCase();
    for (const word of config.safety.hardDenylist) {
      if (lowerText.includes(word.toLowerCase())) {
        return { safe: false, reason: `Contains disallowed word: ${word}` };
      }
    }
  }

  return { safe: true };
}
