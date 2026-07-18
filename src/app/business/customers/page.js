'use client';
import { useState, useEffect } from 'react';
import { Box, IconButton, Card } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useAuthStore } from '@/store/useAuthStore';
import { customerService } from '@/services/customerService';
import PageHeader from '@/components/common/PageHeader';
import AppTable from '@/components/common/AppTable';
import AppSearch from '@/components/common/AppSearch';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useSnackbar } from '@/hooks/useSnackbar';
import CustomerDialog from './components/CustomerDialog';

export default function CustomersPage() {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const fetchCustomers = async () => {
    if (!user?.businessId) return;
    setLoading(true);
    try {
      const data = await customerService.getCustomers(user.businessId);
      setCustomers(data);
    } catch (error) {
      showError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [user]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await customerService.deleteCustomer(customerToDelete.id);
      showSuccess('Customer deleted successfully');
      fetchCustomers();
    } catch (error) {
      showError('Failed to delete customer');
    } finally {
      setConfirmOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedCustomer) {
        await customerService.updateCustomer(selectedCustomer.id, formData);
        showSuccess('Customer updated successfully');
      } else {
        await customerService.createCustomer({ ...formData, businessId: user.businessId });
        showSuccess('Customer created successfully');
      }
      fetchCustomers();
      setDialogOpen(false);
    } catch (error) {
      showError('Failed to save customer');
    }
  };

  const columns = [
    { field: 'name', label: 'Contact Name' },
    { field: 'companyName', label: 'Company', hideOnMobile: true },
    { field: 'email', label: 'Email', hideOnMobile: true },
    { field: 'phone', label: 'Phone' },
    { field: 'city', label: 'City', hideOnMobile: true },
    {
      field: 'actions',
      label: 'Actions',
      align: 'right',
      width: 120,
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(row); }} size="small" color="primary">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteClick(row); }} size="small" color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <PageHeader 
        title="Customers" 
        subtitle="Manage your client database"
        actionLabel="Add Customer"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <Box sx={{ mb: 4 }}>
        <AppSearch 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search by name, company or email..."
        />
      </Box>

      <Card sx={{ overflow: 'hidden' }}>
        <AppTable 
          columns={columns}
          data={filteredCustomers}
          onRowClick={(row) => handleEdit(row)}
          emptyState={
            <EmptyState 
              title="No customers found" 
              description={search ? 'Try adjusting your search query' : 'Add your first customer to start generating quotations.'}
            />
          }
        />
      </Card>

      {dialogOpen && (
        <CustomerDialog 
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
          customer={selectedCustomer}
        />
      )}

      <ConfirmDialog 
        open={confirmOpen}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customerToDelete?.name}"? This action cannot be undone.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
