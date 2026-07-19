"use client";
import { useState, useEffect } from "react";
import {
  Box, Typography, Divider, Switch, FormControlLabel, Select,
  MenuItem, FormControl, InputLabel, IconButton, Tab, Tabs, Grid,
  InputAdornment,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/useAuthStore";
import { businessService } from "@/services/businessService";
import { useSnackbar } from "@/hooks/useSnackbar";
import QuotationDocument from "@/components/quotation/QuotationDocument";
import BusinessSignatureManager from "@/components/business/BusinessSignatureManager";
import { flattenBusiness, flattenQuotationSettings } from "@/utils/businessHelpers";
import FormField from "@/components/common/FormField";
import FormSection from "@/components/common/FormSection";
import AppButton from "@/components/common/AppButton";

const A4_WIDTH = 794;
const PREVIEW_WIDTH = 360;
const PREVIEW_SCALE = PREVIEW_WIDTH / A4_WIDTH;

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
  const [flatBusiness, setFlatBusiness] = useState(null);
  const [qsSettings, setQsSettings] = useState(null);
  const [initialSettings, setInitialSettings] = useState(null);
  const [signatures, setSignatures] = useState([]);
  const [initialSignatures, setInitialSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.businessId) return;
      try {
        const biz = await businessService.getBusinessById(user.businessId);
        setBusiness(biz);
        setFlatBusiness(flattenBusiness(biz));

        const settings = flattenQuotationSettings(biz);
        setQsSettings(settings);
        setInitialSettings(settings);

        const sigs = (biz.signatures || []).map(s => ({
          _id: s._id,
          type: s.type,
          displayName: s.displayName,
          image: s.image,
          uploadedBy: s.uploadedBy,
          uploadedAt: s.uploadedAt,
          isDefault: s.isDefault,
          isActive: s.isActive,
          order: s.order,
        }));
        setSignatures(sigs);
        setInitialSignatures(sigs);
      } catch {
        showError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, showError]);

  const handleSettingChange = (field, value) => {
    setQsSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedBiz = await businessService.updateSection(user.businessId, 'quotation-defaults', {
        quotationPrefix: qsSettings.quotationPrefix,
        currency: qsSettings.currency,
        taxPercent: qsSettings.taxPercent,
        validityDays: qsSettings.validityDays,
        paymentTerms: qsSettings.paymentTerms,
        defaultTerms: qsSettings.defaultTerms,
        bankDetails: qsSettings.bankDetails,
        footerText: qsSettings.footerText,
        quotationTitle: qsSettings.quotationTitle,
        dateFormat: qsSettings.dateFormat,
        headerLayout: qsSettings.headerLayout,
        tableStyle: qsSettings.tableStyle,
        fontSize: qsSettings.fontSize,
        logoSize: qsSettings.logoSize,
        showLogo: qsSettings.showLogo,
        showBusinessInfo: qsSettings.showBusinessInfo,
        showCustomerInfo: qsSettings.showCustomerInfo,
        showQuotationNumber: qsSettings.showQuotationNumber,
        showDates: qsSettings.showDates,
        showDiscounts: qsSettings.showDiscounts,
        showTax: qsSettings.showTax,
        showSubtotal: qsSettings.showSubtotal,
        showItemNotes: qsSettings.showItemNotes,
        showTerms: qsSettings.showTerms,
        showNotes: qsSettings.showNotes,
        showSignature: qsSettings.showSignature,
        showBankDetails: qsSettings.showBankDetails,
        showFooter: qsSettings.showFooter,
      });

      await businessService.updateSignatures(user.businessId, signatures);

      setBusiness(updatedBiz);
      setFlatBusiness(flattenBusiness(updatedBiz));
      const settings = flattenQuotationSettings(updatedBiz);
      setQsSettings(settings);
      setInitialSettings(settings);
      setInitialSignatures([...signatures]);
      showSuccess("Quotation design saved successfully");
    } catch {
      showError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setQsSettings(initialSettings);
    setSignatures(initialSignatures.map(s => ({ ...s })));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <Typography color="text.secondary">Loading designer...</Typography>
      </Box>
    );
  }
  if (!qsSettings) return null;

  const hasChanges = JSON.stringify(qsSettings) !== JSON.stringify(initialSettings) ||
    JSON.stringify(signatures) !== JSON.stringify(initialSignatures);

  return (
    <Box sx={{ overflow: 'hidden' }}>
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
            onClick={() => router.push("/business/settings")}
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

      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        variant="fullWidth"
        sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
      >
        <Tab label="Branding" />
        <Tab label="Layout" />
        <Tab label="Content" />
        <Tab label="Signatures" />
      </Tabs>

      <Box sx={{ p: { xs: 2, md: 3 }, overflowY: "auto" }}>
        {activeTab === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600, mx: "auto" }}>
            <FormSection title="Colors" description="Set your brand colors for the quotation document">
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                <FormField
                  fullWidth
                  label="Primary Color (Hex)"
                  value={qsSettings.primaryColor}
                  onChange={(e) => handleSettingChange("primaryColor", e.target.value)}
                  placeholder="#4F46E5"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Box sx={{ width: 24, height: 24, borderRadius: 0.5, bgcolor: qsSettings.primaryColor, mr: 1, border: "1px solid #E2E8F0", flexShrink: 0 }} />
                      ),
                    },
                  }}
                />
                <FormField
                  fullWidth
                  label="Accent Color (Hex)"
                  value={qsSettings.accentColor}
                  onChange={(e) => handleSettingChange("accentColor", e.target.value)}
                  placeholder="#0EA5E9"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Box sx={{ width: 24, height: 24, borderRadius: 0.5, bgcolor: qsSettings.accentColor, mr: 1, border: "1px solid #E2E8F0", flexShrink: 0 }} />
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
                  value={qsSettings.fontFamily}
                  label="Font Family"
                  onChange={(e) => handleSettingChange("fontFamily", e.target.value)}
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
                    checked={qsSettings.showLogo}
                    onChange={(e) => handleSettingChange("showLogo", e.target.checked)}
                  />
                }
                label="Show Logo in Header"
              />
              <FormControl fullWidth disabled={!qsSettings.showLogo} sx={{ mt: 2 }}>
                <InputLabel sx={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>Logo Size</InputLabel>
                <Select
                  value={qsSettings.logoSize}
                  label="Logo Size"
                  onChange={(e) => handleSettingChange("logoSize", e.target.value)}
                >
                  <MenuItem value="sm">Small</MenuItem>
                  <MenuItem value="md">Medium</MenuItem>
                  <MenuItem value="lg">Large</MenuItem>
                </Select>
              </FormControl>
            </FormSection>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600, mx: "auto" }}>
            <FormSection title="Header Style" description="Choose the layout for the document header">
              <FormControl fullWidth>
                <InputLabel sx={{ whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>Layout Style</InputLabel>
                <Select
                  value={qsSettings.headerLayout}
                  label="Layout Style"
                  onChange={(e) => handleSettingChange("headerLayout", e.target.value)}
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
                  value={qsSettings.tableStyle}
                  label="Row Style"
                  onChange={(e) => handleSettingChange("tableStyle", e.target.value)}
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
                        checked={qsSettings[field]}
                        onChange={(e) => handleSettingChange(field, e.target.checked)}
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

        {activeTab === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600, mx: "auto" }}>
            <FormSection title="Document Content" description="Customize default text content for quotations">
              <FormField
                fullWidth
                label="Document Title"
                value={qsSettings.quotationTitle}
                onChange={(e) => handleSettingChange("quotationTitle", e.target.value)}
                placeholder="Quotation"
              />
              <FormField
                fullWidth
                multiline
                rows={3}
                label="Default Terms & Conditions"
                value={qsSettings.defaultTerms}
                onChange={(e) => handleSettingChange("defaultTerms", e.target.value)}
                placeholder="Valid for 30 days..."
                helperText="Used when a quotation doesn't have custom terms."
              />
              <FormField
                fullWidth
                multiline
                rows={3}
                label="Bank / Payment Details"
                value={qsSettings.bankDetails}
                onChange={(e) => handleSettingChange("bankDetails", e.target.value)}
                placeholder="Bank name, Account number, IFSC..."
              />
              <FormField
                fullWidth
                label="Footer Text"
                value={qsSettings.footerText}
                onChange={(e) => handleSettingChange("footerText", e.target.value)}
                placeholder="Thank you for your business!"
              />
            </FormSection>
          </Box>
        )}

        {activeTab === 3 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600, mx: "auto" }}>
            <FormSection title="Signatures" description="Manage signature images for your quotation documents">
              <FormControlLabel
                control={
                  <Switch
                    checked={qsSettings.showSignature}
                    onChange={(e) => handleSettingChange("showSignature", e.target.checked)}
                  />
                }
                label="Show Signature on Documents"
              />
              {qsSettings.showSignature && (
                <Box sx={{ mt: 3 }}>
                  <BusinessSignatureManager
                    signatures={signatures}
                    onChange={setSignatures}
                  />
                </Box>
              )}
            </FormSection>
          </Box>
        )}

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
                transform: `scale(${PREVIEW_SCALE})`,
                transformOrigin: "top left",
                width: A4_WIDTH,
              }}
            >
              {flatBusiness && (
                <QuotationDocument
                  business={flatBusiness}
                  customer={SAMPLE_CUSTOMER}
                  quotation={SAMPLE_QUOTATION}
                  settings={qsSettings}
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
