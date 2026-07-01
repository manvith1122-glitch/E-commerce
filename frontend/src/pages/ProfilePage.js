import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || 'India',
    },
  });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      toast.success('Password changed successfully!');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="page-header">
          <h1>👤 My Profile</h1>
          <p>Manage your account settings</p>
        </div>

        {/* Avatar card */}
        <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700' }}>{user?.name}</h2>
            <p style={{ color: '#666' }}>{user?.email}</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-danger' : 'badge-info'}`} style={{ marginTop: '6px' }}>
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {[['profile', '✏️ Edit Profile'], ['password', '🔒 Change Password']].map(([id, label]) => (
            <button
              key={id}
              style={{ ...styles.tab, ...(tab === id ? styles.tabActive : {}) }}
              onClick={() => setTab(id)}
            >{label}</button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="card">
            <h3 style={{ marginBottom: '24px' }}>Personal Information</h3>
            <form onSubmit={handleProfileSave}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-control" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-control" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>

              <h4 style={{ margin: '8px 0 16px', color: '#666', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase' }}>
                Address
              </h4>
              <div className="form-group">
                <label>Street Address</label>
                <input className="form-control" value={form.address.street}
                  onChange={e => setForm(p => ({ ...p, address: { ...p.address, street: e.target.value } }))} />
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label>City</label>
                  <input className="form-control" value={form.address.city}
                    onChange={e => setForm(p => ({ ...p, address: { ...p.address, city: e.target.value } }))} />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input className="form-control" value={form.address.state}
                    onChange={e => setForm(p => ({ ...p, address: { ...p.address, state: e.target.value } }))} />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input className="form-control" value={form.address.zipCode}
                    onChange={e => setForm(p => ({ ...p, address: { ...p.address, zipCode: e.target.value } }))} />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input className="form-control" value={form.address.country}
                    onChange={e => setForm(p => ({ ...p, address: { ...p.address, country: e.target.value } }))} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {tab === 'password' && (
          <div className="card">
            <h3 style={{ marginBottom: '24px' }}>Change Password</h3>
            <form onSubmit={handlePasswordChange} style={{ maxWidth: '400px' }}>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" className="form-control" value={pwdForm.currentPassword}
                  onChange={e => setPwdForm(p => ({ ...p, currentPassword: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" className="form-control" value={pwdForm.newPassword}
                  onChange={e => setPwdForm(p => ({ ...p, newPassword: e.target.value }))} required minLength={6} />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" className="form-control" value={pwdForm.confirmPassword}
                  onChange={e => setPwdForm(p => ({ ...p, confirmPassword: e.target.value }))} required minLength={6} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  avatar: {
    width: '72px', height: '72px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #e94560, #c73652)',
    color: '#fff', fontSize: '30px', fontWeight: '800',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  tabs: { display: 'flex', gap: '8px', marginBottom: '20px' },
  tab: {
    padding: '10px 20px', border: '2px solid #e9ecef', borderRadius: '10px',
    background: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    color: '#666', transition: 'all 0.2s',
  },
  tabActive: { background: '#1a1a2e', borderColor: '#1a1a2e', color: '#fff' },
};

export default ProfilePage;