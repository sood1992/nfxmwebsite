import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Settings.css';

const Settings = () => {
  const { settings, setSettings, selectedAccount } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setLocalSettings(settings);
  };

  const updateBenchmark = (key, value) => {
    setLocalSettings({
      ...localSettings,
      benchmarks: {
        ...localSettings.benchmarks,
        [key]: parseInt(value) || 0,
      },
    });
  };

  return (
    <div className="settings-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <SettingsIcon size={24} className="page-icon" />
          <h1>Ad Account Settings</h1>
        </div>
        <div className="header-actions">
          <button className="reset-btn" onClick={handleReset}>
            <RefreshCw size={16} />
            Reset
          </button>
          <button className="save-btn" onClick={handleSave}>
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Account Info */}
      <section className="settings-section">
        <h2>Account Information</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Account Name</label>
            <input type="text" value={selectedAccount.name} disabled />
          </div>
          <div className="setting-item">
            <label>Platform</label>
            <input type="text" value={selectedAccount.platform} disabled />
          </div>
          <div className="setting-item">
            <label>Currency</label>
            <select
              value={localSettings.currency}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, currency: e.target.value })
              }
            >
              <option value="₹">₹ - Indian Rupee</option>
              <option value="$">$ - US Dollar</option>
              <option value="€">€ - Euro</option>
              <option value="£">£ - British Pound</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Timezone</label>
            <select
              value={localSettings.timezone}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, timezone: e.target.value })
              }
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Attribution Settings */}
      <section className="settings-section">
        <h2>Attribution Settings</h2>
        <div className="settings-grid">
          <div className="setting-item full-width">
            <label>Attribution Window</label>
            <select
              value={localSettings.attribution}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, attribution: e.target.value })
              }
            >
              <option value="7-day click, 1-day view">7-day click, 1-day view</option>
              <option value="28-day click, 1-day view">28-day click, 1-day view</option>
              <option value="7-day click">7-day click only</option>
              <option value="1-day click">1-day click only</option>
            </select>
          </div>
        </div>
      </section>

      {/* Performance Benchmarks */}
      <section className="settings-section">
        <h2>Performance Benchmarks</h2>
        <p className="section-description">
          Set your target benchmarks for creative scoring. These are used to evaluate
          performance against your goals.
        </p>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Hook Score Target</label>
            <div className="input-with-unit">
              <input
                type="number"
                min="0"
                max="100"
                value={localSettings.benchmarks.hookScore}
                onChange={(e) => updateBenchmark('hookScore', e.target.value)}
              />
              <span className="unit">/ 100</span>
            </div>
          </div>
          <div className="setting-item">
            <label>Hold Score Target</label>
            <div className="input-with-unit">
              <input
                type="number"
                min="0"
                max="100"
                value={localSettings.benchmarks.holdScore}
                onChange={(e) => updateBenchmark('holdScore', e.target.value)}
              />
              <span className="unit">/ 100</span>
            </div>
          </div>
          <div className="setting-item">
            <label>Click Score Target</label>
            <div className="input-with-unit">
              <input
                type="number"
                min="0"
                max="100"
                value={localSettings.benchmarks.clickScore}
                onChange={(e) => updateBenchmark('clickScore', e.target.value)}
              />
              <span className="unit">/ 100</span>
            </div>
          </div>
          <div className="setting-item">
            <label>CTR Target</label>
            <div className="input-with-unit">
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={localSettings.benchmarks.ctr}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    benchmarks: {
                      ...localSettings.benchmarks,
                      ctr: parseFloat(e.target.value) || 0,
                    },
                  })
                }
              />
              <span className="unit">%</span>
            </div>
          </div>
          <div className="setting-item">
            <label>CPM Target</label>
            <div className="input-with-unit">
              <span className="prefix">{localSettings.currency}</span>
              <input
                type="number"
                min="0"
                value={localSettings.benchmarks.cpm}
                onChange={(e) => updateBenchmark('cpm', e.target.value)}
              />
            </div>
          </div>
          <div className="setting-item">
            <label>CPC Target</label>
            <div className="input-with-unit">
              <span className="prefix">{localSettings.currency}</span>
              <input
                type="number"
                min="0"
                value={localSettings.benchmarks.cpc}
                onChange={(e) => updateBenchmark('cpc', e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="settings-section">
        <h2>Notifications</h2>
        <div className="toggle-list">
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Performance Alerts</span>
              <span className="toggle-description">
                Get notified when creatives underperform
              </span>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Weekly Reports</span>
              <span className="toggle-description">
                Receive weekly performance summary
              </span>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-label">Budget Alerts</span>
              <span className="toggle-description">
                Alert when spend exceeds thresholds
              </span>
            </div>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </section>

      {/* Data & Sync */}
      <section className="settings-section">
        <h2>Data & Sync</h2>
        <div className="action-cards">
          <div className="action-card">
            <h4>Sync Now</h4>
            <p>Force refresh data from your ad account</p>
            <button className="action-btn">
              <RefreshCw size={16} />
              Sync Data
            </button>
          </div>
          <div className="action-card">
            <h4>Export All Data</h4>
            <p>Download all your data as CSV</p>
            <button className="action-btn">Export CSV</button>
          </div>
          <div className="action-card danger">
            <h4>Disconnect Account</h4>
            <p>Remove this ad account from MagicBrief</p>
            <button className="action-btn danger">Disconnect</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
