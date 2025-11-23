
export type LogLevel = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'SQL';

export interface LogEntry {
  id: string;
  timestamp: string;
  type: LogLevel;
  message: string;
}

export interface SetupFormData {
  // Step 1: Backend
  apiBaseUrl: string;
  wsUrl: string;
  // Step 2: Database
  dbType: string;
  dbHost: string;
  dbPort: string;
  dbUser: string;
  dbPass: string;
  dbName: string;
  // Step 3: Vector
  vectorProvider: string;
  vectorHost: string;
  vectorKey: string;
  vectorCollection: string;
  // Step 4: LLM
  llmProvider: string;
  llmKey: string;
  llmModel: string;
  // Step 5: General
  botName: string;
  welcomeMessage: string;
  language: string;
}

export interface Step0Payload {
  admin_secret_key: string;
}

export interface Step1Payload {
  api_base_url: string;
  websocket_url: string;
}

export interface Step2Payload {
  db_type: string;
  host: string;
  port: string;
  username: string;
  password?: string;
  db_name: string;
}

export interface MigrationStatus {
  status: 'clean' | 'dirty' | 'checking' | 'migrated';
  tables: string[];
}

export interface VectorConfig {
  provider: string;
  host: string;
  api_key?: string;
  collection_name: string;
}

export interface LLMConfig {
  provider: string;
  api_key: string;
  model_name: string;
}

export interface GeneralConfig {
  bot_name: string;
  welcome_message: string;
  language: string;
}
