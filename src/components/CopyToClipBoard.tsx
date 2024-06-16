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
      <div className="flex gap-2 items-center px-2">
        <div ref={textRef} >
          <p className="text-sm text-normal text-text-black">{text && text}</p>
        </div>
        <Button className={"bg-transparent justify-self-end text-green-500 flex gap-4"} handleClick={copyToClipboard} size='small'>
          <Copy color = "#d0d0d0"/>
          {isCopied && "Copied"}
        </Button>
      </div>
      {children}
    </div>
  );
}

export default CopyToClipboard;