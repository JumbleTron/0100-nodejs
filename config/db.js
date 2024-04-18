import sqlite3 from 'sqlite3';

export const sqlLite = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the database.');
  }
});

export const getCategoriesList = async (db) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM category', (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
};

export const getPostsList = async (db, page = 1, limit = 2) => {
  const offset = (page - 1) * limit;
  const totalPosts = new Promise((resolve, reject) => {
    db.prepare('SELECT COUNT(*) count FROM category').get((err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row.count);
    });
  });
  const posts = new Promise((resolve, reject) => {
    db.all(
      `SELECT post.*, name FROM post LEFT JOIN category ON category_id = category.id ORDER BY id ASC LIMIT ${limit} OFFSET ${offset}`,
      (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      },
    );
  });

  return Promise.all([totalPosts, posts]);
};

export const createCategoryTable = (db) => {
  db.exec(`CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL UNIQUE
	);`);
};
