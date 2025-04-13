declare module 'bcrypt' {
  /**
   * Generate a salt
   * @param rounds Number of rounds to use, defaults to 10 if omitted
   * @param callback Callback receiving the error, if any, and the generated salt
   */
  export function genSalt(rounds?: number): Promise<string>;
  export function genSalt(callback: (err: Error | null, salt: string) => void): void;
  export function genSalt(rounds: number, callback: (err: Error | null, salt: string) => void): void;

  /**
   * Hash data using a salt
   * @param data The data to be hashed
   * @param saltOrRounds The salt to be used or the number of rounds to generate a salt
   * @param callback Callback receiving the error, if any, and the hashed data
   */
  export function hash(data: string, saltOrRounds: string | number): Promise<string>;
  export function hash(data: string, saltOrRounds: string | number, callback: (err: Error | null, encrypted: string) => void): void;

  /**
   * Compare data with hash
   * @param data The data to be compared
   * @param encrypted The hash to be compared with
   * @param callback Callback receiving the error, if any, and the comparison result
   */
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function compare(data: string, encrypted: string, callback: (err: Error | null, same: boolean) => void): void;
} 