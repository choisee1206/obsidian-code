/**
 * ObsidianCode - Context Utilities
 *
 * Current note and context file formatting for prompts.
 */

const CURRENT_NOTE_PREFIX_REGEX = /^<current_note>\n[\s\S]*?<\/current_note>\n\n/;

/** Notes longer than this are sent as a path reference only (the agent can Read them). */
const MAX_INLINE_NOTE_CHARS = 100_000;

/**
 * Formats current note in XML format.
 * When `content` is provided (and not too large), the note body is inlined after the
 * path so the agent sees it immediately without a Read step. Otherwise only the path
 * is sent (the agent can Read it on demand).
 */
export function formatCurrentNote(notePath: string, content?: string): string {
  if (content && content.length <= MAX_INLINE_NOTE_CHARS) {
    return `<current_note>\n${notePath}\n\n${content}\n</current_note>`;
  }
  return `<current_note>\n${notePath}\n</current_note>`;
}

/** Prepends current note to a prompt. */
export function prependCurrentNote(prompt: string, notePath: string, content?: string): string {
  return `${formatCurrentNote(notePath, content)}\n\n${prompt}`;
}

/** Strips current note prefix from a prompt. */
export function stripCurrentNotePrefix(prompt: string): string {
  return prompt.replace(CURRENT_NOTE_PREFIX_REGEX, '');
}

// ============================================
// Context Files (for InlineEditService)
// ============================================

/** Formats context files in XML format (used by inline edit). */
function formatContextFilesLine(files: string[]): string {
  return `<context_files>\n${files.join(', ')}\n</context_files>`;
}

/** Prepends context files to a prompt (used by inline edit). */
export function prependContextFiles(prompt: string, files: string[]): string {
  return `${formatContextFilesLine(files)}\n\n${prompt}`;
}
