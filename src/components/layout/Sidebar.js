'use client';
import { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Collapse, useTheme, useMediaQuery } from '@mui/material';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BuildIcon from '@mui/icons-material/Build';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

const drawerWidth = 260;

const businessNavStructure = [
  { type: 'item', text: 'Dashboard', icon: <DashboardIcon />, path: '/business' },
  { type: 'item', text: 'Quotations', icon: <ReceiptIcon />, path: '/business/quotations' },
  { type: 'item', text: 'Requests', icon: <DescriptionIcon />, path: '/business/requests' },
  {
    type: 'section',
    text: 'Operations',
    icon: <BuildIcon />,
    children: [
      { text: 'Products', icon: <InventoryIcon />, path: '/business/products' },
      { text: 'Categories', icon: <CategoryIcon />, path: '/business/categories' },
      { text: 'Customers', icon: <PeopleIcon />, path: '/business/customers' },
    ],
  },
  {
    type: 'section',
    text: 'Others',
    icon: <MoreHorizIcon />,
    children: [
      { text: 'Templates', icon: <DescriptionIcon />, path: '/business/templates' },
      { text: 'Quotation Design', icon: <PaletteIcon />, path: '/business/quotation-settings' },
      { text: 'Notifications', icon: <NotificationsIcon />, path: '/business/notifications' },
      { text: 'Settings', icon: <SettingsIcon />, path: '/business/settings' },
    ],
  },
];

const customerNavItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/customer' },
  { text: 'Quotations', icon: <ReceiptIcon />, path: '/customer/quotations' },
  { text: 'My Requests', icon: <DescriptionIcon />, path: '/customer/requests' },
  { text: 'Vendors', icon: <StoreIcon />, path: '/customer/vendors' },
  { text: 'Profile', icon: <SettingsIcon />, path: '/customer/profile' },
];

export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  const [expandedSections, setExpandedSections] = useState({});

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleSection = (sectionText) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionText]: !prev[sectionText],
    }));
  };

  const isPathActive = (path) => {
    const basePath = user?.role === USER_ROLES.BUSINESS ? '/business' : '/customer';
    return pathname === path || (path !== basePath && pathname.startsWith(path));
  };

  const isAnyChildActive = (children) => children.some((child) => isPathActive(child.path));

  const isBusiness = user?.role === USER_ROLES.BUSINESS;
  const navStructure = isBusiness ? businessNavStructure : customerNavItems;

  const renderNavItem = (item, indent = false) => {
    const isActive = isPathActive(item.path);
    return (
      <ListItem key={item.text} disablePadding sx={{ mb: '4px' }}>
        <ListItemButton
          onClick={() => {
            router.push(item.path);
            if (isMobile) setSidebarOpen(false);
          }}
          sx={{
            borderRadius: 3,
            py: '10px',
            px: indent ? 3.5 : 2,
            minHeight: 42,
            mx: 1,
            bgcolor: isActive ? 'rgba(31,107,71,0.08)' : 'transparent',
            color: isActive ? 'primary.main' : 'text.secondary',
            '&:hover': {
              bgcolor: isActive ? 'rgba(31,107,71,0.1)' : 'rgba(0,0,0,0.03)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 36,
              color: isActive ? 'primary.main' : 'inherit',
              '& svg': { fontSize: 20 },
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="body2"
                fontWeight={isActive ? 600 : 500}
                sx={{ color: 'inherit' }}
              >
                {item.text}
              </Typography>
            }
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const renderSection = (section) => {
    const isExpanded = expandedSections[section.text] || isAnyChildActive(section.children);
    return (
      <ListItem key={section.text} disablePadding sx={{ mb: '4px' }}>
        <ListItemButton
          onClick={() => toggleSection(section.text)}
          sx={{
            borderRadius: 3,
            py: '10px',
            px: 2,
            minHeight: 42,
            mx: 1,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.03)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit', '& svg': { fontSize: 20 } }}>
            {section.icon}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" fontWeight={500} sx={{ color: 'inherit' }}>
                {section.text}
              </Typography>
            }
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              color: 'text.disabled',
            }}
          >
            <ExpandMoreIcon sx={{ fontSize: 18 }} />
          </Box>
        </ListItemButton>
      </ListItem>
    );
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 3,
            background: '#1F6B47',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(31,107,71,0.25)',
          }}
        >
          Q
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Quotely
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
            {isBusiness ? 'Business' : 'Customer'}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2.5 }} />

      <List sx={{ flex: 1, px: 1, py: 1.5, overflow: 'auto' }}>
        {navStructure.map((item) => {
          if (item.type === 'section') {
            const isExpanded = expandedSections[item.text] || isAnyChildActive(item.children);
            return (
              <Box key={item.text}>
                {renderSection(item)}
                <Collapse in={isExpanded} timeout={200} easing="cubic-bezier(0.4, 0, 0.2, 1)">
                  <List disablePadding sx={{ mb: '4px' }}>
                    {item.children.map((child) => renderNavItem(child, true))}
                  </List>
                </Collapse>
              </Box>
            );
          }
          return renderNavItem(item);
        })}
      </List>

      <Divider sx={{ mx: 2.5 }} />
      <Box sx={{ p: 1.5 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 3,
              py: '10px',
              px: 2,
              mx: 0.5,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'rgba(229,115,115,0.06)',
                color: 'error.main',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit', '& svg': { fontSize: 20 } }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body2" fontWeight={500}>Log out</Typography>}
            />
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
      <Drawer
        variant="temporary"
        open={isMobile && sidebarOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid #ECECEC',
            bgcolor: '#FBFBFB',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
