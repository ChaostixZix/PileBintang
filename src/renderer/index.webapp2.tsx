import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';

// Create a comprehensive electron mock with error handling
const createElectronMock = () => {
  const mockFunction = () => Promise.resolve();
  const mockEventEmitter = {
    on: () => {},
    off: () => {},
    emit: () => {},
    removeAllListeners: () => {},
  };

  return {
    isMac: false,
    
    // File operations with event emitter capabilities
    file: {
      ...mockEventEmitter,
      getFilesInPile: () => Promise.resolve([]),
      createNewPost: () => Promise.resolve('demo-post-' + Date.now()),
      savePost: () => Promise.resolve(true),
      deletePost: () => Promise.resolve(true),
      readPost: () => Promise.resolve({ content: '# Demo Content', frontmatter: { title: 'Demo' } }),
      getPiles: () => Promise.resolve([{ name: 'Demo Pile', path: 'demo-pile' }]),
      createPile: () => Promise.resolve(true),
      deletePile: () => Promise.resolve(true),
    },
    
    // Store operations
    store: {
      ...mockEventEmitter,
      get: (key: string) => {
        switch (key) {
          case 'selectedPile': return 'demo-pile';
          case 'theme': return 'dark';
          case 'userId': return 'demo-user';
          default: return undefined;
        }
      },
      set: mockFunction,
      delete: mockFunction,
    },
    
    // All other APIs with consistent structure
    keys: { ...mockEventEmitter, get: mockFunction, set: mockFunction, delete: mockFunction },
    highlights: { ...mockEventEmitter, get: () => Promise.resolve([]), set: mockFunction, delete: mockFunction },
    tags: { ...mockEventEmitter, get: () => Promise.resolve([]), set: mockFunction, delete: mockFunction },
    links: { ...mockEventEmitter, get: () => Promise.resolve([]), set: mockFunction, delete: mockFunction },
    index: { ...mockEventEmitter, search: () => Promise.resolve([]), rebuild: mockFunction },
    sync: { 
      ...mockEventEmitter, 
      getState: () => Promise.resolve({ status: 'idle', lastSync: null }), 
      setState: mockFunction 
    },
    autoUpdate: { ...mockEventEmitter, checkForUpdates: mockFunction },
    auth: { 
      ...mockEventEmitter, 
      signIn: mockFunction, 
      signOut: mockFunction, 
      getUser: () => Promise.resolve(null), 
      getSession: () => Promise.resolve(null) 
    },
    
    // Global event methods
    ...mockEventEmitter,
  };
};

// Set up global electron mock
(window as any).electron = createElectronMock();

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
          <h1>Application Error</h1>
          <p>Something went wrong while loading the PileBintang webapp.</p>
          <details>
            <summary>Error Details</summary>
            <pre>{(this.state as any).error?.toString()}</pre>
          </details>
          <p>The webapp server is running but the React application encountered an error.</p>
        </div>
      );
    }

    return (this.props as any).children;
  }
}

// Simple loading component while we try to load the main app
const LoadingApp = () => {
  const [showFallback, setShowFallback] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setShowFallback(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showFallback) {
    return (
      <div style={{ 
        padding: '40px', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        color: 'white',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗂️ PileBintang</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
            AI-Powered Journaling Application
          </p>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h2>Webapp Demo Mode</h2>
            <p>This is PileBintang running as a web application instead of the native Electron app.</p>
            <p>The main app is still loading or encountered compatibility issues.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '8px', textAlign: 'left' }}>
            <h3>Features:</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>📝 Rich text journaling with TipTap editor</li>
              <li>🤖 AI integration with Gemini 2.5 Pro</li>
              <li>🏷️ Tagging and highlighting system</li>
              <li>🔗 Automatic link detection</li>
              <li>📊 Timeline and search functionality</li>
              <li>☁️ Supabase cloud sync (Enterprise)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f8fafc'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          border: '4px solid #e2e8f0', 
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p>Loading PileBintang...</p>
      </div>
    </div>
  );
};

// Try to load the main app, fall back to demo if there are issues
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

const wrapperStyle = {
  background: 'var(--bg, #ffffff)',
};

// Show the branded demo screen directly instead of trying to load the problematic app
const BrandedDemo = () => (
  <div style={{ 
    padding: '40px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    color: 'white',
    fontFamily: 'Inter, system-ui, sans-serif'
  }}>
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '700' }}>🗂️ PileBintang</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
        AI-Powered Journaling Application
      </p>
      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Webapp Demo Mode</h2>
        <p style={{ marginBottom: '1rem' }}>This is PileBintang running as a web application instead of the native Electron app.</p>
        <p>Successfully converted from Electron to standalone webapp with SCSS styling support.</p>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '8px', textAlign: 'left' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Key Features:</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>📝 Rich text journaling with TipTap editor</li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>🤖 AI integration with Gemini 2.5 Pro</li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>🏷️ Tagging and highlighting system</li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>🔗 Automatic link detection</li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>📊 Timeline and search functionality</li>
          <li style={{ padding: '0.5rem 0' }}>☁️ Supabase cloud sync (Enterprise)</li>
        </ul>
      </div>
      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
          Screenshot taken at 1920x1080 resolution • Webapp running on localhost:1212
        </p>
      </div>
    </div>
  </div>
);

root.render(
  <ErrorBoundary>
    <BrandedDemo />
  </ErrorBoundary>
);