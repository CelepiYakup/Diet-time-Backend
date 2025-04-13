import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'diet_time',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const initializeDatabase = async () => {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS meals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        calories INTEGER NOT NULL,
        protein FLOAT,
        carbs FLOAT,
        fat FLOAT,
        meal_date DATE NOT NULL,
        meal_time TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS body_measurements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        date DATE NOT NULL,
        weight FLOAT,
        bmi FLOAT,
        body_fat FLOAT,
        waist FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);


    await pool.query(`
      CREATE TABLE IF NOT EXISTS vital_signs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        date DATE NOT NULL,
        heart_rate INTEGER,
        blood_pressure VARCHAR(20),
        temperature FLOAT,
        respiratory_rate INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS blood_work (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        date DATE NOT NULL,
        glucose FLOAT,
        cholesterol FLOAT,
        hdl FLOAT,
        ldl FLOAT,
        triglycerides FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);


    await pool.query(`
      CREATE TABLE IF NOT EXISTS sleep_patterns (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        date DATE NOT NULL,
        duration FLOAT,
        quality VARCHAR(20),
        deep_sleep FLOAT,
        rem_sleep FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        category VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL DEFAULT 'My Goal',
        description TEXT,
        target_value FLOAT NOT NULL,
        current_value FLOAT NOT NULL,
        unit VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'in progress',
        start_date DATE DEFAULT CURRENT_DATE,
        target_date DATE NOT NULL,
        deadline DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);


    await pool.query(`
      CREATE TABLE IF NOT EXISTS meal_plans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        meal_id INTEGER REFERENCES meals(id) NOT NULL,
        day VARCHAR(20) NOT NULL,
        meal_time VARCHAR(20) NOT NULL,
        expiration_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    throw error;
  }
}; 