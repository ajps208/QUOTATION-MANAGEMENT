"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  TextField,
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
import { mockQuotations, mockCustomers } from "@/data/mock";

// A4 = 794px wide. We scale it to fit the preview container
const PREVIEW_WIDTH = 450;
const A4_WIDTH = 794;
const PREVIEW_SCALE = PREVIEW_WIDTH / A4_WIDTH;
const PREVIEW_HEIGHT = Math.round(1123 * PREVIEW_SCALE);

const SAMPLE_QUOTATION = {
  ...mockQuotations[0],
  quotationNumber: "PREVIEW-001",
};
const SAMPLE_CUSTOMER = mockCustomers[0];

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
      const saved = await quotationSettingsService.saveSettings(
        user.businessId,
        settings,
      );
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

  if (loading)
    return <Typography sx={{ mt: 4, ml: 4 }}>Loading designer...</Typography>;
  if (!settings) return null;

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(initialSettings);

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Action Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 3,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => router.push("/business/templates")}
            sx={{ bgcolor: "grey.100" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Quotation Design
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customize your brand appearance and template layout.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            disabled={!hasChanges}
          >
            Discard Changes
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            {saving ? "Saving..." : "Save Design"}
          </Button>
        </Box>
      </Box>

      {/* Main Content Area (Side by side) */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Panel: Settings Controls */}
        <Box
          sx={{
            width: 480,
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            variant="fullWidth"
            sx={{ borderBottom: "1px solid", borderColor: "divider" }}
          >
            <Tab label="Branding" />
            <Tab label="Layout" />
            <Tab label="Content" />
          </Tabs>

          <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
            {/* Branding Tab */}
            {activeTab === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                    mb={2}
                  >
                    COLORS
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 4,
                      marginTop: 1,
                    }}
                  >
                    <Box>
                      <TextField
                        fullWidth
                        label="Primary Color (Hex)"
                        value={settings.primaryColor}
                        onChange={(e) =>
                          handleChange("primaryColor", e.target.value)
                        }
                        slotProps={{
                          input: {
                            startAdornment: (
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 1,
                                  bgcolor: settings.primaryColor,
                                  mr: 1,
                                  border: "1px solid #e2e8f0",
                                }}
                              />
                            ),
                          },
                        }}
                      />
                    </Box>
                    <Box>
                      <TextField
                        fullWidth
                        label="Accent Color (Hex)"
                        value={settings.accentColor}
                        onChange={(e) =>
                          handleChange("accentColor", e.target.value)
                        }
                        slotProps={{
                          input: {
                            startAdornment: (
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 1,
                                  bgcolor: settings.accentColor,
                                  mr: 1,
                                  border: "1px solid #e2e8f0",
                                }}
                              />
                            ),
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                    mb={2}
                  >
                    TYPOGRAPHY
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 3, mt: 1 }}>
                    <InputLabel>Font Family</InputLabel>
                    <Select
                      value={settings.fontFamily}
                      label="Font Family"
                      onChange={(e) =>
                        handleChange("fontFamily", e.target.value)
                      }
                    >
                      {FONTS.map((f) => (
                        <MenuItem
                          key={f.value}
                          value={f.value}
                          style={{ fontFamily: f.value }}
                        >
                          {f.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                    mb={2}
                  >
                    LOGO SETTINGS
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showLogo}
                        onChange={(e) =>
                          handleChange("showLogo", e.target.checked)
                        }
                      />
                    }
                    label="Show Logo in Header"
                  />
                  <FormControl
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={!settings.showLogo}
                  >
                    <InputLabel>Logo Size</InputLabel>
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
                </Box>
              </Box>
            )}

            {/* Layout Tab */}
            {activeTab === 1 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                    mb={2}
                  >
                    HEADER STYLE
                  </Typography>
                  <FormControl fullWidth sx={{ marginTop:1 }}>
                    {" "}
                    <InputLabel>Layout Style</InputLabel>
                    <Select
                      value={settings.headerLayout}
                      label="Layout Style"
                      onChange={(e) =>
                        handleChange("headerLayout", e.target.value)
                      }
                    >
                      <MenuItem value="logo-left">
                        Logo Left, Details Right
                      </MenuItem>
                      <MenuItem value="logo-right">
                        Details Left, Logo Right
                      </MenuItem>
                      <MenuItem value="centered">
                        Centered (Banner Style)
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                    mb={2}
                  >
                    TABLE STYLE
                  </Typography>
                  <FormControl fullWidth  sx={{ marginTop:1 }}>
                    <InputLabel>Row Style</InputLabel>
                    <Select
                      value={settings.tableStyle}
                      label="Row Style"
                      onChange={(e) =>
                        handleChange("tableStyle", e.target.value)
                      }
                    >
                      <MenuItem value="striped">Striped Rows</MenuItem>
                      <MenuItem value="bordered">Full Borders</MenuItem>
                      <MenuItem value="plain">Clean (No Borders)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Divider />

                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                    mb={2}
                  >
                    SECTION VISIBILITY
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.showBusinessInfo}
                            onChange={(e) =>
                              handleChange("showBusinessInfo", e.target.checked)
                            }
                          />
                        }
                        label="Business Info"
                      />
                    </Box>
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.showCustomerInfo}
                            onChange={(e) =>
                              handleChange("showCustomerInfo", e.target.checked)
                            }
                          />
                        }
                        label="Customer Info"
                      />
                    </Box>
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.showQuotationNumber}
                            onChange={(e) =>
                              handleChange(
                                "showQuotationNumber",
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Quote Number"
                      />
                    </Box>
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.showDates}
                            onChange={(e) =>
                              handleChange("showDates", e.target.checked)
                            }
                          />
                        }
                        label="Dates"
                      />
                    </Box>
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.showDiscounts}
                            onChange={(e) =>
                              handleChange("showDiscounts", e.target.checked)
                            }
                          />
                        }
                        label="Discounts"
                      />
                    </Box>
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.showTax}
                            onChange={(e) =>
                              handleChange("showTax", e.target.checked)
                            }
                          />
                        }
                        label="Tax Info"
                      />
                    </Box>
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.showSignature}
                            onChange={(e) =>
                              handleChange("showSignature", e.target.checked)
                            }
                          />
                        }
                        label="Signature Line"
                      />
                    </Box>
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.showBankDetails}
                            onChange={(e) =>
                              handleChange("showBankDetails", e.target.checked)
                            }
                          />
                        }
                        label="Bank Details"
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Content Tab */}
            {activeTab === 2 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Document Title"
                    value={settings.quotationTitle}
                    onChange={(e) =>
                      handleChange("quotationTitle", e.target.value)
                    }
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Default Terms & Conditions"
                    value={settings.defaultTerms}
                    onChange={(e) =>
                      handleChange("defaultTerms", e.target.value)
                    }
                    helperText="Will be used if a specific quotation doesn't have custom terms."
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Bank / Payment Details"
                    value={settings.bankDetails}
                    onChange={(e) =>
                      handleChange("bankDetails", e.target.value)
                    }
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Footer Text"
                    value={settings.footerText}
                    onChange={(e) => handleChange("footerText", e.target.value)}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Right Panel: Live Preview */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "grey.100",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            overflowY: "auto",
            p: 6,
          }}
        >
          <Box
            sx={{
              width: PREVIEW_WIDTH,
              height: PREVIEW_HEIGHT,
              bgcolor: "white",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                transform: `scale(${PREVIEW_SCALE})`,
                transformOrigin: "top left",
                width: A4_WIDTH,
                position: "absolute",
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
