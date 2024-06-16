import React, { useState, useRef } from 'react';
import Button from './Button';
import { Copy } from 'lucide-react';

interface CopyToClipboardProps {
  text: string | undefined;
  children?: React.ReactNode;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ text, children }) => {
  const [isCopied, setIsCopied] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(textRef.current.textContent || '');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="copy-to-clipboard">
      <div className="flex gap-2">
        <div ref={textRef} className="copy-text">
          {text && text}
        </div>
        <Button className={`${isCopied ? 'bg-blue' : "bg-transparent"}`} handleClick={copyToClipboard} size='small'>
          <Copy color = "#121212"/>
        </Button>
      </div>
      {children}
    </div>
  );
};

export default CopyToClipboard;