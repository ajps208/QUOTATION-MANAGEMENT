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

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.industry.toLowerCase().includes(search.toLowerCase())
  );

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
          {filteredVendors.map((vendor) => (
            <Grid xs={12} sm={6} md={4} key={vendor.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 1, '&:hover': { boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }, transition: 'box-shadow 0.2s' }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                      {vendor.logo ? <img src={vendor.logo} alt={vendor.name} width={56} /> : <BusinessIcon />}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                        {vendor.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vendor.industry}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" mb={3} sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {vendor.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label={vendor.type} size="small" variant="outlined" />
                    <Chip label={[vendor.city, vendor.country].filter(Boolean).join(', ')} size="small" variant="outlined" />
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => router.push(`/customer/vendors/${vendor.id}`)}
                  >
                    View Products & Request
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
