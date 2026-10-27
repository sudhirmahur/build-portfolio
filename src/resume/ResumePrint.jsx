import { createPortal } from 'react-dom';
import ResumeDoc from './ResumeDoc';

/** Renders the resume into a print-only node, then opens the browser print dialog. */
export function printResume() {
  document.body.classList.add('resume-printing');
  const done = () => {
    document.body.classList.remove('resume-printing');
    window.removeEventListener('afterprint', done);
  };
  window.addEventListener('afterprint', done);
  // give the portal a frame to paint
  setTimeout(() => window.print(), 80);
  setTimeout(done, 60000);
}

export default function ResumePrintPortal({ templateId, data }) {
  return createPortal(
    <div id="resume-print-portal">
      <ResumeDoc templateId={templateId} data={data} />
    </div>,
    document.body
  );
}
