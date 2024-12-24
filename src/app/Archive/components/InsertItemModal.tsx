import React from 'react';
import { ContentItem } from '@src/types/book.types';

interface InsertItemModalProps {
  isOpen: boolean;
  items: ContentItem[];
  onClose: () => void;
  onInsert: (position: number, type: string, insertAfter: boolean) => void;
  selectedType: string;
}

const InsertItemModal = ({ isOpen, items, onClose, onInsert, selectedType }: InsertItemModalProps) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h3>Select insertion point</h3>
        {items.length === 0 ? (
          <p>This page is empty. The item will be added as the first element.</p>
        ) : (
          <div>
            <button onClick={() => {
              onInsert(0, selectedType, false);
              onClose();
            }}>Insert at beginning</button>
            {items.map((item, index) => (
              <div key={index} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
                <div style={{ marginBottom: '5px' }}>
                  {item.type}: {getItemPreview(item)}
                </div>
                <button onClick={() => {
                  onInsert(index, selectedType, true);
                  onClose();
                }}>Insert after</button>
                <button onClick={() => {
                  onInsert(index, selectedType, false);
                  onClose();
                }}>Insert before</button>
              </div>
            ))}
          </div>
        )}
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const getItemPreview = (item: ContentItem): string => {
  switch (item.type) {
    case 'text':
      return item.content?.substring(0, 50) + '...' || '';
    case 'heading1':
    case 'heading2':
    case 'heading3':
      return item.content || '';
    case 'space':
      return '[Space]';
    case 'image':
      return `[Image: ${item.alt || item.src}]`;
    case 'quiz':
      return `[Quiz: ${item.title}]`;
    case 'table':
      return `[Table: ${item.title || 'Untitled'}]`;
    default:
      return `[${item.type}]`;
  }
};

export default InsertItemModal;
