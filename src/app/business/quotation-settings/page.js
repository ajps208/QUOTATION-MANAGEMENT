"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Tab,
  Tabs,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/useAuthStore";
import { businessService } from "@/services/businessService";
import { quotationSettingsService } from "@/services/quotationSettingsService";
import { useSnackbar } from "@/hooks/useSnackbar";
import QuotationDocument from "@/components/quotation/QuotationDocument";
import FormField from "@/components/common/FormField";
import FormSection from "@/components/common/FormSection";
import AppButton from "@/components/common/AppButton";

const A4_WIDTH = 794;
const SAMPLE_QUOTATION = {
  quotationNumber: 'PREVIEW-001',
  quotationDate: new Date().toISOString(),
  expiryDate: new Date(Date.now() + 30 * 86400000).toISOString(),
  items: [
    { name: 'Web Design Package', quantity: 1, unitPrice: 45000, discountType: 'NONE', discountValue: 0, taxPercent: 18 },
    { name: 'SEO Optimization', quantity: 3, unitPrice: 8000, discountType: 'NONE', discountValue: 0, taxPercent: 18 },
  ],
  overallDiscount: { type: 'NONE', value: 0 },
  specialDiscounts: [],
  additionalCharges: [],
  paymentTerms: '50% advance, balance on delivery',
  terms: 'Valid for 30 days.',
  customerNotes: 'Looking forward to working with you.',
  businessNotes: '',
};
const SAMPLE_CUSTOMER = {
  name: 'Rohan Mehta',
  companyName: 'TechVision Pvt Ltd',
  email: 'rohan@techvision.example.com',
  phone: '+91 9876543210',
  billingAddress: '12, Business Hub, Andheri East, Mumbai - 400069',
};

const FONTS = [
  { value: "Inter, sans-serif", label: "Inter (Modern Sans)" },
  { value: "Roboto, sans-serif", label: "Roboto (Clean Sans)" },
  { value: "Georgia, serif", label: "Georgia (Classic Serif)" },
  { value: "monospace", label: "Monospace" },
];

export default function QuotationSettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();

  const [business, setBusiness] = useState(null);
  const [settings, setSettings] = useState(null);
  const [initialSettings, setInitialSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.businessId) return;
      try {
        const [biz, currentSettings] = await Promise.all([
          businessService.getBusinessById(user.businessId),
          quotationSettingsService.getSettingsByBusiness(user.businessId),
        ]);
        setBusiness(biz);
        setSettings(currentSettings);
        setInitialSettings(currentSettings);
      } catch (err) {
        showError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await quotationSettingsService.updateSettings(user.businessId, settings);
      setSettings(saved);
      setInitialSettings(saved);
      showSuccess("Quotation design saved successfully");
    } catch (err) {
      showError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(initialSettings);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <Typography color="text.secondary">Loading designer...</Typography>
      </Box>
    );
  }
  if (!settings) return null;

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  const fontOptions = FONTS.map(f => ({ value: f.value, label: f.label }));

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Top Action Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          p: { xs: 2, md: 3 },
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0 }}>
          <IconButton
            onClick={() => router.push("/business/templates")}
            sx={{ bgcolor: "grey.100", border: '1px solid', borderColor: 'divider', flexShrink: 0 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" }, letterSpacing: '-0.02em' }}>
              Quotation Design
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "block" }, mt: 0.25 }}>
              Customize your brand appearance and template layout.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, flexShrink: 0 }}>
          <AppButton
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            disabled={!hasChanges}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            Discard
          </AppButton>
          <AppButton
            variant="contained"
            startIcon={!saving && <SaveIcon />}
            onClick={handleSave}
            disabled={!hasChanges || saving}
            loading={saving}
          >
            {saving ? "Saving..." : "Save"}
          </AppButton>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        variant="fullWidth"
        sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
      >
        <Tab label="Branding" />
        <Tab label="Layout" />
        <Tab label="Content" />
      </Tabs>

      {/* Settings Content */}
      <Box sx={{ p: { xs: 2, md: 3 }, overflowY: "auto" }}>
        {/* Branding Tab */}
        {activeTab === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600, mx: "auto" }}>
            <FormSection title="Colors" description="Set your brand colors for the quotation document">
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                <FormField
                  fullWidth
                  label="Primary Color (Hex)"
                  value={settings.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  placeholder="#4F46E5"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Box sx={{
                          width: 24,
                          height: 24,
                          borderRadius: 0.5,
                          bgcolor: settings.primaryColor,
                          mr: 1,
                          border: "1px solid #E2E8F0",
                          flexShrink: 0,
                        }} />
                      ),
                    },
                  }}
                />
                <FormField
                  fullWidth
                  label="Accent Color (Hex)"
                  value={settings.accentColor}
                  onChange={(e) => handleChange("accentColor", e.target.value)}
                  placeholder="#0EA5E9"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Box sx={{
                          width: 24,
                          height: 24,
                          borderRadius: 0.5,
                          bgcolor: settings.accentColor,
                          mr: 1,
                          border: "1px solid #E2E8F0",
                          flexShrink: 0,
                        }} />
                      ),
                    },
                  }}
                />
              </Box>
            </FormSection>

            <FormSection title="Typography" description="Choose the font family for your documents">
              <FormControl fullWidth>
                <InputLabel sx={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>Font Family</InputLabel>
                <Select
                  value={settings.fontFamily}
                  label="Font Family"
                  onChange={(e) => handleChange("fontFamily", e.target.value)}
                >
                  {FONTS.map((f) => (
                    <MenuItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                      {f.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </FormSection>

            <FormSection title="Logo Settings" description="Control logo visibility and sizing">
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showLogo}
                    onChange={(e) => handleChange("showLogo", e.target.checked)}
                  />
                }
                label="Show Logo in Header"
              />
              <FormControl fullWidth disabled={!settings.showLogo} sx={{ mt: 2 }}>
                <InputLabel sx={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>Logo Size</InputLabel>
                <Select
                  value={settings.logoSize}
                  label="Logo Size"
                  onChange={(e) => handleChange("logoSize", e.target.value)}
                >
                  <MenuItem value="sm">Small</MenuItem>
                  <MenuItem value="md">Medium</MenuItem>
                  <MenuItem value="lg">Large</MenuItem>
                </Select>
              </FormControl>
            </FormSection>
          </Box>
        )}

        {/* Layout Tab */}
        {activeTab === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600, mx: "auto" }}>
            <FormSection title="Header Style" description="Choose the layout for the document header">
              <FormControl fullWidth>
                <InputLabel sx={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>Layout Style</InputLabel>
                <Select
                  value={settings.headerLayout}
                  label="Layout Style"
                  onChange={(e) => handleChange("headerLayout", e.target.value)}
                >
                  <MenuItem value="logo-left">Logo Left, Details Right</MenuItem>
                  <MenuItem value="logo-right">Details Left, Logo Right</MenuItem>
                  <MenuItem value="centered">Centered (Banner Style)</MenuItem>
                </Select>
              </FormControl>
            </FormSection>

            <FormSection title="Table Style" description="Choose how line items appear in the table">
              <FormControl fullWidth>
                <InputLabel sx={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>Row Style</InputLabel>
                <Select
                  value={settings.tableStyle}
                  label="Row Style"
                  onChange={(e) => handleChange("tableStyle", e.target.value)}
                >
                  <MenuItem value="striped">Striped Rows</MenuItem>
                  <MenuItem value="bordered">Full Borders</MenuItem>
                  <MenuItem value="plain">Clean (No Borders)</MenuItem>
                </Select>
              </FormControl>
            </FormSection>

            <FormSection title="Section Visibility" description="Toggle which sections appear on the document">
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                {[
                  { field: "showBusinessInfo", label: "Business Info" },
                  { field: "showCustomerInfo", label: "Customer Info" },
                  { field: "showQuotationNumber", label: "Quote Number" },
                  { field: "showDates", label: "Dates" },
                  { field: "showDiscounts", label: "Discounts" },
                  { field: "showTax", label: "Tax Info" },
                  { field: "showSignature", label: "Signature Line" },
                  { field: "showBankDetails", label: "Bank Details" },
                ].map(({ field, label }) => (
                  <FormControlLabel
                    key={field}
                    control={
                      <Switch
                        checked={settings[field]}
                        onChange={(e) => handleChange(field, e.target.checked)}
                        size="small"
                      />
                    }
                    label={<Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{label}</Typography>}
                  />
                ))}
              </Box>
            </FormSection>
          </Box>
        )}

        {/* Content Tab */}
        {activeTab === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600, mx: "auto" }}>
            <FormSection title="Document Content" description="Customize default text content for quotations">
              <FormField
                fullWidth
                label="Document Title"
                value={settings.quotationTitle}
                onChange={(e) => handleChange("quotationTitle", e.target.value)}
                placeholder="Quotation"
              />
              <FormField
                fullWidth
                multiline
                rows={3}
                label="Default Terms & Conditions"
                value={settings.defaultTerms}
                onChange={(e) => handleChange("defaultTerms", e.target.value)}
                placeholder="Valid for 30 days..."
                helperText="Used when a quotation doesn't have custom terms."
              />
              <FormField
                fullWidth
                multiline
                rows={3}
                label="Bank / Payment Details"
                value={settings.bankDetails}
                onChange={(e) => handleChange("bankDetails", e.target.value)}
                placeholder="Bank name, Account number, IFSC..."
              />
              <FormField
                fullWidth
                label="Footer Text"
                value={settings.footerText}
                onChange={(e) => handleChange("footerText", e.target.value)}
                placeholder="Thank you for your business!"
              />
            </FormSection>
          </Box>
        )}

        {/* Live Preview */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              width: "100%",
              maxWidth: 360,
              aspectRatio: "794 / 1123",
              bgcolor: "white",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              borderRadius: 1,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                transform: `scale(${100 / 100}%)`,
                transformOrigin: "top left",
                width: A4_WIDTH,
              }}
            >
              {business && (
                <QuotationDocument
                  business={business}
                  customer={SAMPLE_CUSTOMER}
                  quotation={SAMPLE_QUOTATION}
                  settings={settings}
                  scale={1}
                  printMode
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
