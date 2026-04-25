const AUDIT_KEY = "hostelhub_audit_logs";

export function getAuditLogs() {
  const raw = localStorage.getItem(AUDIT_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addAuditLog(action, details = {}) {
  const logs = getAuditLogs();
  const entry = {
    id: Date.now(),
    action,
    details,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(AUDIT_KEY, JSON.stringify([entry, ...logs]));
  window.dispatchEvent(new Event("auditLogsUpdated"));
}
