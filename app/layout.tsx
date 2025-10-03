'use client';

import React from 'react';
import Link from 'next/link';
import './globals.css'; // Import global styles if needed
import {
  AppBar,
  Box,
  Container,
  createTheme,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import { ThemeProvider as BaseThemeProvider } from 'next-themes';
import { Menu } from '@mui/icons-material';

interface MenuOptions {
  text: string;
  link: string;
  icon?: React.ReactNode;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const menuOptions: MenuOptions[] = [
    { text: 'Races', link: '/races' },
    { text: 'Classes', link: '/classes' },
    { text: 'Spells', link: '/spells' },
    { text: 'Monsters', link: '/monsters' },
    { text: 'Items', link: '/items' },
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Typography variant="h6" sx={{ m: 2 }}>
        D&D Content
      </Typography>
      <Divider />
      <List>
        {menuOptions.map((option, index) => (
          <Link href={option.link}>
            <ListItem key={option.text} disablePadding>
              <ListItemButton>
                {option.icon && <ListItemIcon>{option.icon}</ListItemIcon>}
                <ListItemText primary={option.text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <html className="dark">
      <body>
        <BaseThemeProvider defaultTheme="dark" attribute="class">
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <main>
              <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
              </Drawer>
              <AppBar>
                <Toolbar className="flex justify-between">
                  <Typography variant="h6" color="inherit" component="div">
                    <Link href="https://mysfitdev.github.io">
                      mysfitdev.github.io
                    </Link>
                  </Typography>
                  <IconButton
                    onClick={toggleDrawer(true)}
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                  >
                    <Menu />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <div className="mt-16">
                <Container className="p-8" maxWidth={false}>
                  {children}
                </Container>
              </div>
            </main>
          </ThemeProvider>
        </BaseThemeProvider>
      </body>
    </html>
  );
}
