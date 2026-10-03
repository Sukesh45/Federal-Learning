import React, { useState, useEffect } from 'react';
import {
  Database,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Trash2,
  Eye,
  FileDown,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { parseCSV, detectColumnMapping } from '../utils/csvParser.js';
import { subscribeToDatasets, saveDatasetMetadata, deleteDataset } from '../services/datasetService.js';
import { subscribeToHospitals } from '../services/hospitalService.js';
import { formatDate, formatNumber } from '../utils/formatters.js';
import { useNotifications } from '../context/NotificationContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function DatasetManagement() {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [datasets, setDatasets] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [datasetName, setDatasetName] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-a');
  const [description, setDescription] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [columnMapping, setColumnMapping] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const unsubData = subscribeToDatasets(setDatasets);
    const unsubHosp = subscribeToHospitals(setHospitals);
    return () => {
      unsubData();
      unsubHosp();
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    if (!datasetName) {
      setDatasetName(file.name.replace('.csv', '').replace(/_/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const result = parseCSV(text);
        setParsedData(result);
        setColumnMapping(result.columnMapping);
        addToast('CSV Parsed', `Extracted ${result.totalRows} records and ${result.totalColumns} features.`, 'success');
      } catch (err) {
        addToast('Parse Error', err.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  const loadSampleCSV = async () => {
    try {
      const res = await fetch('/sample_iomt_traffic.csv');
      const text = await res.text();
      const result = parseCSV(text);
      setSelectedFile({ name: 'sample_iomt_traffic.csv' });
      setDatasetName('IoMT Clinical Telemetry Sample Batch');
      setDescription('Standard benchmark IoMT network flow captures with labeled DoS, Port Scan, Ransomware SMB, and benign telemetry.');
      setParsedData(result);
      setColumnMapping(result.columnMapping);
      addToast('Sample Loaded', `Loaded sample IoMT dataset (${result.totalRows} flow records).`, 'success');
    } catch (err) {
      addToast('Error', 'Failed to load sample CSV.', 'error');
    }
  };

  const handleUploadDataset = async (e) => {
    e.preventDefault();
    if (!parsedData) {
      addToast('No File', 'Please upload or select a CSV dataset first.', 'warning');
      return;
    }

    setIsUploading(true);
    const hospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];

    try {
      await saveDatasetMetadata({
        name: datasetName,
        fileName: selectedFile.name,
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        recordCount: parsedData.totalRows,
        columnCount: parsedData.totalColumns,
        columns: parsedData.headers,
        columnMapping,
        description: description || 'Hospital IoMT network telemetry batch.'
      }, user);

      addToast('Dataset Ingested', `Dataset "${datasetName}" registered for Federated Learning.`, 'success');
      // Reset form
      setSelectedFile(null);
      setDatasetName('');
      setDescription('');
      setParsedData(null);
      setColumnMapping(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this dataset metadata?')) {
      await deleteDataset(id, user);
      addToast('Deleted', 'Dataset removed.', 'info');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold">
              Data Ingestion Layer
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
              CSV Network Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            IoMT Dataset Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Upload hospital-specific network flow logs (CSV). Datasets remain logically quarantined to each healthcare institution for local model training before federated weight averaging.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/hospital_a_iomt_flows.csv"
            download="hospital_a_iomt_flows.csv"
            className="px-4 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-mono font-bold flex items-center space-x-2 transition-all border border-cyan-200 shadow-sm"
          >
            <FileDown className="w-4 h-4 text-cyan-700" />
            <span>Download Sample CSV</span>
          </a>

          <button
            onClick={loadSampleCSV}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold flex items-center space-x-2 transition-all border border-slate-200 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span>Load Pre-built IoMT CSV</span>
          </button>
        </div>
      </div>

      {/* Upload & CSV Processing Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Upload className="w-5 h-5 text-cyan-700" />
            <span>Upload Network Flow Dataset</span>
          </h2>

          <form onSubmit={handleUploadDataset} className="space-y-4">
            {/* File Dropzone Area */}
            <div className="border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-2xl p-6 text-center transition-all bg-slate-50 cursor-pointer relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileSpreadsheet className="w-10 h-10 mx-auto text-cyan-600 mb-2" />
              {selectedFile ? (
                <div>
                  <p className="text-xs font-mono font-bold text-slate-900">{selectedFile.name}</p>
                  <p className="text-[10px] text-emerald-700 font-mono mt-0.5 font-semibold">
                    ✓ {parsedData?.totalRows || 0} rows parsed • {parsedData?.totalColumns || 0} columns
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Click or drag & drop CSV network telemetry file
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 font-medium">
                    Supports IoMT Flow logs, PCAP exports, and custom network CSVs
                  </p>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                  Dataset Name
                </label>
                <input
                  type="text"
                  required
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  placeholder="e.g. Infusion Pump Flows Batch 4"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                  Target Hospital Node
                </label>
                <select
                  value={selectedHospitalId}
                  onChange={(e) => setSelectedHospitalId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono focus:outline-none"
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 uppercase mb-1 font-semibold">
                Description / Context
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="High-frequency telemetry records captured from bedside medical devices..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-cyan-600 rounded-xl text-xs text-slate-900 font-mono resize-none focus:outline-none"
              />
            </div>

            {/* Column Mapping Detection Box */}
            {parsedData && columnMapping && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-cyan-200 text-xs font-mono space-y-2">
                <div className="flex justify-between items-center text-cyan-900 font-bold">
                  <span>Detected Feature Mappings:</span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold">Auto-Detected</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-700">
                  <div>Src IP: <span className="text-cyan-800 font-bold">{columnMapping.sourceIp || 'N/A'}</span></div>
                  <div>Dst IP: <span className="text-cyan-800 font-bold">{columnMapping.destIp || 'N/A'}</span></div>
                  <div>Protocol: <span className="text-cyan-800 font-bold">{columnMapping.protocol || 'N/A'}</span></div>
                  <div>Packets: <span className="text-cyan-800 font-bold">{columnMapping.packets || 'N/A'}</span></div>
                  <div>Bytes: <span className="text-cyan-800 font-bold">{columnMapping.bytes || 'N/A'}</span></div>
                  <div>Label: <span className="text-rose-700 font-bold">{columnMapping.label || 'N/A'}</span></div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isUploading || !parsedData}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Database className="w-4 h-4" />
              <span>{isUploading ? 'Registering...' : 'Register Dataset for Local Training'}</span>
            </button>
          </form>
        </div>

        {/* Existing Datasets List */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                Registered Hospital Datasets ({datasets.length})
              </h3>
              <span className="text-[10px] font-mono text-cyan-800 font-semibold">
                Siloed by Institution
              </span>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar">
              {datasets.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8 font-mono">
                  No datasets uploaded yet. Upload a CSV to get started.
                </p>
              ) : (
                datasets.map(ds => (
                  <div
                    key={ds.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-cyan-400 transition-all text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900">{ds.name}</h4>
                        <p className="text-[11px] font-mono text-cyan-800 font-semibold mt-0.5">{ds.hospitalName}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(ds.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Dataset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {ds.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500 font-medium">
                      <span>📊 {formatNumber(ds.recordCount)} records • {ds.fileName}</span>
                      <span>{formatDate(ds.uploadedAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] font-mono text-emerald-800 flex items-center space-x-1.5 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
            <span>All datasets indexed for differential privacy local gradient training.</span>
          </div>
        </div>
      </div>

      {/* CSV Preview Table (First 10 Rows) */}
      {parsedData && parsedData.preview && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-mono">
                CSV Data Preview (First 10 Rows)
              </h3>
              <p className="text-[11px] text-slate-500">
                Total Rows: {parsedData.totalRows.toLocaleString()} • Total Features: {parsedData.totalColumns}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-100 text-cyan-800 border border-slate-200 font-bold">
              {selectedFile?.name}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 custom-scrollbar">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase font-bold">
                <tr>
                  {parsedData.headers.map((h, i) => (
                    <th key={i} className="py-2.5 px-3 border-b border-slate-200 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {parsedData.preview.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                    {parsedData.headers.map((h, cIdx) => (
                      <td key={cIdx} className="py-2 px-3 text-slate-800 whitespace-nowrap">
                        {row[h] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
