import React from 'react';
import NavbarHeader from './NavbarHeader';

const Header = ({ onOpenAuth, onGoToFeed }) => {
  return <NavbarHeader onOpenAuth={onOpenAuth} />;
};

export default Header;
