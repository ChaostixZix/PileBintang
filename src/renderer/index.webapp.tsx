import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';

// Comprehensive mock for window.electron API
(window as any).electron = {
  isMac: false,
  
  // File operations
  file: {
    getFilesInPile: () => Promise.resolve([]),
    createNewPost: () => Promise.resolve('new-post-id'),
    savePost: () => Promise.resolve(true),
    deletePost: () => Promise.resolve(true),
    readPost: () => Promise.resolve({ content: '', frontmatter: {} }),
    getPiles: () => Promise.resolve([]),
    createPile: () => Promise.resolve(true),
    deletePile: () => Promise.resolve(true),
    on: () => {},
    off: () => {},
    removeAllListeners: () => {},
    emit: () => {},
  },
  
  // Store operations
  store: {
    get: (key: string) => {
      if (key === 'selectedPile') return 'demo-pile';
      return undefined;
    },
    set: () => {},
    delete: () => {},
    on: () => {},
    off: () => {},
    emit: () => {},
  },
  
  // API keys
  keys: {
    get: () => Promise.resolve({}),
    set: () => Promise.resolve(),
    delete: () => Promise.resolve(),
    on: () => {},
    off: () => {},
  },
  
  // Highlights
  highlights: {
    get: () => Promise.resolve([]),
    set: () => Promise.resolve(),
    delete: () => Promise.resolve(),
    on: () => {},
    off: () => {},
  },
  
  // Tags
  tags: {
    get: () => Promise.resolve([]),
    set: () => Promise.resolve(),
    delete: () => Promise.resolve(),
    on: () => {},
    off: () => {},
  },
  
  // Links
  links: {
    get: () => Promise.resolve([]),
    set: () => Promise.resolve(),
    delete: () => Promise.resolve(),
    on: () => {},
    off: () => {},
  },
  
  // Search index
  index: {
    search: () => Promise.resolve([]),
    rebuild: () => Promise.resolve(),
    on: () => {},
    off: () => {},
  },
  
  // Sync operations
  sync: {
    getState: () => Promise.resolve({ status: 'idle' }),
    setState: () => Promise.resolve(),
    on: () => {},
    off: () => {},
    emit: () => {},
  },
  
  // Auto update
  autoUpdate: {
    checkForUpdates: () => Promise.resolve(),
    on: () => {},
    off: () => {},
    emit: () => {},
  },
  
  // Authentication
  auth: {
    signIn: () => Promise.resolve(),
    signOut: () => Promise.resolve(),
    getUser: () => Promise.resolve(null),
    getSession: () => Promise.resolve(null),
    on: () => {},
    off: () => {},
    emit: () => {},
  },
  
  // General event emitter methods
  on: () => {},
  off: () => {},
  emit: () => {},
  removeAllListeners: () => {},
};

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

const wrapperStyle = {
  background: 'var(--bg)', // Use default background for webapp
};

root.render(
  <Router>
    <div className="uiChrome flatEdgy" style={wrapperStyle}>
      <App />
    </div>
  </Router>,
);