import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language: string;
}

// VS Code Dark+ inspired colors
const COLORS = {
  keyword: "#C586C0",     // purple — import, from, const, return, export, etc.
  control: "#C586C0",     // purple — if, else, for
  declare: "#569CD6",     // blue — const, let, var, function, class
  type: "#4EC9B0",        // teal — string, number, boolean, interface, type
  string: "#CE9178",      // orange-brown — strings
  number: "#B5CEA8",      // green — numbers
  comment: "#6A9955",     // green-gray — comments
  tag: "#569CD6",         // blue — JSX tags
  attr: "#9CDCFE",        // light blue — JSX attributes
  func: "#DCDCAA",        // yellow — function names
  punctuation: "#D4D4D4", // light gray — brackets, parens
  default: "#D4D4D4",     // light gray
};

interface Token {
  text: string;
  color: string;
}

function highlightCode(code: string): Token[][] {
  const lines = code.split("\n");
  return lines.map((line) => {
    const tokens: Token[] = [];
    let remaining = line;
    let pos = 0;

    while (remaining.length > 0) {
      let matched = false;

      // Comments
      const commentMatch = remaining.match(/^(\/\/.*)/);
      if (commentMatch) {
        tokens.push({ text: commentMatch[1], color: COLORS.comment });
        remaining = remaining.slice(commentMatch[1].length);
        matched = true;
        continue;
      }

      // Strings (double quotes)
      const dqMatch = remaining.match(/^("(?:[^"\\]|\\.)*")/);
      if (dqMatch) {
        tokens.push({ text: dqMatch[1], color: COLORS.string });
        remaining = remaining.slice(dqMatch[1].length);
        matched = true;
        continue;
      }

      // Strings (single quotes)
      const sqMatch = remaining.match(/^('(?:[^'\\]|\\.)*')/);
      if (sqMatch) {
        tokens.push({ text: sqMatch[1], color: COLORS.string });
        remaining = remaining.slice(sqMatch[1].length);
        matched = true;
        continue;
      }

      // Template literals
      const tlMatch = remaining.match(/^(`(?:[^`\\]|\\.)*`)/);
      if (tlMatch) {
        tokens.push({ text: tlMatch[1], color: COLORS.string });
        remaining = remaining.slice(tlMatch[1].length);
        matched = true;
        continue;
      }

      // JSX self-closing tags like <Component />
      const jsxSelfMatch = remaining.match(/^(<\/?)([\w.]+)((?:\s+[\w-]+(?:=\{[^}]*\}|="[^"]*"|='[^']*')?)*\s*)(\/?>)/);
      if (jsxSelfMatch) {
        tokens.push({ text: jsxSelfMatch[1], color: COLORS.punctuation });
        tokens.push({ text: jsxSelfMatch[2], color: COLORS.tag });
        // Parse attributes
        const attrStr = jsxSelfMatch[3];
        if (attrStr.trim()) {
          const attrParts = attrStr.match(/([\w-]+)(=)?(\{[^}]*\}|"[^"]*"|'[^']*')?/g);
          let attrRemaining = attrStr;
          if (attrParts) {
            for (const part of attrParts) {
              const idx = attrRemaining.indexOf(part);
              if (idx > 0) {
                tokens.push({ text: attrRemaining.slice(0, idx), color: COLORS.default });
              }
              const eqIdx = part.indexOf("=");
              if (eqIdx > -1) {
                tokens.push({ text: part.slice(0, eqIdx), color: COLORS.attr });
                tokens.push({ text: "=", color: COLORS.punctuation });
                const val = part.slice(eqIdx + 1);
                if (val.startsWith("{")) {
                  tokens.push({ text: val, color: COLORS.default });
                } else {
                  tokens.push({ text: val, color: COLORS.string });
                }
              } else {
                tokens.push({ text: part, color: COLORS.attr });
              }
              attrRemaining = attrRemaining.slice(idx + part.length);
            }
          } else {
            tokens.push({ text: attrStr, color: COLORS.default });
          }
        }
        tokens.push({ text: jsxSelfMatch[4], color: COLORS.punctuation });
        remaining = remaining.slice(jsxSelfMatch[0].length);
        matched = true;
        continue;
      }

      // Keywords: import, from, export, default, return, as
      const kwMatch = remaining.match(/^(import|from|export|default|return|as|new|typeof|of)\b/);
      if (kwMatch) {
        tokens.push({ text: kwMatch[1], color: COLORS.keyword });
        remaining = remaining.slice(kwMatch[1].length);
        matched = true;
        continue;
      }

      // Control flow
      const ctrlMatch = remaining.match(/^(if|else|for|while|switch|case|break|continue)\b/);
      if (ctrlMatch) {
        tokens.push({ text: ctrlMatch[1], color: COLORS.control });
        remaining = remaining.slice(ctrlMatch[1].length);
        matched = true;
        continue;
      }

      // Declarations
      const declMatch = remaining.match(/^(const|let|var|function|class|interface|type|enum)\b/);
      if (declMatch) {
        tokens.push({ text: declMatch[1], color: COLORS.declare });
        remaining = remaining.slice(declMatch[1].length);
        matched = true;
        continue;
      }

      // Types
      const typeMatch = remaining.match(/^(string|number|boolean|void|null|undefined|any|never|true|false)\b/);
      if (typeMatch) {
        tokens.push({ text: typeMatch[1], color: COLORS.type });
        remaining = remaining.slice(typeMatch[1].length);
        matched = true;
        continue;
      }

      // Numbers
      const numMatch = remaining.match(/^(\d+\.?\d*)/);
      if (numMatch) {
        tokens.push({ text: numMatch[1], color: COLORS.number });
        remaining = remaining.slice(numMatch[1].length);
        matched = true;
        continue;
      }

      // Function calls: word followed by (
      const funcMatch = remaining.match(/^([\w$]+)(\s*\()/);
      if (funcMatch) {
        tokens.push({ text: funcMatch[1], color: COLORS.func });
        tokens.push({ text: funcMatch[2], color: COLORS.punctuation });
        remaining = remaining.slice(funcMatch[0].length);
        matched = true;
        continue;
      }

      // Arrow functions
      const arrowMatch = remaining.match(/^(=>)/);
      if (arrowMatch) {
        tokens.push({ text: "=>", color: COLORS.declare });
        remaining = remaining.slice(2);
        matched = true;
        continue;
      }

      // Default: single char
      if (!matched) {
        tokens.push({ text: remaining[0], color: COLORS.default });
        remaining = remaining.slice(1);
      }
      pos++;
    }

    return tokens;
  });
}

const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const highlighted = useMemo(() => highlightCode(code), [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-primary" />
              <span className="text-primary">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre
        className="p-3 sm:p-5 overflow-x-auto text-xs sm:text-sm leading-relaxed font-mono"
        style={{ background: "hsl(var(--code-bg))" }}
      >
        <code>
          {highlighted.map((lineTokens, lineIdx) => (
            <div key={lineIdx} className="whitespace-pre">
              {lineTokens.map((token, tokenIdx) => (
                <span key={tokenIdx} style={{ color: token.color }}>
                  {token.text}
                </span>
              ))}
              {lineTokens.length === 0 && "\n"}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
