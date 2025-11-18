import Database from "../Database/index.js";

let { users } = Database;

export function createUser(user) {
  const newUser = { ...user, _id: Date.now().toString() };
  users = [...users, newUser];
  return newUser;
}

export function findAllUsers() {
  return users;
}

export function findUserById(userId) {
  return users.find((user) => user._id === userId);
}

export function findUserByUsername(username) {
  return users.find((user) => user.username === username);
}

export function findUserByCredentials(username, password) {
  return users.find((user) => user.username === username && user.password === password);
}

export const updateUser = (userId, user) => {
  users = users.map((u) => (u._id === userId ? user : u));
  return user;
};

export function deleteUser(userId) {
  users = users.filter((u) => u._id !== userId);
}