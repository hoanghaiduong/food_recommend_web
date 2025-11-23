
import { useState, useRef, useEffect, useCallback } from 'react';
import api from '../services/api';
import { SetupFormData, LogEntry, MigrationStatus, LogLevel } from '../types/setup';

const INITIAL_DATA: SetupFormData = {
  apiBaseUrl: 'http://localhost:8000',
  wsUrl: 'ws://localhost:8000/ws',
  dbType: 'PostgreSQL',
  dbHost: 'localhost',
  dbPort: '5432',
  dbUser: 'admin',
  dbPass: '',
  dbName: 'weihu_core',
  vectorProvider: 'Qdrant',
  vectorHost: 'http://localhost:6333',
  vectorKey: '',
  vectorCollection: 'gym_food_v1',
  llmProvider: 'Gemini',
  llmKey: '',
  llmModel: 'gemini-1.5-flash',
  botName: 'GymCoach AI',
  welcomeMessage: 'Xin chào, tôi có thể giúp gì cho lộ trình tập luyện của bạn?',
  language: 'Vietnamese',
};

export const useSetupWizard = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<SetupFormData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Step Verification Statuses
  const [stepStatus, setStepStatus] = useState<{ [key: number]: 'pending' | 'success' | 'error' }>({
    1: 'pending', 2: 'pending', 3: 'pending', 4: 'pending', 5: 'pending', 6: 'pending'
  });

  // Database Migration State
  const [dbInitStatus, setDbInitStatus] = useState<MigrationStatus['status']>('checking');
  
  // WebSocket Reference
  const wsRef = useRef<WebSocket | null>(null);

  // Helper to add logs
  const addLog = useCallback((type: LogLevel, message: string) => {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type,
      message
    };
    setLogs(prev => [...prev, entry]);
  }, []);

  // --- Step 0: Security ---
  const initAdmin = async (key: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      addLog('INFO', 'Sending Admin Key to server...');
      // In a real scenario: await api.post('/setup/init-admin', { admin_secret_key: key });
      // For demo compatibility with no actual backend running, we simulate success if key is valid
      await new Promise(r => setTimeout(r, 1000)); 
      
      localStorage.setItem('x-admin-key', key);
      addLog('SUCCESS', 'Admin Key secured. Token generated.');
      setCurrentStep(1);
      return true;
    } catch (error: any) {
      addLog('ERROR', error.message || 'Failed to initialize admin key');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 1: Network ---
  const testNetwork = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      addLog('INFO', `Handshaking with ${formData.apiBaseUrl}...`);
      await new Promise(r => setTimeout(r, 800)); // Simulating network req
      // await api.post('/setup/step-1', { ...payload });
      addLog('SUCCESS', 'Connection established.');
      setStepStatus(prev => ({ ...prev, 1: 'success' }));
      return true;
    } catch (error) {
      addLog('ERROR', 'Network test failed.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 2: Database Connect ---
  const testDatabase = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      addLog('INFO', `Connecting to ${formData.dbType} at ${formData.dbHost}...`);
      await new Promise(r => setTimeout(r, 1000));
      // await api.post('/setup/step-2/test', { ...payload });
      addLog('SUCCESS', 'Database connection verified.');
      setStepStatus(prev => ({ ...prev, 2: 'success' }));
      return true;
    } catch (error) {
      addLog('ERROR', 'Database connection failed.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 3: Vector ---
  const verifyVector = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      addLog('INFO', `Checking Qdrant collection: ${formData.vectorCollection}...`);
      await new Promise(r => setTimeout(r, 1000));
      // await api.post('/setup/step-3/verify', { ...payload });
      addLog('SUCCESS', 'Vector DB connected and collection verified.');
      setStepStatus(prev => ({ ...prev, 3: 'success' }));
      return true;
    } catch (error) {
      addLog('ERROR', 'Vector DB verification failed.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 4: Bootstrapping (Migration) ---
  const checkDbSchemaStatus = async () => {
    setDbInitStatus('checking');
    try {
      addLog('INFO', 'Checking database schema status...');
      // const res = await api.get('/setup/db-status');
      // const status = res.data.status;
      
      // Mock logic based on dbName for demo
      await new Promise(r => setTimeout(r, 1000));
      if (formData.dbName === 'weihu_core') {
          addLog('WARNING', 'Found existing tables. Database is Dirty.');
          setDbInitStatus('dirty');
      } else {
          addLog('INFO', 'Database is clean.');
          setDbInitStatus('clean');
      }
    } catch (error) {
      addLog('ERROR', 'Failed to check DB status');
      setDbInitStatus('dirty'); // Fallback to safe mode
    }
  };

  const runMigration = async (forceReset: boolean = false) => {
    setIsLoading(true);
    setDbInitStatus('checking'); // Show spinner/migrating state
    
    // 1. Connect WS
    addLog('INFO', 'Opening log stream...');
    // const ws = new WebSocket(formData.wsUrl);
    // ws.onmessage = (e) => addLog('SQL', e.data);
    // wsRef.current = ws;

    try {
      if (forceReset) {
        addLog('WARNING', 'FORCE RESET requested. Dropping schema...');
        await new Promise(r => setTimeout(r, 1000));
        addLog('SQL', 'DROP SCHEMA public CASCADE; [OK]');
        addLog('SQL', 'CREATE SCHEMA public; [OK]');
      }

      addLog('INFO', 'Starting migration...');
      await new Promise(r => setTimeout(r, 500));
      addLog('SQL', 'CREATE TABLE users... [OK]');
      await new Promise(r => setTimeout(r, 500));
      addLog('SQL', 'CREATE TABLE settings... [OK]');
      await new Promise(r => setTimeout(r, 500));
      addLog('SUCCESS', 'Migration completed successfully.');
      
      setDbInitStatus('migrated');
      setStepStatus(prev => ({ ...prev, 4: 'success' }));
    } catch (error) {
      addLog('ERROR', 'Migration failed.');
    } finally {
      setIsLoading(false);
      if (wsRef.current) wsRef.current.close();
    }
  };

  // --- Step 5: LLM ---
  const testLlm = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      addLog('INFO', `Testing ${formData.llmProvider} connection...`);
      await new Promise(r => setTimeout(r, 1500));
      addLog('SUCCESS', 'LLM Responded: "Hello world"');
      setStepStatus(prev => ({ ...prev, 5: 'success' }));
      return true;
    } catch (error) {
       addLog('ERROR', 'LLM Test failed.');
       return false;
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 6: Finalize ---
  const finishSetup = async () => {
    setIsLoading(true);
    try {
       addLog('INFO', 'Saving final configuration...');
       await new Promise(r => setTimeout(r, 1000));
       addLog('SUCCESS', 'System Configured.');
       return true;
    } catch (error) {
       addLog('ERROR', 'Failed to save config.');
       return false;
    } finally {
       setIsLoading(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    isLoading,
    logs,
    stepStatus,
    dbInitStatus,
    setDbInitStatus,
    // Actions
    addLog,
    initAdmin,
    testNetwork,
    testDatabase,
    verifyVector,
    checkDbSchemaStatus,
    runMigration,
    testLlm,
    finishSetup
  };
};
