/**
 * HealthShield AI - CSV Parser & Network Feature Detector
 */

export function parseCSV(csvString) {
  if (!csvString || typeof csvString !== 'string') {
    throw new Error('Invalid or empty CSV content.');
  }

  const lines = csvString
    .split(/\r\n|\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV must contain a header row and at least one data row.');
  }

  const headers = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx];
      });
      rows.push(rowObj);
    }
  }

  const columnMapping = detectColumnMapping(headers);

  return {
    headers,
    rows,
    totalRows: rows.length,
    totalColumns: headers.length,
    preview: rows.slice(0, 10),
    columnMapping
  };
}

/**
 * Handle quotes and commas properly in CSV lines
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Automatically inspect header names and map them to standard IoMT network features
 */
export function detectColumnMapping(headers) {
  const mapping = {
    sourceIp: '',
    destIp: '',
    protocol: '',
    sourcePort: '',
    destPort: '',
    packets: '',
    bytes: '',
    duration: '',
    label: '',
    device: ''
  };

  headers.forEach(h => {
    const lower = h.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (!mapping.sourceIp && (lower.includes('srcip') || lower.includes('sourceip') || lower.includes('origip') || lower === 'src' || lower === 'source')) {
      mapping.sourceIp = h;
    }
    if (!mapping.destIp && (lower.includes('dstip') || lower.includes('destip') || lower.includes('targetip') || lower === 'dst' || lower === 'destination')) {
      mapping.destIp = h;
    }
    if (!mapping.protocol && (lower.includes('proto') || lower.includes('protocol'))) {
      mapping.protocol = h;
    }
    if (!mapping.sourcePort && (lower.includes('srcport') || lower.includes('sport') || lower === 'sourceport')) {
      mapping.sourcePort = h;
    }
    if (!mapping.destPort && (lower.includes('dstport') || lower.includes('dport') || lower === 'destport' || lower === 'port')) {
      mapping.destPort = h;
    }
    if (!mapping.packets && (lower.includes('packet') || lower.includes('pkts') || lower.includes('pktcount') || lower === 'totpkts')) {
      mapping.packets = h;
    }
    if (!mapping.bytes && (lower.includes('byte') || lower.includes('bytes') || lower.includes('totbytes') || lower.includes('vol'))) {
      mapping.bytes = h;
    }
    if (!mapping.duration && (lower.includes('dur') || lower.includes('duration') || lower.includes('time') || lower.includes('elapsed'))) {
      mapping.duration = h;
    }
    if (!mapping.label && (lower.includes('label') || lower.includes('attack') || lower.includes('class') || lower.includes('threat') || lower.includes('type'))) {
      mapping.label = h;
    }
    if (!mapping.device && (lower.includes('device') || lower.includes('iomt') || lower.includes('equipment') || lower.includes('host'))) {
      mapping.device = h;
    }
  });

  return mapping;
}
