"use client";

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link2, 
  Type,
  Strikethrough
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  maxLength?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
  readOnly = false,
  className,
  maxLength
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      
      // Check for max length if specified
      if (maxLength) {
        const textContent = editorRef.current.textContent || '';
        if (textContent.length > maxLength) {
          return;
        }
      }
      
      onChange(content);
    }
  }, [onChange, maxLength]);

  const execCommand = useCallback((command: string, value?: string) => {
    if (readOnly) return;
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }, [readOnly, handleInput]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  }, [execCommand]);

  const formatText = useCallback((format: string) => {
    if (readOnly) return;
    
    switch (format) {
      case 'bold':
        execCommand('bold');
        break;
      case 'italic':
        execCommand('italic');
        break;
      case 'underline':
        execCommand('underline');
        break;
      case 'strikethrough':
        execCommand('strikeThrough');
        break;
      case 'h1':
        execCommand('formatBlock', '<h1>');
        break;
      case 'h2':
        execCommand('formatBlock', '<h2>');
        break;
      case 'h3':
        execCommand('formatBlock', '<h3>');
        break;
      case 'p':
        execCommand('formatBlock', '<p>');
        break;
      case 'ul':
        execCommand('insertUnorderedList');
        break;
      case 'ol':
        execCommand('insertOrderedList');
        break;
      case 'link':
        const url = window.prompt('Enter URL:');
        if (url) {
          execCommand('createLink', url);
        }
        break;
    }
  }, [readOnly, execCommand]);

  // Get text content length for character counter
  const getTextLength = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return (div.textContent || div.innerText || '').length;
  };

  const textLength = getTextLength(value);

  return (
    <div className={cn("relative", className)}>
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50/50 rounded-t-md">
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={() => formatText('h1')}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Heading 1"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => formatText('p')}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors text-xs font-medium"
              title="Paragraph"
            >
              P
            </button>
          </div>
          
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={() => formatText('bold')}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => formatText('italic')}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => formatText('underline')}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Underline (Ctrl+U)"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => formatText('strikethrough')}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={() => formatText('ul')}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => formatText('ol')}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>
          
          <button
            type="button"
            onClick={() => formatText('link')}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
            title="Insert Link"
          >
            <Link2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "min-h-[120px] p-4 text-base leading-relaxed outline-none transition-all duration-200",
          "prose prose-sm max-w-none",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-2",
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-2",
          "[&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2 [&_h3]:mt-1",
          "[&_p]:mb-2 [&_p]:mt-0",
          "[&_ul]:ml-4 [&_ol]:ml-4",
          "[&_li]:mb-1",
          "[&_a]:text-emerald-600 [&_a]:underline hover:[&_a]:text-emerald-700",
          readOnly 
            ? "bg-gray-50 text-gray-700 cursor-default border-gray-200" 
            : cn(
                "bg-white border-emerald-300 cursor-text",
                isFocused && "ring-1 ring-emerald-500 border-emerald-500"
              ),
          !readOnly && !value && "before:content-[attr(data-placeholder)] before:text-gray-400 before:pointer-events-none",
          readOnly ? "border rounded-md" : "border-l border-r border-b rounded-b-md"
        )}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
      
      {/* Character counter */}
      {maxLength && !readOnly && (
        <div className="flex justify-end mt-1">
          <span className={cn(
            "text-xs",
            textLength > maxLength * 0.9 
              ? textLength > maxLength 
                ? "text-red-500" 
                : "text-yellow-500"
              : "text-gray-500"
          )}>
            {textLength}/{maxLength} characters
          </span>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;