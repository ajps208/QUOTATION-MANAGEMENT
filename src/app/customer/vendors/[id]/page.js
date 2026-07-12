'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Card, CardContent, Grid, Button, IconButton, Chip, Divider, Badge } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

import { businessService } from '@/services/businessService';
import { productService } from '@/services/productService';
import { useCartStore } from '@/store/useCartStore';
import { useSnackbar } from '@/hooks/useSnackbar';
import { formatCurrency } from '@/utils/formatters';
import AppSearch from '@/components/common/AppSearch';
import EmptyState from '@/components/common/EmptyState';

export default function VendorDetailsPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const vendorId = unwrappedParams.id;
  
  const { showError, showSuccess } = useSnackbar();
  const cartStore = useCartStore();
  
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Local quantity tracking before adding to cart
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorData, productsData] = await Promise.all([
          businessService.getBusinessById(vendorId),
          productService.getProducts(vendorId)
        ]);
        setVendor(vendorData);
        setProducts(productsData);
        
        // Initialize quantities to 1 for all products
        const initialQs = {};
        productsData.forEach(p => initialQs[p.id] = p.minQuantity || 1);
        setQuantities(initialQs);
        
      } catch (error) {
        showError('Vendor not found');
        router.push('/customer/vendors');
      } finally {
        setLoading(false);
      }
    };
    
    if (vendorId) fetchData();
  }, [vendorId, router]);

  const handleQuantityChange = (productId, delta, minQty = 1) => {
    setQuantities(prev => {
      const current = prev[productId] || minQty;
      const next = current + delta;
      return { ...prev, [productId]: Math.max(minQty, next) };
    });
  };

  const handleAddToCart = (product) => {
    const qty = quantities[product.id] || 1;
    cartStore.addItem(product, qty);
    showSuccess(`Added ${qty} ${product.name} to your request cart`);
  };

  if (loading) return <Typography>Loading vendor details...</Typography>;
  if (!vendor) return null;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const isDifferentVendorInCart = cartStore.businessId && cartStore.businessId !== vendor.id;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => router.push('/customer/vendors')} sx={{ bgcolor: 'background.paper' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={700}>{vendor.name}</Typography>
            <Typography variant="body2" color="text.secondary">{vendor.industry}</Typography>
          </Box>
        </Box>
        
        <Button 
          variant="contained" 
          startIcon={
            <Badge badgeContent={cartStore.getTotalItems()} color="error">
              <ShoppingCartIcon />
            </Badge>
          }
          onClick={() => router.push('/customer/vendors/cart')}
        >
          View Request Cart
        </Button>
      </Box>

      {isDifferentVendorInCart && (
        <Card sx={{ mb: 4, bgcolor: 'warning.light', color: 'warning.dark', borderRadius: 2 }}>
          <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="body2" fontWeight={600}>
              Note: Your cart contains items from a different vendor. Adding items from {vendor.name} will clear your current cart.
            </Typography>
          </CardContent>
        </Card>
      )}

      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="body1" mb={2}>{vendor.description}</Typography>
          <Box sx={{ display: 'flex', gap: 3, color: 'text.secondary', flexWrap: 'wrap' }}>
            <Typography variant="body2"><strong>Email:</strong> {vendor.email}</Typography>
            <Typography variant="body2"><strong>Phone:</strong> {vendor.phone}</Typography>
            <Typography variant="body2"><strong>Location:</strong> {vendor.city}, {vendor.country}</Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>Products & Services</Typography>
        <AppSearch value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search catalog..." />
      </Box>

      {filteredProducts.length === 0 ? (
        <EmptyState 
          title="No products found" 
          description={search ? 'No products match your search.' : 'This vendor has not added any products yet.'} 
        />
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid xs={12} md={6} lg={4} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" fontWeight={600} lineHeight={1.2} pr={2}>
                      {product.name}
                    </Typography>
                    <Chip label={product.type} size="small" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    SKU: {product.sku}
                  </Typography>
                  <Typography variant="h5" color="primary.main" fontWeight={700} mb={2}>
                    {formatCurrency(product.basePrice)} <Typography component="span" variant="body2" color="text.secondary">/ {product.unit}</Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                  </Typography>
                </CardContent>
                <Divider />
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.default' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
                    <IconButton size="small" onClick={() => handleQuantityChange(product.id, -1, product.minQuantity)}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ px: 2, fontWeight: 600, minWidth: 40, textAlign: 'center' }}>
                      {quantities[product.id] || product.minQuantity || 1}
                    </Typography>
                    <IconButton size="small" onClick={() => handleQuantityChange(product.id, 1, product.minQuantity)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Button 
                    variant="contained" 
                    size="small"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
