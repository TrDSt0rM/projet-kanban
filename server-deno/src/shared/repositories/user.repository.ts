/**
 * @file server-deno/src/shared/repositories/user.repository.ts
 * @description This file contains the repository for the user-related operations.
 * @version 1.0.0
 * @date 2026-03-11
 */

import { SQLOutputValue } from "../types/interfaces-entities.ts";
import { MysqlClient } from "@db/mysql";

export class UserRepository {

    constructor(private db: MysqlClient) {}

    async findByPseudo(pseudo: string): Promise<Record<string, SQLOutputValue> | null> {
        const rows = await this.db.query(
            "SELECT * FROM APP_USER WHERE pseudo = ?", 
            [pseudo]
        );
        
        return (rows?.[0] as Record<string, SQLOutputValue>) || null;
    }
}