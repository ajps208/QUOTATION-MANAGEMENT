'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Grid, Typography, Tabs, Tab, Avatar, TextField, Switch,
  FormControlLabel, FormControl, InputLabel, Select, MenuItem,
  InputAdornment, Chip, Divider, IconButton, Tooltip, Skeleton, Stack,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import PaletteIcon from '@mui/icons-material/Palette';
import DrawIcon from '@mui/icons-material/Draw';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TuneIcon from '@mui/icons-material/Tune';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';

import { useAuthStore } from '@/store/useAuthStore';
import { businessService } from '@/services/businessService';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import PageHeader from '@/components/common/PageHeader';
import FormField from '@/components/common/FormField';
import SettingsSection from '@/components/business/SettingsSection';
import ImageUpload from '@/components/business/ImageUpload';
import BusinessSignatureManager from '@/components/business/BusinessSignatureManager';

const FONTS = [
  { value: 'Inter, sans-serif', label: 'Inter (Modern Sans)' },
  { value: 'Roboto, sans-serif', label: 'Roboto (Clean Sans)' },
  { value: 'Georgia, serif', label: 'Georgia (Classic Serif)' },
  { value: 'monospace', label: 'Monospace' },
];

const CURRENCIES = [
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'AED', label: 'AED - UAE Dirham' },
  { value: 'SGD', label: 'SGD - Singapore Dollar' },
];

const BUSINESS_TYPES = [
  'Sole Proprietorship', 'Partnership', 'Private Limited', 'Public Limited',
  'LLP', 'OPC', 'Individual', 'Corporation', 'Other',
];

const INDUSTRIES = [
  'Technology', 'Manufacturing', 'Healthcare', 'Education', 'Finance',
  'Retail', 'Real Estate', 'Construction', 'Automotive', 'Food & Beverage',
  'Consulting', 'Marketing', 'Legal', 'Accounting', 'Other',
];

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const defaultBusiness = {
  profile: {
    businessName: '', legalBusinessName: '', businessType: '', industry: '',
    businessCategory: '', registrationNumber: '', gstVatNumber: '',
    panTaxNumber: '', yearEstablished: '', description: '',
  },
  contact: { email: '', phone: '', mobile: '', whatsapp: '', website: '' },
  address: {
    addressLine1: '', addressLine2: '', city: '', district: '',
    state: '', country: 'India', postalCode: '',
  },
  owner: { ownerName: '', designation: '', email: '', phone: '' },
  branding: {
    logo: null, seal: null, primaryColor: '#4f46e5',
    secondaryColor: '#0ea5e9', accentColor: '#10b981',
    defaultFont: 'Inter, sans-serif', tagline: '',
  },
  signatures: [],
  quotationSettings: {
    quotationPrefix: 'QT', currency: 'INR', taxPercent: 18,
    validityDays: 30, paymentTerms: '', defaultTerms: 'Valid for 30 days.',
    bankDetails: '', footerText: 'Thank you for your business!',
    quotationTitle: 'QUOTATION', dateFormat: 'DD MMM YYYY',
    headerLayout: 'logo-left', tableStyle: 'striped', fontSize: 'md',
    logoSize: 'md', showLogo: true, showBusinessInfo: true,
    showCustomerInfo: true, showQuotationNumber: true, showDates: true,
    showDiscounts: true, showTax: true, showSubtotal: true,
    showItemNotes: false, showTerms: true, showNotes: true,
    showSignature: false, showBankDetails: false, showFooter: true,
  },
  preferences: {
    language: 'en', timezone: 'Asia/Kolkata', dateFormat: 'DD MMM YYYY',
    numberFormat: 'en-IN', emailNotifications: true, autoSave: true,
  },
  socialLinks: { facebook: '', instagram: '', linkedin: '', twitter: '', youtube: '' },
};

function buildDefaults(biz) {
  if (!biz) return deepClone(defaultBusiness);
  const result = deepClone(defaultBusiness);
  for (const section of Object.keys(defaultBusiness)) {
    if (biz[section] && typeof biz[section] === 'object' && !Array.isArray(biz[section])) {
      result[section] = { ...result[section], ...biz[section] };
    } else if (Array.isArray(biz[section])) {
      result[section] = biz[section];
    }
  }
  return result;
}

export default function BusinessSettingsPage() {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();

  const [business, setBusiness] = useState(null);
  const [editing, setEditing] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.businessId) return;
      try {
        const biz = await businessService.getBusinessById(user.businessId);
        setBusiness(biz);
      } catch {
        showError('Failed to load business settings');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, showError]);

  const isDirty = useMemo(() => Object.keys(editing).length > 0, [editing]);
  useUnsavedChanges(isDirty);

  const startEdit = useCallback((section) => {
    setEditing(prev => ({ ...prev, [section]: deepClone(business?.[section] || defaultBusiness[section]) }));
  }, [business]);

  const cancelEdit = useCallback((section) => {
    setEditing(prev => {
      const next = { ...prev };
      delete next[section];
      return next;
    });
  }, []);

  const updateEditField = useCallback((section, field, value) => {
    setEditing(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }, []);

  const updateEditNested = useCallback((section, field, value) => {
    setEditing(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }, []);

  const saveSection = useCallback(async (section) => {
    setSaving(prev => ({ ...prev, [section]: true }));
    try {
      const updated = await businessService.updateSection(user.businessId, section, editing[section]);
      setBusiness(updated);
      cancelEdit(section);
      showSuccess(`${section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')} saved successfully`);
    } catch {
      showError(`Failed to save ${section}`);
    } finally {
      setSaving(prev => ({ ...prev, [section]: false }));
    }
  }, [user, editing, cancelEdit, showSuccess, showError]);

  const saveSignatures = useCallback(async () => {
    setSaving(prev => ({ ...prev, signatures: true }));
    try {
      const updated = await businessService.updateSignatures(user.businessId, editing.signatures);
      setBusiness(updated);
      cancelEdit('signatures');
      showSuccess('Signatures saved successfully');
    } catch {
      showError('Failed to save signatures');
    } finally {
      setSaving(prev => ({ ...prev, signatures: false }));
    }
  }, [user, editing, cancelEdit, showSuccess, showError]);

  const handleLogoChange = useCallback(async (dataUrl) => {
    setSaving(prev => ({ ...prev, branding: true }));
    try {
      const updated = await businessService.updateSection(user.businessId, 'branding', {
        ...business?.branding,
        logo: dataUrl,
      });
      setBusiness(updated);
      showSuccess('Logo updated successfully');
    } catch {
      showError('Failed to update logo');
    } finally {
      setSaving(prev => ({ ...prev, branding: false }));
    }
  }, [user, business, showSuccess, showError]);

  const handleSealChange = useCallback(async (dataUrl) => {
    setSaving(prev => ({ ...prev, branding: true }));
    try {
      const updated = await businessService.updateSection(user.businessId, 'branding', {
        ...business?.branding,
        seal: dataUrl,
      });
      setBusiness(updated);
      showSuccess('Seal updated successfully');
    } catch {
      showError('Failed to update seal');
    } finally {
      setSaving(prev => ({ ...prev, branding: false }));
    }
  }, [user, business, showSuccess, showError]);

  if (loading) {
    return (
      <Box>
        <PageHeader title="Business Settings" subtitle="Manage your company profile, branding, and preferences" />
        <Stack spacing={3}>
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          ))}
        </Stack>
      </Box>
    );
  }

  const biz = business || {};
  const prof = editing.profile || biz.profile || defaultBusiness.profile;
  const cont = editing.contact || biz.contact || defaultBusiness.contact;
  const addr = editing.address || biz.address || defaultBusiness.address;
  const own = editing.owner || biz.owner || defaultBusiness.owner;
  const brand = editing.branding || biz.branding || defaultBusiness.branding;
  const sigs = editing.signatures !== undefined ? editing.signatures : (biz.signatures || []);
  const qs = editing.quotationSettings || biz.quotationSettings || defaultBusiness.quotationSettings;
  const prefs = editing.preferences || biz.preferences || defaultBusiness.preferences;
  const social = editing.socialLinks || biz.socialLinks || defaultBusiness.socialLinks;

  return (
    <Box>
      <PageHeader
        title="Business Settings"
        subtitle="Manage your company profile, branding, and preferences"
      />

      {/* ─── PROFILE SECTION ─── */}
      <SettingsSection
        title="Business Profile"
        description="Basic business information and legal details"
        icon={<BusinessIcon />}
        isEditing={!!editing.profile}
        onEditChange={(val) => val ? startEdit('profile') : cancelEdit('profile')}
        onSave={() => saveSection('profile')}
        loading={saving.profile}
        editContent={
          <Grid container spacing={2.5}>
            <Grid xs={12} sm={6}>
              <FormField label="Business Name" value={prof.businessName} onChange={(e) => updateEditField('profile', 'businessName', e.target.value)} required placeholder="Acme Corporation" />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField label="Legal Business Name" value={prof.legalBusinessName} onChange={(e) => updateEditField('profile', 'legalBusinessName', e.target.value)} placeholder="Acme Corp Pvt Ltd" />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField select label="Business Type" value={prof.businessType} onChange={(e) => updateEditField('profile', 'businessType', e.target.value)}>
                {BUSINESS_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </FormField>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField select label="Industry" value={prof.industry} onChange={(e) => updateEditField('profile', 'industry', e.target.value)}>
                {INDUSTRIES.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
              </FormField>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField label="Business Category" value={prof.businessCategory} onChange={(e) => updateEditField('profile', 'businessCategory', e.target.value)} placeholder="e.g. IT Services" />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField label="Year Established" value={prof.yearEstablished} onChange={(e) => updateEditField('profile', 'yearEstablished', e.target.value)} placeholder="2020" />
            </Grid>
            <Grid xs={12} sm={4}>
              <FormField label="Registration Number" value={prof.registrationNumber} onChange={(e) => updateEditField('profile', 'registrationNumber', e.target.value)} placeholder="REG123456" />
            </Grid>
            <Grid xs={12} sm={4}>
              <FormField label="GST / VAT Number" value={prof.gstVatNumber} onChange={(e) => updateEditField('profile', 'gstVatNumber', e.target.value)} placeholder="22AAAAA0000A1Z5" />
            </Grid>
            <Grid xs={12} sm={4}>
              <FormField label="PAN / TAX Number" value={prof.panTaxNumber} onChange={(e) => updateEditField('profile', 'panTaxNumber', e.target.value)} placeholder="ABCDE1234F" />
            </Grid>
            <Grid xs={12}>
              <FormField label="Business Description" value={prof.description} onChange={(e) => updateEditField('profile', 'description', e.target.value)} multiline rows={3} placeholder="Tell customers about your business..." />
            </Grid>
          </Grid>
        }
      >
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Business Name</Typography>
            <Typography variant="body1" fontWeight={500}>{prof.businessName || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Legal Name</Typography>
            <Typography variant="body1" fontWeight={500}>{prof.legalBusinessName || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Business Type</Typography>
            <Typography variant="body1" fontWeight={500}>{prof.businessType || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Industry</Typography>
            <Typography variant="body1" fontWeight={500}>{prof.industry || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Category</Typography>
            <Typography variant="body1" fontWeight={500}>{prof.businessCategory || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Year Established</Typography>
            <Typography variant="body1" fontWeight={500}>{prof.yearEstablished || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">Registration No.</Typography>
            <Typography variant="body1" fontWeight={500}>{prof.registrationNumber || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">GST/VAT No.</Typography>
            <Typography variant="body1" fontWeight={500}>{prof.gstVatNumber || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">PAN/Tax No.</Typography>
            <Typography variant="body1" fontWeight={500}>{prof.panTaxNumber || '—'}</Typography>
          </Grid>
          {prof.description && (
            <Grid xs={12}>
              <Typography variant="body2" color="text.secondary">Description</Typography>
              <Typography variant="body1" fontWeight={500}>{prof.description}</Typography>
            </Grid>
          )}
        </Grid>
      </SettingsSection>

      <Box sx={{ mt: 3 }} />

      {/* ─── CONTACT INFORMATION ─── */}
      <SettingsSection
        title="Contact Information"
        description="How customers and partners can reach you"
        icon={<ContactMailIcon />}
        isEditing={!!editing.contact}
        onEditChange={(val) => val ? startEdit('contact') : cancelEdit('contact')}
        onSave={() => saveSection('contact')}
        loading={saving.contact}
        editContent={
          <Grid container spacing={2.5}>
            <Grid xs={12} sm={6}>
              <FormField label="Email" type="email" value={cont.email} onChange={(e) => updateEditField('contact', 'email', e.target.value)} placeholder="hello@acme.com" />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField label="Phone" value={cont.phone} onChange={(e) => updateEditField('contact', 'phone', e.target.value)} placeholder="+91 98765 43210" />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField label="Mobile" value={cont.mobile} onChange={(e) => updateEditField('contact', 'mobile', e.target.value)} placeholder="+91 98765 43210" />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField label="WhatsApp" value={cont.whatsapp} onChange={(e) => updateEditField('contact', 'whatsapp', e.target.value)} placeholder="+91 98765 43210" />
            </Grid>
            <Grid xs={12}>
              <FormField label="Website" value={cont.website} onChange={(e) => updateEditField('contact', 'website', e.target.value)} placeholder="https://www.acme.com" />
            </Grid>
          </Grid>
        }
      >
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Email</Typography>
            <Typography variant="body1" fontWeight={500}>{cont.email || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Phone</Typography>
            <Typography variant="body1" fontWeight={500}>{cont.phone || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Mobile</Typography>
            <Typography variant="body1" fontWeight={500}>{cont.mobile || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">WhatsApp</Typography>
            <Typography variant="body1" fontWeight={500}>{cont.whatsapp || '—'}</Typography>
          </Grid>
          <Grid xs={12}>
            <Typography variant="body2" color="text.secondary">Website</Typography>
            <Typography variant="body1" fontWeight={500}>{cont.website || '—'}</Typography>
          </Grid>
        </Grid>
      </SettingsSection>

      <Box sx={{ mt: 3 }} />

      {/* ─── ADDRESS ─── */}
      <SettingsSection
        title="Address"
        description="Your business address"
        icon={<LocationOnIcon />}
        isEditing={!!editing.address}
        onEditChange={(val) => val ? startEdit('address') : cancelEdit('address')}
        onSave={() => saveSection('address')}
        loading={saving.address}
        editContent={
          <Grid container spacing={2.5}>
            <Grid xs={12}>
              <FormField label="Address Line 1" value={addr.addressLine1} onChange={(e) => updateEditField('address', 'addressLine1', e.target.value)} placeholder="123 Business Park, Sector 5" />
            </Grid>
            <Grid xs={12}>
              <FormField label="Address Line 2" value={addr.addressLine2} onChange={(e) => updateEditField('address', 'addressLine2', e.target.value)} placeholder="Building, Floor, Suite..." />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField label="City" value={addr.city} onChange={(e) => updateEditField('address', 'city', e.target.value)} placeholder="Mumbai" />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField label="District" value={addr.district} onChange={(e) => updateEditField('address', 'district', e.target.value)} placeholder="Mumbai Suburban" />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField label="State / Province" value={addr.state} onChange={(e) => updateEditField('address', 'state', e.target.value)} placeholder="Maharashtra" />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField label="Country" value={addr.country} onChange={(e) => updateEditField('address', 'country', e.target.value)} placeholder="India" />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField label="Postal Code" value={addr.postalCode} onChange={(e) => updateEditField('address', 'postalCode', e.target.value)} placeholder="400001" />
            </Grid>
          </Grid>
        }
      >
        <Box>
          {addr.addressLine1 && <Typography variant="body1" fontWeight={500}>{addr.addressLine1}</Typography>}
          {addr.addressLine2 && <Typography variant="body2" color="text.secondary">{addr.addressLine2}</Typography>}
          <Typography variant="body2" color="text.secondary">
            {[addr.city, addr.district, addr.state].filter(Boolean).join(', ')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {[addr.country, addr.postalCode].filter(Boolean).join(' - ')}
          </Typography>
          {!addr.addressLine1 && !addr.city && (
            <Typography variant="body2" color="text.secondary">No address configured</Typography>
          )}
        </Box>
      </SettingsSection>

      <Box sx={{ mt: 3 }} />

      {/* ─── OWNER INFORMATION ─── */}
      <SettingsSection
        title="Owner Information"
        description="Business owner or primary contact details"
        icon={<PersonIcon />}
        isEditing={!!editing.owner}
        onEditChange={(val) => val ? startEdit('owner') : cancelEdit('owner')}
        onSave={() => saveSection('owner')}
        loading={saving.owner}
        editContent={
          <Grid container spacing={2.5}>
            <Grid xs={12} sm={6}>
              <FormField label="Owner Name" value={own.ownerName} onChange={(e) => updateEditField('owner', 'ownerName', e.target.value)} placeholder="John Doe" />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField label="Designation" value={own.designation} onChange={(e) => updateEditField('owner', 'designation', e.target.value)} placeholder="CEO / Founder" />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField label="Email" type="email" value={own.email} onChange={(e) => updateEditField('owner', 'email', e.target.value)} placeholder="john@acme.com" />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormField label="Phone" value={own.phone} onChange={(e) => updateEditField('owner', 'phone', e.target.value)} placeholder="+91 98765 43210" />
            </Grid>
          </Grid>
        }
      >
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Owner Name</Typography>
            <Typography variant="body1" fontWeight={500}>{own.ownerName || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Designation</Typography>
            <Typography variant="body1" fontWeight={500}>{own.designation || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Email</Typography>
            <Typography variant="body1" fontWeight={500}>{own.email || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Phone</Typography>
            <Typography variant="body1" fontWeight={500}>{own.phone || '—'}</Typography>
          </Grid>
        </Grid>
      </SettingsSection>

      <Box sx={{ mt: 3 }} />

      {/* ─── BRANDING ─── */}
      <SettingsSection
        title="Branding"
        description="Logo, colors, and brand identity"
        icon={<PaletteIcon />}
        isEditing={!!editing.branding}
        onEditChange={(val) => val ? startEdit('branding') : cancelEdit('branding')}
        onSave={() => saveSection('branding')}
        loading={saving.branding}
        editContent={
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Business Logo</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Primary Logo</Typography>
                <ImageUpload
                  type="logo"
                  value={brand.logo}
                  onChange={(val) => updateEditNested('branding', 'logo', val)}
                  label="Upload Logo"
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Business Seal</Typography>
                <ImageUpload
                  type="seal"
                  value={brand.seal}
                  onChange={(val) => updateEditNested('branding', 'seal', val)}
                  label="Upload Seal"
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2.5 }} />

            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Color Theme</Typography>
            <Grid container spacing={2.5}>
              <Grid xs={12} sm={4}>
                <FormField
                  label="Primary Color"
                  value={brand.primaryColor}
                  onChange={(e) => updateEditNested('branding', 'primaryColor', e.target.value)}
                  placeholder="#4F46E5"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Box sx={{ width: 24, height: 24, borderRadius: 0.5, bgcolor: brand.primaryColor, mr: 1, border: '1px solid #E2E8F0', flexShrink: 0 }} />
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid xs={12} sm={4}>
                <FormField
                  label="Secondary Color"
                  value={brand.secondaryColor}
                  onChange={(e) => updateEditNested('branding', 'secondaryColor', e.target.value)}
                  placeholder="#0EA5E9"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Box sx={{ width: 24, height: 24, borderRadius: 0.5, bgcolor: brand.secondaryColor, mr: 1, border: '1px solid #E2E8F0', flexShrink: 0 }} />
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid xs={12} sm={4}>
                <FormField
                  label="Accent Color"
                  value={brand.accentColor}
                  onChange={(e) => updateEditNested('branding', 'accentColor', e.target.value)}
                  placeholder="#10B981"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Box sx={{ width: 24, height: 24, borderRadius: 0.5, bgcolor: brand.accentColor, mr: 1, border: '1px solid #E2E8F0', flexShrink: 0 }} />
                      ),
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2.5 }} />

            <Grid container spacing={2.5}>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>Default Font</InputLabel>
                  <Select
                    value={brand.defaultFont}
                    label="Default Font"
                    onChange={(e) => updateEditNested('branding', 'defaultFont', e.target.value)}
                  >
                    {FONTS.map(f => (
                      <MenuItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormField label="Business Tagline" value={brand.tagline} onChange={(e) => updateEditNested('branding', 'tagline', e.target.value)} placeholder="Innovation Meets Excellence" />
              </Grid>
            </Grid>
          </Box>
        }
      >
        <Box>
          <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
            {brand.logo && (
              <Box sx={{ textAlign: 'center' }}>
                <Avatar src={brand.logo} sx={{ width: 80, height: 80, bgcolor: 'grey.100', objectFit: 'contain' }} variant="rounded" />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>Logo</Typography>
              </Box>
            )}
            {brand.seal && (
              <Box sx={{ textAlign: 'center' }}>
                <Avatar src={brand.seal} sx={{ width: 80, height: 80, bgcolor: 'grey.100', objectFit: 'contain' }} variant="rounded" />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>Seal</Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip size="small" label="Primary" sx={{ bgcolor: brand.primaryColor, color: 'white' }} />
            <Chip size="small" label="Secondary" sx={{ bgcolor: brand.secondaryColor, color: 'white' }} />
            <Chip size="small" label="Accent" sx={{ bgcolor: brand.accentColor, color: 'white' }} />
          </Box>
          <Typography variant="body2" color="text.secondary">Font: {brand.defaultFont || 'Not set'}</Typography>
          {brand.tagline && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Tagline: {brand.tagline}</Typography>}
        </Box>
      </SettingsSection>

      <Box sx={{ mt: 3 }} />

      {/* ─── BUSINESS SIGNATURES ─── */}
      <SettingsSection
        title="Business Signatures"
        description="Manage signatures for quotation documents"
        icon={<DrawIcon />}
        isEditing={!!editing.signatures}
        onEditChange={(val) => val ? startEdit('signatures') : cancelEdit('signatures')}
        onSave={saveSignatures}
        loading={saving.signatures}
        editContent={
          <BusinessSignatureManager
            signatures={sigs}
            onChange={(newSigs) => setEditing(prev => ({ ...prev, signatures: newSigs }))}
          />
        }
      >
        <Box>
          {sigs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No signatures configured</Typography>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {sigs.filter(s => s.isActive).map(sig => (
                <Box key={sig._id} sx={{ textAlign: 'center', minWidth: 120 }}>
                  {sig.image ? (
                    <Box component="img" src={sig.image} alt={sig.displayName} sx={{ height: 48, maxWidth: 140, objectFit: 'contain' }} />
                  ) : (
                    <Box sx={{ height: 48, width: 140, borderBottom: '1px solid #94a3b8' }} />
                  )}
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>{sig.displayName}</Typography>
                  {sig.isDefault && <Chip label="Default" size="small" color="warning" sx={{ mt: 0.5, height: 18, fontSize: '0.625rem' }} />}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </SettingsSection>

      <Box sx={{ mt: 3 }} />

      {/* ─── QUOTATION DEFAULTS ─── */}
      <SettingsSection
        title="Quotation Defaults"
        description="Default values used when creating new quotations"
        icon={<ReceiptLongIcon />}
        isEditing={!!editing.quotationSettings}
        onEditChange={(val) => val ? startEdit('quotationSettings') : cancelEdit('quotationSettings')}
        onSave={() => saveSection('quotationSettings')}
        loading={saving.quotationSettings}
        editContent={
          <Box>
            <Grid container spacing={2.5}>
              <Grid xs={12} sm={6}>
                <FormField label="Quotation Prefix" value={qs.quotationPrefix} onChange={(e) => updateEditField('quotationSettings', 'quotationPrefix', e.target.value)} placeholder="QT" helperText="e.g. QT, INV, EST" />
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>Currency</InputLabel>
                  <Select value={qs.currency} label="Currency" onChange={(e) => updateEditField('quotationSettings', 'currency', e.target.value)}>
                    {CURRENCIES.map(c => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormField label="Default Tax Rate" type="number" value={qs.taxPercent} onChange={(e) => updateEditField('quotationSettings', 'taxPercent', Number(e.target.value))} endAdornment={<InputAdornment position="end">%</InputAdornment>} />
              </Grid>
              <Grid xs={12} sm={6}>
                <FormField label="Validity (Days)" type="number" value={qs.validityDays} onChange={(e) => updateEditField('quotationSettings', 'validityDays', Number(e.target.value))} />
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>Header Layout</InputLabel>
                  <Select value={qs.headerLayout} label="Header Layout" onChange={(e) => updateEditField('quotationSettings', 'headerLayout', e.target.value)}>
                    <MenuItem value="logo-left">Logo Left, Details Right</MenuItem>
                    <MenuItem value="logo-right">Details Left, Logo Right</MenuItem>
                    <MenuItem value="centered">Centered (Banner Style)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>Table Style</InputLabel>
                  <Select value={qs.tableStyle} label="Table Style" onChange={(e) => updateEditField('quotationSettings', 'tableStyle', e.target.value)}>
                    <MenuItem value="striped">Striped Rows</MenuItem>
                    <MenuItem value="bordered">Full Borders</MenuItem>
                    <MenuItem value="plain">Clean (No Borders)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2.5 }} />

            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Default Content</Typography>
            <Grid container spacing={2.5}>
              <Grid xs={12}>
                <FormField label="Default Payment Terms" value={qs.paymentTerms} onChange={(e) => updateEditField('quotationSettings', 'paymentTerms', e.target.value)} multiline rows={2} placeholder="50% advance, balance on delivery" helperText="Automatically added to new quotations" />
              </Grid>
              <Grid xs={12}>
                <FormField label="Default Terms & Conditions" value={qs.defaultTerms} onChange={(e) => updateEditField('quotationSettings', 'defaultTerms', e.target.value)} multiline rows={3} placeholder="Valid for 30 days..." />
              </Grid>
              <Grid xs={12}>
                <FormField label="Bank / Payment Details" value={qs.bankDetails} onChange={(e) => updateEditField('quotationSettings', 'bankDetails', e.target.value)} multiline rows={3} placeholder="Bank name, Account number, IFSC..." />
              </Grid>
              <Grid xs={12} sm={6}>
                <FormField label="Footer Text" value={qs.footerText} onChange={(e) => updateEditField('quotationSettings', 'footerText', e.target.value)} placeholder="Thank you for your business!" />
              </Grid>
              <Grid xs={12} sm={6}>
                <FormField label="Document Title" value={qs.quotationTitle} onChange={(e) => updateEditField('quotationSettings', 'quotationTitle', e.target.value)} placeholder="QUOTATION" />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2.5 }} />

            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Document Visibility</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              {[
                { field: 'showLogo', label: 'Logo' },
                { field: 'showBusinessInfo', label: 'Business Info' },
                { field: 'showCustomerInfo', label: 'Customer Info' },
                { field: 'showQuotationNumber', label: 'Quote Number' },
                { field: 'showDates', label: 'Dates' },
                { field: 'showDiscounts', label: 'Discounts' },
                { field: 'showTax', label: 'Tax Info' },
                { field: 'showSubtotal', label: 'Subtotal' },
                { field: 'showSignature', label: 'Signature' },
                { field: 'showBankDetails', label: 'Bank Details' },
                { field: 'showTerms', label: 'Terms & Conditions' },
                { field: 'showNotes', label: 'Notes' },
                { field: 'showFooter', label: 'Footer' },
                { field: 'showItemNotes', label: 'Item Notes' },
              ].map(({ field, label }) => (
                <FormControlLabel
                  key={field}
                  control={
                    <Switch
                      checked={qs[field]}
                      onChange={(e) => updateEditField('quotationSettings', field, e.target.checked)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{label}</Typography>}
                />
              ))}
            </Box>
          </Box>
        }
      >
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Prefix</Typography>
            <Typography variant="body1" fontWeight={500}>{qs.quotationPrefix || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Currency</Typography>
            <Typography variant="body1" fontWeight={500}>{qs.currency || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Tax Rate</Typography>
            <Typography variant="body1" fontWeight={500}>{qs.taxPercent}%</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Validity</Typography>
            <Typography variant="body1" fontWeight={500}>{qs.validityDays} days</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Header Layout</Typography>
            <Typography variant="body1" fontWeight={500}>{qs.headerLayout || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Table Style</Typography>
            <Typography variant="body1" fontWeight={500}>{qs.tableStyle || '—'}</Typography>
          </Grid>
        </Grid>
      </SettingsSection>

      <Box sx={{ mt: 3 }} />

      {/* ─── PREFERENCES ─── */}
      <SettingsSection
        title="Preferences"
        description="Language, timezone, and notification settings"
        icon={<TuneIcon />}
        isEditing={!!editing.preferences}
        onEditChange={(val) => val ? startEdit('preferences') : cancelEdit('preferences')}
        onSave={() => saveSection('preferences')}
        loading={saving.preferences}
        editContent={
          <Grid container spacing={2.5}>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>Language</InputLabel>
                <Select value={prefs.language} label="Language" onChange={(e) => updateEditField('preferences', 'language', e.target.value)}>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="hi">Hindi</MenuItem>
                  <MenuItem value="ar">Arabic</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>Timezone</InputLabel>
                <Select value={prefs.timezone} label="Timezone" onChange={(e) => updateEditField('preferences', 'timezone', e.target.value)}>
                  <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                  <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                  <MenuItem value="Europe/London">Europe/London (GMT)</MenuItem>
                  <MenuItem value="Asia/Dubai">Asia/Dubai (GST)</MenuItem>
                  <MenuItem value="Asia/Singapore">Asia/Singapore (SGT)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={prefs.emailNotifications}
                    onChange={(e) => updateEditField('preferences', 'emailNotifications', e.target.checked)}
                  />
                }
                label="Email Notifications"
              />
            </Grid>
            <Grid xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={prefs.autoSave}
                    onChange={(e) => updateEditField('preferences', 'autoSave', e.target.checked)}
                  />
                }
                label="Auto-save changes"
              />
            </Grid>
          </Grid>
        }
      >
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Language</Typography>
            <Typography variant="body1" fontWeight={500}>{prefs.language === 'en' ? 'English' : prefs.language}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Timezone</Typography>
            <Typography variant="body1" fontWeight={500}>{prefs.timezone || '—'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Email Notifications</Typography>
            <Typography variant="body1" fontWeight={500}>{prefs.emailNotifications ? 'Enabled' : 'Disabled'}</Typography>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Auto-save</Typography>
            <Typography variant="body1" fontWeight={500}>{prefs.autoSave ? 'Enabled' : 'Disabled'}</Typography>
          </Grid>
        </Grid>
      </SettingsSection>

      <Box sx={{ mt: 4 }} />
    </Box>
  );
}
