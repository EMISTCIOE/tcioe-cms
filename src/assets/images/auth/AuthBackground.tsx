// material-ui
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';

// ==============================|| AUTH BACKGROUND ||============================== //

export default function AuthBackground() {
  const theme = useTheme();

  // Generate random position avoiding center login area
  const generateRandomPosition = () => {
    let top, left;
    do {
      top = Math.random() * 100; // 0% to 100%
      left = Math.random() * 100; // 0% to 100%

      // Avoid center area where login form is (roughly 30-70% both directions)
    } while (top > 25 && top < 75 && left > 25 && left < 75);

    return { top: `${top}%`, left: `${left}%` };
  };

  // Generate random logo properties - will be different on each refresh
  const generateRandomLogo = () => {
    const position = generateRandomPosition();
    return {
      ...position,
      size: Math.random() * 70 + 40, // Random size between 40px and 110px
      rotation: Math.random() * 360, // Random rotation 0° to 360°
      opacity: Math.random() * 0.4 + 0.2, // Random opacity 0.2 to 0.6
      blur: Math.random() * 2 + 0.2 // Random blur 0.2px to 2.2px
    };
  };

  // Generate 20 random logos on each render (changes on refresh)
  const randomLogos = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => ({
        id: index,
        ...generateRandomLogo()
      })),
    []
  );

  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: -1,
        top: 0,
        left: 0,
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, rgba(18, 18, 18, 0.88) 0%, rgba(33, 33, 33, 0.85) 100%)`
            : `linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(248, 250, 252, 0.85) 100%)`,
        overflow: 'hidden',
        '& > *': {
          pointerEvents: 'none'
        }
      }}
    >
      {/* Dynamically generated random logos */}
      {randomLogos.map((logo) => (
        <Box
          key={logo.id}
          sx={{
            position: 'absolute',
            top: logo.top,
            left: logo.left,
            width: `${logo.size}px`,
            height: `${logo.size}px`,
            backgroundImage: 'url(/logo_dark.jpg)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: logo.opacity,
            filter: `blur(${logo.blur}px)`,
            transform: `rotate(${logo.rotation}deg)`,
            zIndex: -1,
            transition: 'all 0.3s ease-in-out'
          }}
        />
      ))}
    </Box>
  );
}
