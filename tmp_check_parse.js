const fs = require('fs');
const path = require('path');
const ts = require('./node_modules/typescript/lib/typescript.js');
const file = path.join(process.cwd(), 'app/(dashboard)/proxy/projects/page.tsx');
const source = fs.readFileSync(file, 'utf8');
const result = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const diagnostics = result.parseDiagnostics;
if (diagnostics.length === 0) {
  console.log('OK');
} else {
  diagnostics.forEach(d => {
    const { line, character } = result.getLineAndCharacterOfPosition(d.start || 0);
    console.log(`${d.messageText} (${line+1}:${character+1})`);
  });
}
