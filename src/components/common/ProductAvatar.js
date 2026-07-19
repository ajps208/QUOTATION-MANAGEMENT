'use client';
import { Box, Typography } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const COLORS = [
  '#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316',
];

function getInitials(name) {
  if (!name) return '?';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function getColor(name) {
  if (!name) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function ProductAvatar({ image, name, size = 40, sx = {}, icon: IconComponent }) {
  const Icon = IconComponent || Inventory2OutlinedIcon;

  if (image) {
    return (
      <Box
        component="img"
        src={image}
        alt={name || 'Product'}
        sx={{
          width: size,
          height: size,
          borderRadius: 1.5,
          objectFit: 'cover',
          bgcolor: '#f1f5f9',
          flexShrink: 0,
          ...sx,
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: 1.5,
        bgcolor: `${getColor(name)}14`,
        border: `1px solid ${getColor(name)}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...sx,
      }}
    >
      {size >= 36 ? (
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: size * 0.36,
            color: getColor(name),
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          {getInitials(name)}
        </Typography>
      ) : (
        <Icon sx={{ fontSize: size * 0.55, color: getColor(name) }} />
      )}
    </Box>
  );
}
