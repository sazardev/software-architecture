import { auditContent } from './content/audit-content';
import { renderIssues, summarizeIssues } from './report';
import { auditRoutes } from './routes/audit-routes';

const { docCount, issues: contentIssues } = await auditContent();
const routeIssues = await auditRoutes();
const issues = [...contentIssues, ...routeIssues];

if (issues.length > 0) {
  console.log(renderIssues(issues));
  console.log('');
}

const { errors, warnings } = summarizeIssues(issues);

console.log(`Contenido: ${docCount} documentos auditados`);
console.log(`Rutas: auditadas contra el sistema de archivos`);
console.log(`Resultado: ${errors} error(es) · ${warnings} advertencia(s)`);

if (errors > 0) {
  process.exit(1);
}
