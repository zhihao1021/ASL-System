const hashMap = {
    "announcement": 0,
    "account": 1,
    "login-history": 2,
    "new-leave": 3,
    "old-leave": 3,
    "authorize": 4,
    "query": 5,
    "other": 6,
    "setting": 7,
    "management": 8,
}

export function getHashIndex() {
    const hash = window.location.hash.slice(1);
    return hashMap[hash] || 0;
}
