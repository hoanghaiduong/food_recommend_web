
export interface Tag {
  label: string;
}

export interface Task {
  id: string;
  title: string;
  tags: Tag[];
  bgColor: string; // Tailwind class
  progress?: number; // 0-100
  accuracy?: number; // For chatbot models
  version?: string; // For chatbot models
  descriptionType?: 'text' | 'checklist' | 'image' | 'note' | 'completed-checklist';
  checklistItems?: { text: string; completed: boolean }[];
  note?: string;
  imageUrl?: string;
  isCompleted?: boolean;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Trainer' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastActive: string;
  avatarUrl: string;
}

export interface BotProfile {
  id: string;
  name: string;
  description: string;
  version: string;
  accuracy: number;
  lastTrained: string;
  status: 'Active' | 'Training' | 'Deprecated';
}

export interface KnowledgeDoc {
  id: string;
  fileName: string;
  type: 'JSON' | 'PDF' | 'CSV' | 'TXT';
  size: string;
  status: 'Embedded' | 'Processing' | 'Error';
  uploadDate: string;
}
