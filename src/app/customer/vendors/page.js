'use client';
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Avatar } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { businessService } from '@/services/businessService';
import PageHeader from '@/components/common/PageHeader';
import AppSearch from '@/components/common/AppSearch';
import EmptyState from '@/components/common/EmptyState';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useRouter } from 'next/navigation';

export default function VendorsPage() {
  const router = useRouter();
  const { showError } = useSnackbar();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await businessService.getBusinesses();
        setVendors(data);
      } catch (error) {
        showError('Failed to load vendors');
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(v => {
    const name = v.name || v.profile?.businessName || '';
    const industry = v.industry || v.profile?.industry || '';
    const q = search.toLowerCase();
    return name.toLowerCase().includes(q) || industry.toLowerCase().includes(q);
  });

  return (
    <Box>
      <PageHeader 
        title="Vendors" 
        subtitle="Discover businesses and request quotations"
      />

      <Box sx={{ mb: 4, maxWidth: 500 }}>
        <AppSearch 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search by business name or industry..."
        />
      </Box>

      {loading ? (
        <Typography>Loading vendors...</Typography>
      ) : filteredVendors.length === 0 ? (
        <EmptyState 
          title="No vendors found" 
          description={search ? 'Try adjusting your search criteria.' : 'There are no businesses registered yet.'}
        />
      ) : (
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {filteredVendors.map((vendor) => {
            const name = vendor.name || vendor.profile?.businessName || 'Unknown';
            const industry = vendor.industry || vendor.profile?.industry || '';
            const description = vendor.description || vendor.profile?.description || '';
            const logo = vendor.logo || vendor.branding?.logo || '';
            const type = vendor.type || vendor.profile?.type || '';
            const city = vendor.city || vendor.address?.city || '';
            const country = vendor.country || vendor.address?.country || '';
            return (
            <Grid xs={12} sm={6} md={4} key={vendor.id || vendor._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 1, '&:hover': { boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }, transition: 'box-shadow 0.2s' }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                      {logo ? <img src={logo} alt={name} width={56} /> : <BusinessIcon />}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                        {name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {industry}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" mb={3} sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {type && <Chip label={type} size="small" variant="outlined" />}
                    <Chip label={[city, country].filter(Boolean).join(', ')} size="small" variant="outlined" />
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => router.push(`/customer/vendors/${vendor.id || vendor._id}`)}
                  >
                    View Products & Request
                  </Button>
                </Box>
              </Card>
            </Grid>
          )})}
        </Grid>
      )}
    </Box>
  );
}
