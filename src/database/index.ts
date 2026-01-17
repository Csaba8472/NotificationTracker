import * as SQLite from 'expo-sqlite';

export interface NotifInfo {
  id?: number;
  packageName: string;
  heading: string;
  bodyText: string;
  time: number;
}

class NotificationDatabase {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync('notif_database.db');
    
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS notif_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        packageName TEXT NOT NULL,
        heading TEXT NOT NULL,
        bodyText TEXT NOT NULL,
        time INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_packageName ON notif_data(packageName);
      CREATE INDEX IF NOT EXISTS idx_time ON notif_data(time DESC);
    `);
  }

  async addNotification(notification: Omit<NotifInfo, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.runAsync(
      'INSERT INTO notif_data (packageName, heading, bodyText, time) VALUES (?, ?, ?, ?)',
      [notification.packageName, notification.heading, notification.bodyText, notification.time]
    );
    
    return result.lastInsertRowId;
  }

  async getAllNotifications(): Promise<NotifInfo[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const rows = await this.db.getAllAsync<NotifInfo>(
      'SELECT * FROM notif_data ORDER BY time DESC'
    );
    
    return rows;
  }

  async getLastFewNotifications(limit: number = 10): Promise<NotifInfo[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const rows = await this.db.getAllAsync<NotifInfo>(
      'SELECT * FROM notif_data ORDER BY time DESC LIMIT ?',
      [limit]
    );
    
    return rows;
  }

  async getUniquePackageNames(): Promise<string[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const rows = await this.db.getAllAsync<{ packageName: string }>(
      'SELECT DISTINCT packageName FROM notif_data ORDER BY packageName ASC'
    );
    
    return rows.map(row => row.packageName);
  }

  async getAppNotifications(packageName: string): Promise<NotifInfo[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const rows = await this.db.getAllAsync<NotifInfo>(
      'SELECT * FROM notif_data WHERE packageName = ? ORDER BY time DESC',
      [packageName]
    );
    
    return rows;
  }

  async getAppNotificationCount(packageName: string): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(id) as count FROM notif_data WHERE packageName = ?',
      [packageName]
    );
    
    return result?.count ?? 0;
  }

  async getAppNotificationCountToday(packageName: string): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStartTimestamp = today.getTime();
    
    const result = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(id) as count FROM notif_data WHERE packageName = ? AND time > ?',
      [packageName, todayStartTimestamp]
    );
    
    return result?.count ?? 0;
  }

  async searchNotifications(query: string, packageName?: string): Promise<NotifInfo[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const searchPattern = `%${query}%`;
    
    if (packageName) {
      const rows = await this.db.getAllAsync<NotifInfo>(
        `SELECT * FROM notif_data 
         WHERE packageName = ? AND (heading LIKE ? OR bodyText LIKE ?)
         ORDER BY time DESC`,
        [packageName, searchPattern, searchPattern]
      );
      return rows;
    }
    
    const rows = await this.db.getAllAsync<NotifInfo>(
      `SELECT * FROM notif_data 
       WHERE heading LIKE ? OR bodyText LIKE ?
       ORDER BY time DESC`,
      [searchPattern, searchPattern]
    );
    
    return rows;
  }
}

export const database = new NotificationDatabase();
