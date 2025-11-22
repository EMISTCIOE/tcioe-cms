// ==============================|| LOGO - TCIOE ||============================== //

const Logo = () => {
  // Use the logo from public folder - using .jpg extension
  const logoPath = '/logo_dark.png';

  return <img src={logoPath} alt="Thapathali Campus Logo" width="50" height="50" style={{ objectFit: 'contain' }} />;
};

export default Logo;
