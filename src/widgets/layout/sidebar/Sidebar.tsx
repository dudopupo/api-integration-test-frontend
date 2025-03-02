import { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Divider,
  useMediaQuery,
  AppBar,
  Box,
  CssBaseline
} from '@mui/material';
import {
  Menu,
  ChevronLeft,
  Dashboard,
  ExitToApp // Добавляем новую иконку
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAuthStore } from '@/features/auth/store';
import Link from 'next/link';

const drawerWidth = 240;
const collapsedWidth = 72;

export const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const { logout } = useAuthStore();
  
  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
      setCollapsed(false);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const drawerContent = (
    <>
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        minHeight: { xs: '48px !important', md: '64px !important' } 
      }}>
        {!isMobile && !collapsed && <div>Logo</div>}
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeft />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      
      <List sx={{ flexGrow: 1 }}>
        {[
          { text: 'Dashboard', icon: <Dashboard />, path: '/main' },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
          <Link 
            href={item.path} 
            passHref 
            style={{ 
              textDecoration: 'none', 
              color: 'inherit',
              width: '100%',
            }}
            >
            <ListItemButton 
              sx={{
                minHeight: 48,
                width: '100%',
                justifyContent: 'flex-start',
                px: 2.5,
              }}
            >
              <ListItemIcon sx={{
                minWidth: 0,
                mr: 3,
                justifyContent: 'center'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </Link>
        </ListItem>
        ))}
      </List>

      <Box sx={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0,
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <ListItemButton 
          onClick={logout}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: collapsed && !isMobile ? 0 : 3 }}>
            <ExitToApp />
          </ListItemIcon>
          {(!collapsed || isMobile) && (
            <ListItemText primary="Выход" />
          )}
        </ListItemButton>
      </Box>
    </>
  );

  return (
    <>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          display: { xs: 'flex', md: 'none' },
          left: 'auto',
          right: 0,
          width: '100%',
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Box>Mobile Header</Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          zIndex: theme.zIndex.drawer + 2,
          width: '100%',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '100%',
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Десктопная версия */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: collapsed ? collapsedWidth : drawerWidth,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};