'use client';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, useTheme, useMediaQuery } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { USER_ROLES } from '@/constants/roles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import SettingsIcon from '@mui/icons-material/Settings';
import PaletteIcon from '@mui/icons-material/Palette';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

const drawerWidth = 280;

const getNavItems = (role) => {
  if (role === USER_ROLES.BUSINESS) {
    return [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/business' },
      { text: 'Quotations', icon: <ReceiptIcon />, path: '/business/quotations' },
      { text: 'Requests', icon: <DescriptionIcon />, path: '/business/requests' },
      { text: 'Products', icon: <InventoryIcon />, path: '/business/products' },
      { text: 'Categories', icon: <CategoryIcon />, path: '/business/categories' },
      { text: 'Customers', icon: <PeopleIcon />, path: '/business/customers' },
      { text: 'Templates', icon: <DescriptionIcon />, path: '/business/templates' },
      { text: 'Quotation Design', icon: <PaletteIcon />, path: '/business/quotation-settings' },
      { text: 'Notifications', icon: <NotificationsIcon />, path: '/business/notifications' },
      { text: 'Settings', icon: <SettingsIcon />, path: '/business/settings' },
    ];
  } else if (role === USER_ROLES.CUSTOMER) {
    return [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/customer' },
      { text: 'Quotations', icon: <ReceiptIcon />, path: '/customer/quotations' },
      { text: 'My Requests', icon: <DescriptionIcon />, path: '/customer/requests' },
      { text: 'Vendors', icon: <StoreIcon />, path: '/customer/vendors' },
      { text: 'Profile', icon: <SettingsIcon />, path: '/customer/profile' },
    ];
  }
  return [];
};

export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  const router = useRouter();
  
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = getNavItems(user?.role);

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box 
          sx={{ 
            width: 32, 
            height: 32, 
            borderRadius: 1.5, 
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.25rem'
          }}
        >
          Q
        </Box>
        <Typography variant="h5" fontWeight={800} color="text.primary" letterSpacing="-0.02em">
          Quotely
        </Typography>
      </Box>
      <Divider />
      
      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== (user?.role === USER_ROLES.BUSINESS ? '/business' : '/customer') && pathname.startsWith(item.path));
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  router.push(item.path);
                  if (isMobile) setSidebarOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  px: 2.5,
                  bgcolor: isActive ? 'primary.light' : 'transparent',
                  color: isActive ? 'primary.dark' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.light' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: isActive ? 'primary.main' : 'inherit'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography fontWeight={isActive ? 600 : 500} fontSize="0.95rem">
                      {item.text}
                    </Typography>
                  } 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: 2, color: 'error.main' }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={<Typography fontWeight={500}>Log Out</Typography>} />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={isMobile && sidebarOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
