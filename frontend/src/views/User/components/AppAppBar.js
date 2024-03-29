import * as React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
 
  NavItem,
 
} from "reactstrap";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Menu } from '@mui/material';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ToggleColorMode from './ToggleColorMode';
import DPrepLogo from './Dpreplogo.png'
import {logout } from "../../../utils/helpers";
import axios from "axios";
import { Link } from 'react-router-dom';
import {getUser} from '../../../utils/helpers.js'
const logoStyle = {
  width: '140px',
  height: 'auto',
  cursor: 'pointer',
};

function AppAppBar({ mode, toggleColorMode,theme }) {
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = () => {
    navigate('/home/toolSelector', { state: { theme: theme } });
    handleClose();
  };
  const handleNavigateDisaster = () => {
    navigate('/home/disaster', { state: { theme: theme } });
  };
  const handleNavigateArea = () => {
    navigate('/home/area', { state: { theme: theme } });
  };
  const handleNavigateTool = () => {
    navigate('/home/tool', { state: { theme: theme } });
  };
  const handleNavigateReport = () => {
    navigate('/home/reports', { state: { theme: theme } });
  };
  const handleNavigateLearning = () => {
    navigate('/home/learning', { state: { theme: theme } });
  };
  const handleNavigateQuiz = () => {
    navigate('/home/quiz', { state: { theme: theme } });
    handleClose();
  };
  const handleNavigatePredictive = () => {
    navigate('/predictive', { state: { theme: theme } });
    handleClose();
  };
  const handleNavigateAdmin = () => {
    navigate('/admin/dashboard', { state: { theme: theme } });
    handleClose();
  };
  React.useEffect(() => {
    const user = getUser();
    setUser(user);

    // Check if the user is admin
    setIsAdmin(user.role === "admin");
  }, []);
  const logoutUser = async () => {
  
    try {
        await axios.get(`http://localhost:4001/api/v1/logout`);

        // Perform any additional cleanup here if needed

        logout(() => {
            navigate("/"); // Redirect to the home page after logout
        });
    } catch (error) {
        console.error("Error logging out:", error);
    }
};
  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderRadius: '999px',
              bgcolor:
                theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(24px)',
              maxHeight: 40,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow:
                theme.palette.mode === 'light'
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                ml: '-18px',
                px: 0,
              }}
            >
               <Link to="/home/user">
      <img
        src={DPrepLogo}
        style={logoStyle}
        alt="logo of sitemark"
      />
    </Link>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
             
                <MenuItem
                   onClick={handleNavigateDisaster}
                   sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Disasters
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={handleNavigateArea}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Areas
                  </Typography>
                </MenuItem>
                <MenuItem
                   onClick={handleNavigateTool}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Disaster Tools
                  </Typography>
                </MenuItem>
                <MenuItem
                   onClick={handleNavigateReport}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Reports
                  </Typography>
                </MenuItem>
                <MenuItem
                   onClick={handleNavigateLearning}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Learning
                  </Typography>
                </MenuItem>
                
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <Button onClick={handleClick}>
        Web Tools
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleNavigateQuiz}>
          <Typography variant="body2" color="text.primary">
            Knowledge Test
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleNavigate}>
          <Typography variant="body2" color="text.primary">
            Emergency Kit Builder
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleNavigatePredictive}>
          <Typography variant="body2" color="text.primary">
            Check Predictions
          </Typography>
        </MenuItem>
        {isAdmin && (
          <MenuItem onClick={handleNavigateAdmin}>
                <Typography variant="body2" color="text.primary">
                Admin Panel
              </Typography>
              </MenuItem>
              )}
      </Menu>
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
             
              <Button
                color="primary"
                variant="contained"
                size="small"
                component="a"
                onClick={logoutUser}
              >
                Logout
              </Button>
            </Box>
            <Box sx={{ display: { sm: '', md: 'none' } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: '30px', p: '4px' }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: '60dvw',
                    p: 2,
                    backgroundColor: 'background.paper',
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'end',
                      flexGrow: 1,
                    }}
                  >
                    <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
                  </Box>
                 
                  <MenuItem onClick={handleNavigateDisaster}>
                    Disasters
                  </MenuItem>
                  <MenuItem onClick={handleNavigateArea}>
                    Areas
                  </MenuItem>
                  <MenuItem onClick={handleNavigateTool}>
                    Disaster Tools
                  </MenuItem>
                  <MenuItem onClick={handleNavigateReport}>
                    Reports
                  </MenuItem>
                  <MenuItem onClick={handleNavigateLearning}>
                    Learning
                  </MenuItem>
                  <MenuItem
  onClick={handleNavigate}
>
                 
                    Emergency Kit Builder
                
                </MenuItem>
                <MenuItem
  onClick={handleNavigateQuiz}
>
                 
                    Knowledge Test
                
                </MenuItem>
                <MenuItem
  onClick={handleNavigatePredictive}
>
                 
                   Check Predictions
                
                </MenuItem>
                {isAdmin && (
          <MenuItem onClick={handleNavigateAdmin}>
               
                Admin Panel
             
              </MenuItem>
              )}
                  <Divider />
               
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default AppAppBar;