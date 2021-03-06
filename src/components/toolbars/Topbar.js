import React, { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton, Divider } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import { UrlContext } from '../../App';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    backgroundColor: '#ffffff',
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1),
    color: 'rgb(7, 68, 129)'
  },
  divider: {
    backgroundColor: 'rgb(190, 208, 225)'
  }
}));

const Topbar = props => {
  const { className, onSidebarOpen, ...rest } = props;

  const classes = useStyles();

  const [notifications] = useState([]);
  const urlContextValue = useContext(UrlContext);
  const dhis2Link = urlContextValue.dhis2Url;

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <RouterLink to="/">
          <img
            alt="Logo"
            src="static/images/logos/meval_logo.png"
          />
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          <IconButton className={classes.signOutButton}>
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            className={classes.signOutButton}
          >
            <InputIcon />
          </IconButton>
          <IconButton
            className={classes.signOutButton}
          >
            <a href={`${dhis2Link}`}>
             <span className={classes.signOutButton}> DHIS2</span>
            </a>
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
      <Divider className={classes.divider}/>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
