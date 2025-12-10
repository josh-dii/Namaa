const DB_STORAGE_KEY = "bankUsersDB";   // localStorage key
const DB_SOURCE_URL = "js/bankUsersDb.json";      // path to your JSON file

/**
 * Load DB from localStorage if exists,
 * otherwise load from Db.json and save to localStorage.
 */
export async function loadDatabase() {
  // Try to load from localStorage
  const stored = localStorage.getItem(DB_STORAGE_KEY);

  if (stored) {
    return JSON.parse(stored);
  }

  // If no local copy → load from Db.json (seed file)
  const response = await fetch(DB_SOURCE_URL);
  const db = await response.json();

  saveDatabase(db);
  return db;
}

/**
 * Save DB back to localStorage
 */
export function saveDatabase(db) {
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
}

/**
 * Get all users
 */
export async function getUsers() {
  const db = await loadDatabase();
  return db.bankUsers;
}

/**
 * Find single user by email
 */
export async function findUserByEmail(email) {
  const users = await getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Find user by ID
 */
export async function findUserById(id) {
  const users = await getUsers();
  return users.find(u => u.id === id);
}

/**
 * Add a new user, automatically updating the database.
 */
export async function addUser(newUser) {
  const db = await loadDatabase();

  // set id
  newUser.id = getNextUserId(db.bankUsers);

  db.bankUsers.push(newUser);
  saveDatabase(db);

  return newUser;
}

/**
 * Update a user object by email or ID
 */
export async function updateUser(identifier, updates) {
  const db = await loadDatabase();
  const users = db.bankUsers;

  const user = typeof identifier === "number"
    ? users.find(u => u.id === identifier)
    : users.find(u => u.email === identifier);

  if (!user) return null;

  Object.assign(user, updates);
  saveDatabase(db);

  return user;
}

/**
 * Replace entire user array (if needed)
 */
export async function replaceUsers(newUsersArray) {
  const db = await loadDatabase();
  db.bankUsers = newUsersArray;
  saveDatabase(db);
  return db.bankUsers;
}

/**
 * Reset database to the original Db.json state
 */
export async function resetDatabase() {
  const response = await fetch(DB_SOURCE_URL);
  const db = await response.json();
  saveDatabase(db);
  return db;
}

function getNextUserId(bankUsers) {
  if (bankUsers.length === 0) return 1;
    return bankUsers[bankUsers.length - 1].id + 1;
}
