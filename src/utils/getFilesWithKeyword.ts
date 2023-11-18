import fs from 'fs';
import path from 'path'

/**
 * Reads all files from a given directory and returns their paths.
 * @param {string} dirPath - The path to the directory.
 * @return {string[]} An array of file paths.
 */
export const readFilesFromDirectory = (dirPath: string): string[] => {
  try {
      const files = fs.readdirSync(dirPath);
      return files.map(file => path.join(dirPath, file));
  } catch (error) {
      console.error(`Error reading files from directory ${dirPath}:`, error);
      return [];
  }
}