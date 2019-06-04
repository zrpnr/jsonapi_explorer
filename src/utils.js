export function extract(obj, path, dflt) {
    const $n = {};
    return path.split('.').reduce((obj, key) => (obj||$n)[key], obj) || dflt;
}

// If entry not found in set, return a new set with only that entry.
export function clearSetEntry(set, entry) {
    return set.has(entry) ? set : new Set([entry]);
}

export function hasSetEntry(set, entry) {
    return set.has(entry);
}

export function toggleSetEntry(set, entry) {
    if (set.has(entry)) {
        set.delete(entry);
    } else {
        set.add(entry);
    }
}
