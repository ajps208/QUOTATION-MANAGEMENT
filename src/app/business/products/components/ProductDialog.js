'use client';
import { useState, useEffect, useRef } from 'react';
import { Box, Button, Grid, InputAdornment, Typography, IconButton, Tooltip, CircularProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import AppDialog from '@/components/common/AppDialog';
import FormField from '@/components/common/FormField';
import FormGrid from '@/components/common/FormGrid';
import { PRODUCT_STATUS } from '@/constants/statuses';
import { PRODUCT_TYPE } from '@/constants/productTypes';
import { UNITS } from '@/constants/units';
import { processImageUpload } from '@/utils/fileUpload';

const ACCEPT = 'image/png,image/jpeg,image/webp';

export default function ProductDialog({ open, onClose, onSave, product, categories }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    type: PRODUCT_TYPE.PRODUCT,
    unit: UNITS.PIECE,
    basePrice: 0,
    taxPercent: 18,
    description: '',
    status: PRODUCT_STATUS.ACTIVE,
  });
  const [image, setImage] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        categoryId: product.categoryId || '',
        type: product.type || PRODUCT_TYPE.PRODUCT,
        unit: product.unit || UNITS.PIECE,
        basePrice: product.basePrice || 0,
        taxPercent: product.taxPercent ?? 18,
        description: product.description || '',
        status: product.status || PRODUCT_STATUS.ACTIVE,
      });
      setImage(product.image || null);
      setImageMeta(product.imageMeta || null);
    } else {
      setFormData({
        name: '',
        sku: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        type: PRODUCT_TYPE.PRODUCT,
        unit: UNITS.PIECE,
        basePrice: 0,
        taxPercent: 18,
        description: '',
        status: PRODUCT_STATUS.ACTIVE,
      });
      setImage(null);
      setImageMeta(null);
    }
    setImageError('');
  }, [product, open, categories]);

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError('');
    setUploading(true);
    try {
      const result = await processImageUpload(file, { type: 'product' });
      if (result.success) {
        setImage(result.dataUrl);
        setImageMeta({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
        });
      } else {
        setImageError(result.error);
      }
    } catch {
      setImageError('Failed to process file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageMeta(null);
    setImageError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ ...formData, image, imageMeta });
    setLoading(false);
  };

  const categoryOptions = categories.map((cat) => ({ value: cat.id, label: cat.name }));
  const typeOptions = Object.values(PRODUCT_TYPE).map((type) => ({ value: type, label: type }));
  const unitOptions = Object.values(UNITS).map((unit) => ({ value: unit, label: unit }));
  const statusOptions = [
    { value: PRODUCT_STATUS.ACTIVE, label: 'Active' },
    { value: PRODUCT_STATUS.INACTIVE, label: 'Inactive' },
  ];

  const actions = (
    <>
      <Button onClick={onClose} disabled={loading} color="inherit" sx={{ borderRadius: 1 }}>
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={loading || !formData.name || !formData.categoryId}
        variant="contained"
        sx={{ borderRadius: 1, minWidth: 120 }}
      >
        {loading ? 'Saving...' : 'Save Item'}
      </Button>
    </>
  );

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={product ? 'Edit Item' : 'Add New Item'}
      subtitle={product ? 'Update item details below' : 'Fill in the details to add a new item'}
      actions={actions}
      maxWidth="md"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <FormGrid spacing={2.5}>
          <Grid xs={12} sm={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { sm: 'flex-end' }, gap: 1 }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  border: '2px dashed',
                  borderColor: image ? 'transparent' : '#CBD5E1',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: image ? 'transparent' : '#F8FAFC',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  '&:hover': { borderColor: 'primary.light' },
                }}
                onClick={() => !uploading && fileInputRef.current?.click()}
              >
                {image ? (
                  <>
                    <Box
                      component="img"
                      src={image}
                      alt="Product"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {!uploading && (
                      <Tooltip title="Change image">
                        <IconButton
                          size="small"
                          component="label"
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'background.paper',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                            '&:hover': { bgcolor: 'grey.100' },
                          }}
                        >
                          <UploadFileIcon fontSize="small" />
                          <input
                            ref={fileInputRef}
                            hidden
                            type="file"
                            accept={ACCEPT}
                            onChange={handleImageSelect}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 1 }}>
                    {uploading ? (
                      <CircularProgress size={28} />
                    ) : (
                      <>
                        <UploadFileIcon sx={{ color: 'text.disabled', mb: 0.5, fontSize: 28 }} />
                        <Typography variant="caption" color="text.secondary" display="block">
                          Product Image
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
              </Box>
              {image && !uploading && (
                <Tooltip title="Remove image">
                  <IconButton size="small" onClick={handleRemoveImage} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {imageError && (
                <Typography variant="caption" color="error" sx={{ display: 'block', textAlign: { sm: 'right' } }}>
                  {imageError}
                </Typography>
              )}
              {!image && !uploading && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPT}
                  hidden
                  onChange={handleImageSelect}
                />
              )}
            </Box>
          </Grid>

          <Grid xs={12} sm={8}>
            <FormGrid spacing={2.5}>
              <FormField xs={12} label="Item Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required autoFocus placeholder="e.g., Web Design Package" />
              <FormField xs={12} sm={6} label="SKU / Code" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} placeholder="e.g., WEB-001" />
              <FormField xs={12} sm={6} select label="Category" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} required options={categoryOptions} />
            </FormGrid>
          </Grid>

          <FormField xs={12} sm={6} select label="Item Type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} options={typeOptions} />

          <FormField
            xs={12} sm={4}
            label="Base Price"
            type="number"
            value={formData.basePrice}
            onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
            required
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }
            }}
          />
          <FormField xs={12} sm={4} select label="Unit" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} options={unitOptions} />
          <FormField
            xs={12} sm={4}
            label="Tax Rate"
            type="number"
            value={formData.taxPercent}
            onChange={(e) => setFormData({ ...formData, taxPercent: Number(e.target.value) })}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }
            }}
          />

          <FormField
            xs={12}
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={3}
            placeholder="Describe this item..."
          />

          <FormField xs={12} sm={6} select label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} options={statusOptions} />
        </FormGrid>
      </Box>
    </AppDialog>
  );
}
