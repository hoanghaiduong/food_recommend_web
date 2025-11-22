
import { Column, User, BotProfile, KnowledgeDoc } from './types';

export const CHATBOT_DATA: Column[] = [
  {
    id: 'data-prep',
    title: 'Data Preparation',
    tasks: [
      {
        id: 't1',
        title: 'Collect CS dataset v2.0',
        tags: [{ label: '#dataset' }, { label: '#crawling' }],
        bgColor: 'bg-pastel-blue',
        progress: 40,
        accuracy: 0,
        version: 'v2.0',
        descriptionType: 'text',
        note: 'Source: Support Tickets 2023'
      },
      {
        id: 't2',
        title: 'Clean & Tokenize Medical Data',
        tags: [{ label: '#medical' }, { label: '#nlp' }],
        bgColor: 'bg-pastel-purple',
        progress: 15,
        accuracy: 0,
        version: 'v1.1',
        descriptionType: 'checklist',
        checklistItems: [
            { text: 'Remove PII', completed: true },
            { text: 'Normalize formatting', completed: true },
            { text: 'Tokenize entities', completed: false },
        ],
      },
    ],
  },
  {
    id: 'training',
    title: 'Model Training',
    tasks: [
      {
        id: 'p1',
        title: 'Sales Bot - Intent Classification',
        tags: [{ label: '#bert' }, { label: '#intent' }],
        bgColor: 'bg-pastel-orange',
        progress: 75,
        accuracy: 82,
        version: 'v3.4',
        descriptionType: 'image',
        imageUrl: 'https://picsum.photos/400/200?grayscale',
        note: 'ETA: 4 hours remaining'
      },
      {
        id: 'p2',
        title: 'Fine-tune GPT-4o for Legal Docs',
        tags: [{ label: '#llm' }, { label: '#finetune' }],
        bgColor: 'bg-pastel-green',
        progress: 40,
        accuracy: 65,
        version: 'v0.9',
        descriptionType: 'text',
      },
    ],
  },
  {
    id: 'eval',
    title: 'Evaluation',
    tasks: [
      {
        id: 'r1',
        title: 'Customer Service Bot QA Test',
        tags: [{ label: '#qa' }, { label: '#automated' }],
        bgColor: 'bg-pastel-pink',
        accuracy: 94,
        version: 'v2.1',
        descriptionType: 'text',
        note: 'Passed 940/1000 test cases'
      },
      {
        id: 'r2',
        title: 'Sentiment Analysis Model Benchmarking',
        tags: [{ label: '#benchmark' }],
        bgColor: 'bg-pastel-blue',
        accuracy: 88,
        version: 'v1.0',
        descriptionType: 'text',
      },
    ],
  },
  {
    id: 'deployed',
    title: 'Deployed',
    tasks: [
      {
        id: 'd1',
        title: 'General FAQ Bot',
        tags: [{ label: '#production' }, { label: '#live' }],
        bgColor: 'bg-pastel-cyan',
        accuracy: 98,
        version: 'v4.2',
        descriptionType: 'completed-checklist',
        checklistItems: [
            { text: 'Load testing', completed: true },
            { text: 'Security audit', completed: true },
            { text: 'API integration', completed: true },
            { text: 'Deployed to Edge', completed: true },
        ]
      },
    ],
  },
];

export const USER_DATA: User[] = [
  {
    id: 'u1',
    name: 'Brooklyn Simmons',
    email: 'simmons@example.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2 mins ago',
    avatarUrl: 'https://picsum.photos/id/65/100/100'
  },
  {
    id: 'u2',
    name: 'Cody Fisher',
    email: 'cody.fisher@example.com',
    role: 'Trainer',
    status: 'Active',
    lastActive: '1 hour ago',
    avatarUrl: 'https://picsum.photos/id/64/100/100'
  },
  {
    id: 'u3',
    name: 'Esther Howard',
    email: 'esther.howard@example.com',
    role: 'Viewer',
    status: 'Inactive',
    lastActive: '2 days ago',
    avatarUrl: 'https://picsum.photos/id/91/100/100'
  },
  {
    id: 'u4',
    name: 'Jenny Wilson',
    email: 'jenny.wilson@example.com',
    role: 'Trainer',
    status: 'Active',
    lastActive: '5 hours ago',
    avatarUrl: 'https://picsum.photos/id/103/100/100'
  },
  {
    id: 'u5',
    name: 'Guy Hawkins',
    email: 'guy.hawkins@example.com',
    role: 'Viewer',
    status: 'Active',
    lastActive: '10 mins ago',
    avatarUrl: 'https://picsum.photos/id/129/100/100'
  },
];

export const BOT_PROFILES_DATA: BotProfile[] = [
  {
    id: 'b1',
    name: 'Sales Assistant Alpha',
    description: 'Specialized in B2B lead qualification and initial product demos.',
    version: 'v3.4',
    accuracy: 92.5,
    lastTrained: '2 hours ago',
    status: 'Active',
  },
  {
    id: 'b2',
    name: 'Support Agent X',
    description: 'Level 1 customer support, routing, and basic troubleshooting.',
    version: 'v2.1',
    accuracy: 88.2,
    lastTrained: '1 day ago',
    status: 'Training',
  },
  {
    id: 'b3',
    name: 'Legal Advisor Internal',
    description: 'Internal document review and compliance checking assistant.',
    version: 'v1.0.5',
    accuracy: 76.0,
    lastTrained: '3 days ago',
    status: 'Deprecated',
  },
  {
    id: 'b4',
    name: 'HR Onboarding Bot',
    description: 'Helps new employees with paperwork and office navigation.',
    version: 'v4.0',
    accuracy: 95.1,
    lastTrained: '12 hours ago',
    status: 'Active',
  },
  {
    id: 'b5',
    name: 'Code Reviewer',
    description: 'Assists developers by linting and suggesting optimizations.',
    version: 'beta-0.9',
    accuracy: 65.4,
    lastTrained: 'Just now',
    status: 'Training',
  }
];

export const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  { id: 'k1', fileName: 'menu_pho_bo.json', type: 'JSON', size: '1.2 MB', status: 'Embedded', uploadDate: '10 mins ago' },
  { id: 'k2', fileName: 'nutrition_facts_vietnam_2023.pdf', type: 'PDF', size: '4.5 MB', status: 'Embedded', uploadDate: '1 hour ago' },
  { id: 'k3', fileName: 'gym_macro_guidelines.txt', type: 'TXT', size: '156 KB', status: 'Embedded', uploadDate: '3 hours ago' },
  { id: 'k4', fileName: 'raw_food_ingredients_list.csv', type: 'CSV', size: '12.8 MB', status: 'Processing', uploadDate: 'Just now' },
  { id: 'k5', fileName: 'failed_scraping_dump_v2.json', type: 'JSON', size: '0.5 MB', status: 'Error', uploadDate: 'Yesterday' },
  { id: 'k6', fileName: 'street_food_calories.json', type: 'JSON', size: '2.1 MB', status: 'Embedded', uploadDate: '2 days ago' },
];
