import { useState } from 'react';

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  controls?: React.ReactNode;
}

const Accordion = ({ title, children, defaultOpen = false, controls }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="accordion">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        padding: '8px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        marginBottom: isOpen ? '8px' : '0'
      }}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px'
          }}
        >
          {isOpen ? '▼' : '▶'}
        </button>
        <div style={{ flex: 1 }}>{title}</div>
        <div>{controls}</div>
      </div>
      {isOpen && (
        <div style={{ padding: '0 0 0 20px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion; 