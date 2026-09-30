import React, { useState, useMemo } from 'react';
import { getSymptomLogs } from '../store/localStore';
import { isAfter, subDays, startOfDay } from 'date-fns';
import { Activity } from 'lucide-react';
import SeverityBadge from '../components/SeverityBadge';
import formatTime from '../utils/formatTime';

const History = () => {
  const [timeRange, setTimeRange] = useState('7'); // '7', '30', 'all'
  
  // Get all logs
  const allLogs = useMemo(() => getSymptomLogs(), []);

  // Filter logs based on time range
  const filteredLogs = useMemo(() => {
    if (timeRange === 'all') return allLogs;
    
    const cutoffDate = subDays(startOfDay(new Date()), parseInt(timeRange));
    return allLogs.filter(log => isAfter(new Date(log.timestamp), cutoffDate));
  }, [allLogs, timeRange]);

  // Generate summary table data and grouped details
  const { summaryData, groupedLogs } = useMemo(() => {
    const summary = {};
    const grouped = {};

    filteredLogs.forEach(log => {
      const sympName = log.symptom;
      
      // Initialize if not exists
      if (!summary[sympName]) {
        summary[sympName] = { name: sympName, count: 0, severities: { 'Lindrig': 0, 'Måttlig': 0, 'Svår': 0 } };
        grouped[sympName] = [];
      }
      
      // Update counts
      summary[sympName].count += 1;
      if (log.severity) {
        summary[sympName].severities[log.severity] += 1;
      }

      // Add to grouping
      grouped[sympName].push(log);
    });

    // Calculate most common severity for the summary
    const finalSummary = Object.values(summary).map(item => {
      let commonSeverity = 'Ingen data';
      let maxSevCount = -1;
      Object.entries(item.severities).forEach(([sev, count]) => {
        if (count > maxSevCount && count > 0) {
          maxSevCount = count;
          commonSeverity = sev;
        }
      });
      return { ...item, mostCommonSeverity: commonSeverity };
    });

    // Sort summary by count (highest first)
    finalSummary.sort((a, b) => b.count - a.count);

    // Sort individual logs by time (newest first)
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    });

    return { summaryData: finalSummary, groupedLogs: grouped };
  }, [filteredLogs]);

  const getBadgeStyle = (sev) => {
    switch(sev) {
      case 'Svår': return { backgroundColor: 'var(--severity-severe)', color: '#fff' };
      case 'Måttlig': return { backgroundColor: 'var(--severity-moderate)', color: '#000' };
      case 'Lindrig': return { backgroundColor: 'var(--severity-mild)', color: '#000' };
      default: return { backgroundColor: 'var(--card-border)', color: '#fff' };
    }
  };

  return (
    <div className="page-container" style={{ paddingBottom: '100px' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={24} style={{ color: 'var(--accent-color)' }} />
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Historik</h1>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="segmented" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: '7 Dagar', value: '7' },
          { label: '30 Dagar', value: '30' },
          { label: 'Alla', value: 'all' }
        ].map(opt => (
          <button
            key={opt.value}
            onClick={() => setTimeRange(opt.value)}
            className={`segmented-item ${timeRange === opt.value ? 'active' : ''}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filteredLogs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Inga loggar funna för vald period.</p>
        </div>
      ) : (
        <>
          {/* Summary Table */}
          <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '2rem' }}>
            <h3 style={{ padding: '1rem', margin: 0, borderBottom: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.02)' }}>
              Sammanfattning
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>Symtom</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>Antal</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>Vanligast</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.map(item => (
                  <tr key={item.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>{item.name}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{item.count} st</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <SeverityBadge severity={item.mostCommonSeverity !== 'Ingen data' ? item.mostCommonSeverity : null} />
                      {item.mostCommonSeverity === 'Ingen data' && (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Ingen data</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grouped Logs Details */}
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Detaljerad Logg</h2>
          {summaryData.map(summaryItem => (
            <div key={summaryItem.name} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
                {summaryItem.name}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {groupedLogs[summaryItem.name].map(log => (
                  <div 
                    key={log.id} 
                    className={`card log-card with-accent accent-severity-${(log.severity || '').toLowerCase().replace(/[^a-z]/g, '')}`.trim()}
                    style={{ borderLeftColor: getBadgeStyle(log.severity).backgroundColor }}
                  >
                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                      <span className="timestamp">
                        {formatTime(log.timestamp)}
                      </span>
                      <SeverityBadge severity={log.severity} />
                    </div>
                    {log.notes ? (
                      <p className="notes" style={{ color: 'var(--text-primary)' }}>
                        "{log.notes}"
                      </p>
                    ) : (
                      <p className="no-notes">
                        Inga anteckningar
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default History;
