import { Conflict } from './conflict';

export const allConflictsFrom = (code: string): Conflict[] => {
  const matches = code.matchAll(
    /<<<<<<< ?(.*)\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>> ?(.*)/gm
  );
  return [...matches].map(
    ([, currentName, current, incoming, incomingName]) =>
      new Conflict(current || null, incoming || null, currentName, incomingName)
  );
};
