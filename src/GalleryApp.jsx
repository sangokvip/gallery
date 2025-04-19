import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Container, Typography, Paper, Box, TextField, Button, AppBar, Toolbar, 
  IconButton, Snackbar, ThemeProvider, createTheme, Dialog, DialogTitle, 
  DialogContent, DialogActions, Divider, CircularProgress, Grid, Card, 
  CardContent, CardMedia, CardActions, Modal, FormControl, InputLabel, 
  MenuItem, Select, LinearProgress, Checkbox, Alert, CssBaseline,
  useMediaQuery
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import InfoIcon from '@mui/icons-material/Info';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ErrorIcon from '@mui/icons-material/Error';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import Masonry from '@mui/lab/Masonry';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import './styles/pixel-theme.css';
import { v4 as uuidv4 } from 'uuid';
import { galleryApi } from './utils/supabase';

// 创建白色像素风格主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#5c6bc0', // 柔和的靛蓝色
      light: '#8e99f3',
      dark: '#26418f',
    },
    secondary: {
      main: '#26a69a', // 清新的青绿色
      light: '#64d8cb',
      dark: '#00766c',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50', // 深青灰色
      secondary: '#546e7a',
    },
    accent: {
      pink: '#ff80ab', // 柔和的粉色
      purple: '#b388ff', // 淡紫色
      green: '#69f0ae', // 薄荷绿
      yellow: '#ffd54f', // 温暖的黄色
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      color: '#5c6bc0',
      textAlign: 'center',
      marginBottom: '2rem',
      fontSize: '1.5rem',
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
    },
    button: {
      fontFamily: 'inherit',
      textTransform: 'none',
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '0.9rem',
      '@media (min-width:600px)': {
        fontSize: '1rem',
      },
    },
    body2: {
      fontSize: '0.8rem',
      '@media (min-width:600px)': {
        fontSize: '0.875rem',
      },
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          border: '3px solid #5c6bc0',
          boxShadow: '4px 4px 0 rgba(92, 107, 192, 0.2)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            boxShadow: '6px 6px 0 rgba(92, 107, 192, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
          border: '2px solid #5c6bc0',
          boxShadow: '3px 3px 0 rgba(92, 107, 192, 0.2)',
          padding: '8px 16px',
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            boxShadow: '5px 5px 0 rgba(92, 107, 192, 0.3)',
          },
          '&:active': {
            transform: 'translate(2px, 2px)',
            boxShadow: '1px 1px 0 rgba(92, 107, 192, 0.2)',
          },
        },
        contained: {
          backgroundColor: '#5c6bc0',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#8e99f3',
          },
        },
        outlined: {
          backgroundColor: 'transparent',
          borderColor: '#5c6bc0',
          color: '#5c6bc0',
          '&:hover': {
            backgroundColor: 'rgba(92, 107, 192, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '3px solid #5c6bc0',
          boxShadow: '4px 4px 0 rgba(92, 107, 192, 0.2)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            boxShadow: '6px 6px 0 rgba(92, 107, 192, 0.3)',
          },
          backgroundColor: '#ffffff',
          '& .MuiTypography-root': {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          border: '2px solid #5c6bc0',
          borderRadius: '4px',
          padding: '8px',
          color: '#5c6bc0',
          '&:hover': {
            backgroundColor: 'rgba(92, 107, 192, 0.05)',
            color: '#8e99f3',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          border: '3px solid #5c6bc0',
          boxShadow: '6px 6px 0 rgba(92, 107, 192, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#5c6bc0',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: '#8e99f3',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5c6bc0',
            },
          },
        },
      },
    },
  },
});

// 添加自定义样式到主题
const styles = `
  @keyframes highlightBorder {
    0% { border-color: rgba(255, 64, 129, 0.4); }
    50% { border-color: rgba(255, 64, 129, 0.8); }
    100% { border-color: rgba(255, 64, 129, 0.4); }
  }

  .gradient-border-image-highlight::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(255, 64, 129, 0.6);
    animation: highlightBorder 2s infinite;
    pointer-events: none;
    z-index: 1;
  }
`;

// 将样式添加到文档头部
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// 图片卡片组件
const ImageCard = ({ image, onView, onDelete, onEdit, isAdmin, isSelected, isSelectionMode, onSelect, userId }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [imageError, setImageError] = useState(false);
  const [isLongImage, setIsLongImage] = useState(false);
  const [likes, setLikes] = useState(image.likes_count || 0);
  const [dislikes, setDislikes] = useState(image.dislikes_count || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingVotes, setIsEditingVotes] = useState(false);
  const [editLikes, setEditLikes] = useState(likes);
  const [editDislikes, setEditDislikes] = useState(dislikes);
  
  // 判断是否是当前用户上传的图片
  const isCurrentUserImage = image.user_id === userId;

  // 获取初始投票状态
  useEffect(() => {
    const fetchVoteStatus = async () => {
      try {
        const voteStatus = await galleryApi.getImageVoteStatus(image.id, userId);
        if (voteStatus !== null) {
          setHasLiked(voteStatus);
          setHasDisliked(!voteStatus);
        }
      } catch (error) {
        console.error('获取投票状态失败:', error);
      }
    };

    if (userId) {
      fetchVoteStatus();
    }
  }, [image.id, userId]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      const result = await galleryApi.updateImageLikes(image.id, userId, true);
      
      if (result.action === 'added') {
        setLikes(prev => prev + 1);
        setHasLiked(true);
      } else if (result.action === 'removed') {
        setLikes(prev => prev - 1);
        setHasLiked(false);
      } else if (result.action === 'changed') {
        setLikes(prev => prev + 1);
        setDislikes(prev => prev - 1);
        setHasLiked(true);
        setHasDisliked(false);
      }
    } catch (error) {
      console.error('点赞失败:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDislike = async (e) => {
    e.stopPropagation();
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      const result = await galleryApi.updateImageLikes(image.id, userId, false);
      
      if (result.action === 'added') {
        setDislikes(prev => prev + 1);
        setHasDisliked(true);
      } else if (result.action === 'removed') {
        setDislikes(prev => prev - 1);
        setHasDisliked(false);
      } else if (result.action === 'changed') {
        setDislikes(prev => prev + 1);
        setLikes(prev => prev - 1);
        setHasDisliked(true);
        setHasLiked(false);
      }
    } catch (error) {
      console.error('点踩失败:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // 管理员更新点赞数量
  const handleAdminUpdateVotes = async () => {
    try {
      setIsUpdating(true);
      await galleryApi.adminUpdateVotes(image.id, editLikes, editDislikes);
      setLikes(editLikes);
      setDislikes(editDislikes);
      setIsEditingVotes(false);
      setSnackbarMessage('点赞数量已更新');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('更新点赞数量失败:', error);
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsUpdating(false);
    }
  };

  // 判断当前用户是否有编辑权限
  const hasEditPermission = isAdmin || image.user_id === image.current_user_id;

  const handleImageLoad = (e) => {
    setImageLoaded(true);
    const width = e.target.naturalWidth;
    const height = e.target.naturalHeight;
    setImageDimensions({
      width,
      height
    });
    setIsLongImage(height / width > 2);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        marginTop: '1rem', // 为标签预留空间
        '& .MuiTypography-root': {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        // 当前用户上传的图片特殊样式
        ...(image.user_id === userId && {
          border: '3px solid #ff80ab',
          backgroundColor: 'rgba(255, 128, 171, 0.05)',
          '&::before': {
            content: '"我的上传"',
            position: 'absolute',
            top: '-24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#ff80ab',
            color: '#ffffff',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            zIndex: 100,
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
            boxShadow: '2px 2px 0 rgba(255, 128, 171, 0.3)',
          },
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            boxShadow: '6px 6px 0 rgba(255, 128, 171, 0.3)',
          },
        }),
      }}
    >
      <Box
        className={isCurrentUserImage ? "gradient-border-image-highlight" : "gradient-border-image"}
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: isLongImage ? '150%' : `${(imageDimensions.height / imageDimensions.width * 100) || 75}%`,
          backgroundColor: 'background.default',
          overflow: 'hidden',
          cursor: isEditingVotes ? 'default' : 'pointer'
        }}
        onClick={() => !isEditingVotes && onView(image)}
      >
        {!imageLoaded && !imageError && (
          <CircularProgress 
            size={30} 
            sx={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-15px',
              marginLeft: '-15px'
            }} 
          />
        )}
        
        <Box
          sx={{
            position: 'absolute',
            top: '3px',
            left: '3px',
            right: '3px',
            bottom: '3px',
            pointerEvents: isEditingVotes ? 'none' : 'auto'
          }}
        >
          <img 
            src={image.image_url} 
            alt={image.title || '图片'} 
            onLoad={handleImageLoad}
            onError={() => setImageError(true)}
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: isLongImage ? 'cover' : 'cover',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }} 
          />
        </Box>

        {/* 交互图标栏 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '3px',
            right: '3px',
            padding: '8px',
            background: 'linear-gradient(135deg, transparent, rgba(0,0,0,0.7))',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            opacity: 1,
            transition: 'opacity 0.3s ease',
            borderRadius: '2px',
            zIndex: 2,
            maxWidth: 'fit-content',
            pointerEvents: 'auto'  // 确保按钮区域始终可以点击
          }}
        >
          {isAdmin && isEditingVotes ? (
            <>
              <TextField
                size="small"
                type="number"
                value={editLikes}
                onChange={(e) => setEditLikes(Math.max(0, parseInt(e.target.value) || 0))}
                sx={{
                  width: '70px',
                  '& .MuiInputBase-input': {
                    color: 'white',
                    padding: '4px 8px',
                    fontSize: '0.875rem',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                  },
                }}
              />
              <TextField
                size="small"
                type="number"
                value={editDislikes}
                onChange={(e) => setEditDislikes(Math.max(0, parseInt(e.target.value) || 0))}
                sx={{
                  width: '70px',
                  '& .MuiInputBase-input': {
                    color: 'white',
                    padding: '4px 8px',
                    fontSize: '0.875rem',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                  },
                }}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdminUpdateVotes();
                }}
                disabled={isUpdating}
                sx={{
                  color: 'primary.main',
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.5)' }
                }}
              >
                <CheckCircleIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingVotes(false);
                  setEditLikes(likes);
                  setEditDislikes(dislikes);
                }}
                sx={{
                  color: 'error.main',
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.5)' }
                }}
              >
                <CancelIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={handleLike}
                  disabled={isUpdating}
                  sx={{
                    color: hasLiked ? 'primary.main' : 'white',
                    padding: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      color: 'primary.light',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }}
                >
                  <ThumbUpIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'white',
                    minWidth: 20,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {likes}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={handleDislike}
                  disabled={isUpdating}
                  sx={{
                    color: hasDisliked ? 'error.main' : 'white',
                    padding: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      color: 'error.light',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }}
                >
                  <ThumbDownIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'white',
                    minWidth: 20,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {dislikes}
                </Typography>
              </Box>

              {isAdmin && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingVotes(true);
                  }}
                  sx={{
                    color: 'white',
                    padding: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      color: 'primary.light',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }}
                >
                  <EditIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              )}
            </>
          )}
        </Box>

        {isAdmin && !image.is_approved && (
          <Box
            sx={{
              position: 'absolute',
              top: '11px',
              right: '11px',
              backgroundColor: 'error.main',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 1,
              fontSize: '0.75rem',
              zIndex: 1
            }}
          >
            待审核
          </Box>
        )}

        {isSelectionMode && (
          <Checkbox
            checked={isSelected}
            sx={{
              position: 'absolute',
              top: '11px',
              left: '11px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
              zIndex: 1
            }}
          />
        )}

        <Box
          sx={{
            position: 'absolute',
            top: '11px',
            right: '11px',
            display: 'flex',
            gap: 1,
            opacity: 0,
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 1
            },
            zIndex: 1
          }}
        >
          {hasEditPermission && (
            <>
          <IconButton 
            size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(image);
                }}
                sx={{ 
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
                }}
              >
                <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(image.id);
                }}
                sx={{ 
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
                }}
              >
                <DeleteIcon fontSize="small" />
          </IconButton>
            </>
        )}
        </Box>
      </Box>
    </Card>
  );
};

// 图片详情模态框
const ImageDetailModal = ({ open, image, onClose }) => {
  const [scale, setScale] = useState(1);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [initialScaleSet, setInitialScaleSet] = useState(false);

  useEffect(() => {
    if (image) {
      setIsLoading(true);
      setInitialScaleSet(false);
    }
  }, [image]);

  const handleImageLoad = (e) => {
    setIsLoading(false);
    const width = e.target.naturalWidth;
    const height = e.target.naturalHeight;
    setOriginalDimensions({
      width,
      height
    });

    if (!initialScaleSet) {
      if (height > 7000) {
        setScale(5);
      } else {
        setScale(1);
      }
      setInitialScaleSet(true);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 8));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.1));
  };

  const handleResetZoom = () => {
    if (originalDimensions.height > 7000) {
      setScale(5);
    } else {
      setScale(1);
    }
  };

  if (!image) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="image-detail-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        height: '90vh',
        bgcolor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
      }}>
        {/* 顶部工具栏 */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 2,
          display: 'flex',
          gap: 1,
          p: 1,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
          width: '100%',
          justifyContent: 'flex-end',
          opacity: 0.8,
          transition: 'opacity 0.3s',
          '&:hover': {
            opacity: 1
          }
        }}>
          <IconButton
            onClick={handleZoomOut}
            disabled={scale <= 0.1}
            title="缩小"
            sx={{ color: 'white' }}
          >
            <RemoveIcon />
          </IconButton>
          <Typography sx={{
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            px: 1,
            fontSize: '0.875rem',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          }}>
            {Math.round(scale * 100)}%
          </Typography>
          <IconButton
            onClick={handleZoomIn}
            disabled={scale >= 8}
            title="放大"
            sx={{ color: 'white' }}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            onClick={handleResetZoom}
            title="重置缩放"
            sx={{ color: 'white' }}
          >
            <RestartAltIcon />
          </IconButton>
          <IconButton
            onClick={onClose}
            title="关闭"
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 图片容器 */}
        <Box sx={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
            },
          },
        }}>
          {isLoading && (
            <CircularProgress
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-20px',
                marginLeft: '-20px',
                color: 'white'
              }}
            />
          )}
          <img
            src={image.image_url}
            alt={image.description || ''}
            onLoad={handleImageLoad}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-out',
              visibility: isLoading ? 'hidden' : 'visible',
              imageRendering: 'pixelated'
            }}
          />
        </Box>

        {/* 底部描述（如果有） */}
        {image.description && (
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
            p: 2,
            opacity: 0.8,
            transition: 'opacity 0.3s',
            '&:hover': {
              opacity: 1
            }
          }}>
            <Typography sx={{
              color: 'white',
              fontSize: '0.875rem',
              textAlign: 'center',
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            }}>
              {image.description}
            </Typography>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

// 编辑图片信息对话框
const EditImageDialog = ({ open, image, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (image) {
      setTitle(image.title || '');
      setDescription(image.description || '');
    }
  }, [image]);

  const handleSave = () => {
    onSave({
      id: image?.id,
      title,
      description
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>编辑图片信息</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="标题"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          label="描述"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          取消
        </Button>
        <Button onClick={handleSave} color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 上传图片对话框
const UploadDialog = ({ open, onClose, onUpload, isAdmin }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [completedUploads, setCompletedUploads] = useState(0);
  const fileInputRef = useRef(null);

  const resetState = () => {
    setFiles([]);
    setUploadProgress({});
    setUploading(false);
    setCompletedUploads(0);
  };

  const handleClose = () => {
    if (!uploading) {
      resetState();
      onClose();
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => ({
      file,
      id: uuidv4(),
      title: file.name,
      description: '',
      preview: null
    }));

    // 为每个文件创建预览
    newFiles.forEach(fileObj => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, preview: reader.result } : f
        ));
      };
      reader.readAsDataURL(fileObj.file);
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
          });
        };

  const handleTitleChange = (fileId, newTitle) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, title: newTitle } : f
    ));
  };

  const handleDescriptionChange = (fileId, newDescription) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, description: newDescription } : f
    ));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setCompletedUploads(0);
    const totalFiles = files.length;

    try {
      if (isAdmin && files.length > 1) {
        // 管理员批量上传
        const fileArray = files.map(f => f.file);
        const metadataArray = files.map(f => ({
          title: f.title,
          description: f.description
        }));

        const results = await onUpload(fileArray, metadataArray, (progress, index) => {
          if (index !== undefined) {
            // 更新单个文件的进度
            const fileId = files[index].id;
            setUploadProgress(prev => ({
              ...prev,
              [fileId]: { status: 'uploading', progress }
            }));
            
            // 如果这个文件完成了，更新完成数量
            if (progress === 100) {
              setCompletedUploads(prev => prev + 1);
            }
          }
        });

        // 处理上传结果
        results.forEach((result, index) => {
          const fileId = files[index].id;
          if (result.success) {
            setUploadProgress(prev => ({
              ...prev,
              [fileId]: { status: 'success', progress: 100 }
            }));
          } else {
            setUploadProgress(prev => ({
              ...prev,
              [fileId]: { status: 'error', error: result.error }
            }));
          }
        });

        // 如果所有文件都上传成功，延迟1秒后关闭对话框
        const successCount = results.filter(r => r.success).length;
        if (successCount === files.length) {
          setTimeout(() => {
            handleClose();
          }, 1000);
        }
      } else {
        // 单文件上传
        for (const fileObj of files) {
          try {
            setUploadProgress(prev => ({
              ...prev,
              [fileObj.id]: { status: 'uploading', progress: 0 }
            }));

            await onUpload(fileObj.file, {
              title: fileObj.title,
              description: fileObj.description
            }, (progress) => {
              setUploadProgress(prev => ({
                ...prev,
                [fileObj.id]: { status: 'uploading', progress }
              }));
            });

            setUploadProgress(prev => ({
              ...prev,
              [fileObj.id]: { status: 'success', progress: 100 }
            }));
            setCompletedUploads(prev => prev + 1);
            
            // 单文件上传成功后，延迟1秒关闭对话框
            setTimeout(() => {
              handleClose();
            }, 1000);
          } catch (error) {
            console.error('上传失败:', error);
            setUploadProgress(prev => ({
              ...prev,
              [fileObj.id]: { status: 'error', error: error.message }
            }));
          }
        }
      }
    } catch (error) {
      console.error('批量上传失败:', error);
      files.forEach(file => {
        setUploadProgress(prev => ({
          ...prev,
          [file.id]: { status: 'error', error: error.message }
        }));
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth={isAdmin ? "md" : "sm"}
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          border: '4px solid #2196f3',
          boxShadow: '8px 8px 0 rgba(33, 150, 243, 0.3)',
          borderRadius: 0,
        }
      }}
    >
      <DialogTitle sx={{ 
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: '1rem',
        color: '#2196f3',
      }}>
        {isAdmin ? "批量上传测评报告图片" : "上传测评报告图片"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, mt: 1 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<AddPhotoAlternateIcon className="pixel-icon" />}
            disabled={uploading}
            fullWidth
            className="pixel-button"
          >
            {isAdmin ? "选择多张图片" : "选择图片"}
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              multiple={isAdmin}
              onChange={handleFileChange}
              disabled={uploading}
            />
          </Button>
        </Box>
        
        {files.length > 0 && (
            <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: isAdmin ? 'repeat(auto-fill, minmax(200px, 1fr))' : '1fr',
            gap: 2,
            mb: 2 
          }}>
            {files.map((fileObj) => (
              <Paper
                key={fileObj.id}
                sx={{
                  p: 2,
                  position: 'relative',
                  bgcolor: 'background.paper',
                  backgroundImage: 'none',
                  border: '2px solid #2196f3',
                  borderRadius: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#64b5f6',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                {fileObj.preview && (
              <Box sx={{
                width: '100%',
                    height: 150,
                mb: 1,
                    position: 'relative',
                    borderRadius: 1,
                    overflow: 'hidden'
              }}>
                <img 
                      src={fileObj.preview}
                  alt="Preview" 
                  style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    {uploadProgress[fileObj.id] && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {uploadProgress[fileObj.id].status === 'uploading' && (
                          <CircularProgress
                            variant="determinate"
                            value={uploadProgress[fileObj.id].progress}
                            size={40}
                          />
                        )}
                        {uploadProgress[fileObj.id].status === 'success' && (
                          <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                        )}
                        {uploadProgress[fileObj.id].status === 'error' && (
                          <ErrorIcon color="error" sx={{ fontSize: 40 }} />
                        )}
              </Box>
                    )}
          </Box>
        )}
        <TextField
                  size="small"
          label="标题"
                  value={fileObj.title}
                  onChange={(e) => handleTitleChange(fileObj.id, e.target.value)}
          fullWidth
                  sx={{ 
                    mb: 1,
                    '& .MuiInputLabel-root': {
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: '0.7rem',
                    },
                    '& .MuiInputBase-input': {
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: '0.8rem',
                    }
                  }}
                  disabled={uploading || uploadProgress[fileObj.id]?.status === 'success'}
                />
        <TextField
                  size="small"
          label="描述"
                  value={fileObj.description}
                  onChange={(e) => handleDescriptionChange(fileObj.id, e.target.value)}
          fullWidth
                  multiline
                  rows={2}
                  sx={{ 
                    '& .MuiInputLabel-root': {
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: '0.7rem',
                    },
                    '& .MuiInputBase-input': {
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: '0.8rem',
                    }
                  }}
                  disabled={uploading || uploadProgress[fileObj.id]?.status === 'success'}
                />
                {!uploading && uploadProgress[fileObj.id]?.status !== 'success' && (
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(fileObj.id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.7)',
                        animation: 'pixelHover 0.5s infinite',
                      }
                    }}
                  >
                    <CloseIcon sx={{ fontSize: '1rem', color: 'white' }} className="pixel-icon" />
                  </IconButton>
                )}
              </Paper>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleClose} 
          disabled={uploading}
          className="pixel-button"
        >
          取消
        </Button>
        <Button 
          onClick={handleUpload} 
          disabled={files.length === 0 || uploading || files.every(file => uploadProgress[file.id]?.status === 'success')}
          variant="contained"
          startIcon={uploading ? <CircularProgress size={20} /> : <FileUploadIcon className="pixel-icon" />}
          className="pixel-button"
        >
          {uploading ? `上传中 (${completedUploads}/${files.length})` : '上传'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('GalleryApp错误:', error);
    console.error('错误详情:', errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#1a1a1a',
            padding: 3,
            color: '#fff'
          }}
        >
          <Typography variant="h6" sx={{ color: '#ff69b4', marginBottom: 2 }}>
            页面加载出错了
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2, maxWidth: 600, textAlign: 'center' }}>
            错误信息: {this.state.error?.message || '未知错误'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{
              backgroundColor: '#ff69b4',
              '&:hover': {
                backgroundColor: '#ff8dc3',
              },
            }}
          >
            刷新页面
          </Button>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <Box sx={{ mt: 4, maxWidth: '100%', overflow: 'auto' }}>
              <pre style={{ color: '#ff69b4' }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

// 主页面组件
function GalleryApp() {
  const [images, setImages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [imageDetailOpen, setImageDetailOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // 创建一个观察器引用
  const observer = useRef();
  // 创建一个最后一个元素的引用
  const lastImageElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  // 使用ref存储最新的fetchImages函数
  const fetchImagesRef = useRef(null);

  // 添加响应式列数控制
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));

  // 根据屏幕尺寸确定列数
  const getColumnCount = () => {
    if (isXs) return 1;
    if (isSm) return 2;
    if (isMd) return 3;
    if (isLg) return 4;
    return 5; // xl
  };

  // 获取图片列表
  const fetchImages = useCallback(async (isLoadingMore = false) => {
    if (!userId) {
      console.log('等待用户ID初始化...');
      return;
    }
    
    if (!isLoadingMore) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const offset = page * limit;
      console.log('开始获取图片列表:', { page, limit, offset, filter, userId });
      const { data, count, hasMore: moreAvailable } = await galleryApi.getImages(limit, offset);
      
      if (!data) {
        console.log('没有获取到图片数据');
        if (!isLoadingMore) {
          setImages([]);
          setTotalCount(0);
        }
        setHasMore(false);
        return;
      }
      
      console.log('获取到原始图片数据:', { count, dataLength: data?.length });
      
      // 根据筛选条件过滤图片
      let filteredData = data || [];
      if (filter === 'approved') {
        filteredData = filteredData.filter(img => img.is_approved);
      } else if (filter === 'pending') {
        filteredData = filteredData.filter(img => !img.is_approved);
      }
      
      // 为每个图片添加当前用户ID
      filteredData = filteredData.map(img => ({
        ...img,
        current_user_id: userId
      }));
      
      // 对图片进行排序，将当前用户上传的图片排在前面
      filteredData.sort((a, b) => {
        // 首先按照是否是当前用户的图片排序
        if (a.user_id === userId && b.user_id !== userId) return -1;
        if (a.user_id !== userId && b.user_id === userId) return 1;
        
        // 其次按照创建时间降序排序（新的在前）
        return new Date(b.created_at) - new Date(a.created_at);
      });

      console.log('过滤并排序后的图片数据:', { 
        filteredCount: filteredData.length, 
        filter,
        firstImage: filteredData[0] 
      });
      
      setImages(prev => isLoadingMore ? [...prev, ...filteredData] : filteredData);
      setTotalCount(count);
      setHasMore(moreAvailable);
    } catch (error) {
      console.error('获取图片失败:', error);
      setSnackbarMessage(`获取图片失败: ${error.message || '未知错误'}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      if (!isLoadingMore) {
        setImages([]);
        setTotalCount(0);
      }
    } finally {
      if (!isLoadingMore) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [userId, page, limit, filter]);

  // 更新ref
  useEffect(() => {
    fetchImagesRef.current = fetchImages;
  }, [fetchImages]);

  // 监听依赖变化重新获取图片
  useEffect(() => {
    if (userId) {
      setPage(0); // 重置页码
      setHasMore(true); // 重置hasMore
      fetchImages(false);
    }
  }, [userId, filter]);

  // 监听页码变化加载更多图片
  useEffect(() => {
    if (page > 0) {
      fetchImages(true);
    }
  }, [page]);

  // 处理双击标题进入管理员模式
  const handleTitleDoubleClick = () => {
    const password = prompt('请输入管理员密码：');
    if (password === 'Sangok#3') {
      setIsAdmin(true);
      setSnackbarMessage('管理员登录成功！');
      setSnackbarOpen(true);
    } else if (password !== null) {
      setSnackbarMessage('密码错误！');
      setSnackbarOpen(true);
    }
  };

  // 退出管理员模式
  const handleLogout = () => {
    setIsAdmin(false);
    setSnackbarMessage('已退出管理员模式！');
    setSnackbarOpen(true);
  };

  // 初始化用户ID
  useEffect(() => {
    try {
      console.log('开始初始化用户ID...');
      let idFromCookie = document.cookie.match(/userId=([^;]+)/)?.[1];
      let finalUserId;
      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

      if (idFromCookie) {
        let potentialUserId = idFromCookie;
        if (potentialUserId.startsWith('user_')) {
          console.log("移除 'user_' 前缀:", potentialUserId);
          potentialUserId = potentialUserId.substring(5);
        }

        if (uuidRegex.test(potentialUserId)) {
          finalUserId = potentialUserId;
          console.log("使用cookie中的有效UUID:", finalUserId);
        } else {
          console.log('Cookie中的UUID格式无效，生成新的UUID');
          finalUserId = uuidv4();
        }
      } else {
        console.log('Cookie中未找到UUID，生成新的UUID');
        finalUserId = uuidv4();
      }

      // 保存到cookie，使用更长的过期时间
      document.cookie = `userId=${finalUserId};path=/;max-age=31536000;SameSite=Lax`;
      console.log("设置用户ID:", finalUserId);
      setUserId(finalUserId);
    } catch (error) {
      console.error('初始化用户ID失败:', error);
      setSnackbarMessage('初始化用户ID失败，请刷新页面重试');
      setSnackbarOpen(true);
    }
  }, []);

  // 处理图片审核
  const handleApproveImage = useCallback(async (imageId, isApproved) => {
    try {
      await galleryApi.approveImage(imageId, isApproved);
      setSnackbarMessage(`图片已${isApproved ? '通过审核' : '取消审核'}`);
      setSnackbarOpen(true);
      // 使用ref中的最新fetchImages函数
      if (fetchImagesRef.current) {
        fetchImagesRef.current();
      }
    } catch (error) {
      console.error('审核图片失败:', error);
      setSnackbarMessage(`审核失败: ${error.message}`);
      setSnackbarOpen(true);
    }
  }, []);

  // 修改上传处理函数
  const handleUpload = useCallback(async (file, metadata, onProgress) => {
    try {
      if (isAdmin && Array.isArray(file)) {
        // 管理员批量上传
        console.log('开始批量上传:', { fileCount: file.length, metadata });
        const results = await galleryApi.uploadImages(file, userId, metadata, onProgress);
        console.log('批量上传结果:', results);
        
        const successCount = results.filter(r => r.success).length;
        const failCount = results.length - successCount;
        
        let message;
        if (failCount > 0) {
          message = `上传完成：${successCount}张成功，${failCount}张失败`;
          console.error('部分图片上传失败:', results.filter(r => !r.success));
        } else {
          message = '所有图片上传成功！';
        }
        setSnackbarMessage(message);
        setSnackbarOpen(true);
        // 使用ref中的最新fetchImages函数
        if (fetchImagesRef.current) {
          fetchImagesRef.current();
        }
        return results;
      } else {
        // 单张图片上传
        const result = await galleryApi.uploadImage(file, userId, metadata, onProgress);
      setSnackbarMessage('图片上传成功！');
      setSnackbarOpen(true);
        // 使用ref中的最新fetchImages函数
        if (fetchImagesRef.current) {
          fetchImagesRef.current();
        }
        return result;
      }
    } catch (error) {
      console.error('上传图片失败:', error);
      setSnackbarMessage(`上传失败: ${error.message}`);
      setSnackbarOpen(true);
      throw error;
    }
  }, [isAdmin, userId]);

  // 处理图片删除
  const handleDeleteImage = useCallback(async (imageId) => {
    if (window.confirm('确定要删除这张图片吗？此操作无法撤销。')) {
      try {
        await galleryApi.deleteImage(imageId, userId, isAdmin);
        setSnackbarMessage('图片已删除');
        setSnackbarOpen(true);
        // 强制刷新页面
        window.location.reload();
      } catch (error) {
        console.error('删除图片失败:', error);
        setSnackbarMessage(`删除失败: ${error.message}`);
        setSnackbarOpen(true);
      }
    }
  }, [userId, isAdmin]);

  // 查看图片详情
  const handleViewImage = (image) => {
    setSelectedImage(image);
    setImageDetailOpen(true);
  };

  // 编辑图片信息
  const handleEditImage = (image) => {
    setEditImage(image);
    setEditDialogOpen(true);
  };

  // 保存图片信息
  const handleSaveImageInfo = useCallback(async (imageData) => {
    try {
      const { id, title, description } = imageData;
      await galleryApi.updateImageInfo(id, userId, { title, description }, isAdmin);
      setSnackbarMessage('图片信息已更新');
      setSnackbarOpen(true);
      setEditDialogOpen(false);
      // 使用ref中的最新fetchImages函数
      if (fetchImagesRef.current) {
        fetchImagesRef.current();
      }
    } catch (error) {
      console.error('更新图片信息失败:', error);
      setSnackbarMessage(`更新失败: ${error.message}`);
      setSnackbarOpen(true);
    }
  }, [userId, isAdmin]);

  // 处理图片选择
  const handleImageSelect = useCallback((imageId) => {
    setSelectedImages(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(imageId)) {
        newSelection.delete(imageId);
      } else {
        newSelection.add(imageId);
      }
      return newSelection;
    });
  }, []);

  // 处理全选/取消全选
  const handleSelectAll = useCallback(() => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map(img => img.id)));
    }
  }, [images, selectedImages.size]);

  // 处理批量删除
  const handleBatchDelete = async () => {
    const selectedImageIds = Array.from(selectedImages);
    if (selectedImageIds.length === 0) {
      setSnackbarMessage('请先选择要删除的图片');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const { successful, failed } = await galleryApi.deleteImages(selectedImageIds, userId);
      
      let message = '';
      if (successful > 0 && failed === 0) {
        message = `成功删除 ${successful} 张图片`;
        setSnackbarSeverity('success');
      } else if (successful > 0 && failed > 0) {
        message = `${successful} 张图片删除成功，${failed} 张删除失败`;
        setSnackbarSeverity('warning');
      } else {
        message = '删除失败';
        setSnackbarSeverity('error');
      }
      
      setSnackbarMessage(message);
      setSnackbarOpen(true);
      setSelectedImages(new Set());
      // 强制刷新页面
      window.location.reload();
    } catch (error) {
      console.error('批量删除失败:', error);
      setSnackbarMessage('批量删除失败: ' + (error.message || '未知错误'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // 处理清空所有图片
  const handleClearAll = useCallback(async () => {
    if (window.confirm('确定要清空所有图片吗？此操作无法撤销。')) {
      try {
        setLoading(true);
        const results = await Promise.allSettled(
          images.map(image =>
            galleryApi.deleteImage(image.id, userId, isAdmin)
          )
        );

        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failCount = results.filter(r => r.status === 'rejected').length;

        setSnackbarMessage(`清空完成：${successCount}张成功，${failCount}张失败`);
        setSnackbarOpen(true);

        // 强制刷新页面
        window.location.reload();
      } catch (error) {
        console.error('清空图片失败:', error);
        setSnackbarMessage(`清空图片失败: ${error.message}`);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }
  }, [images, userId, isAdmin]);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <AppBar
            position="sticky"
            sx={{
              backgroundColor: '#ffffff',
              borderBottom: '3px solid #5c6bc0',
              boxShadow: '0 4px 0 rgba(92, 107, 192, 0.2)',
              marginBottom: '2rem',
              '& .MuiTypography-root': {
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              },
              '& .app-title': {
                fontFamily: '"Press Start 2P", cursive',
              },
            }}
          >
            <Container maxWidth="lg">
              <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" className="app-title" sx={{ color: '#5c6bc0' }}>
                  Report Gallery
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {isAdmin && (
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={handleLogout}
                      size="small"
                    >
                      退出管理
                    </Button>
                  )}
                  <Button
                    color="primary"
                    variant="outlined"
                    startIcon={<HomeIcon />}
                    href="/index.html"
                    size="small"
                  >
                    返回首页
                  </Button>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>

          <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 }, pt: 4 }}>
            <Typography 
              variant="h3" 
              component="h1"
              sx={{ 
                mb: 6,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                fontFamily: '"Press Start 2P", cursive',
                color: '#5c6bc0',
                textAlign: 'center',
              }}
              onDoubleClick={handleTitleDoubleClick}
            >
              Report Gallery
            </Typography>

            <Box sx={{ 
              mb: 4, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                variant="contained"
                startIcon={<AddPhotoAlternateIcon />}
                onClick={() => setUploadDialogOpen(true)}
                sx={{
                    backgroundColor: 'primary.main',
                  '&:hover': {
                      backgroundColor: 'primary.dark',
                  },
                }}
              >
                上传图片
              </Button>

              {isAdmin && (
                  <>
                    <Button
                      variant="outlined"
                      color={isSelectionMode ? "secondary" : "primary"}
                      startIcon={isSelectionMode ? <CloseIcon /> : <CheckBoxOutlineBlankIcon />}
                      onClick={() => {
                        setIsSelectionMode(!isSelectionMode);
                        setSelectedImages(new Set());
                      }}
                    >
                      {isSelectionMode ? '退出选择' : '选择图片'}
                    </Button>
                    {isSelectionMode && (
                      <>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleSelectAll}
                        >
                          {selectedImages.size === images.length ? '取消全选' : '全选'}
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={handleBatchDelete}
                          disabled={selectedImages.size === 0}
                        >
                          删除选中 ({selectedImages.size})
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteSweepIcon />}
                      onClick={handleClearAll}
                    >
                      清空图片
                    </Button>
                  </>
                )}
              </Box>

              {isAdmin && (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>筛选</InputLabel>
                  <Select
                    value={filter}
                    label="筛选"
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <MenuItem value="all">全部图片</MenuItem>
                    <MenuItem value="approved">已审核</MenuItem>
                    <MenuItem value="pending">待审核</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : images && images.length > 0 ? (
              <Box sx={{ width: '100%', minHeight: 400 }}>
                <Masonry
                  columns={getColumnCount()}
                  spacing={3}
                  sx={{ width: 'auto' }}
                >
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      ref={index === images.length - 1 ? lastImageElementRef : null}
                    >
                    <ImageCard 
                      image={image}
                      onView={handleViewImage}
                      onDelete={handleDeleteImage}
                      onEdit={handleEditImage}
                      isAdmin={isAdmin}
                      isSelected={selectedImages.has(image.id)}
                      isSelectionMode={isSelectionMode}
                      onSelect={() => handleImageSelect(image.id)}
                      userId={userId}
                    />
                    </div>
                  ))}
                </Masonry>
              </Box>
            ) : (
              <Paper 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                }}
              >
                <InfoIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>暂无图片</Typography>
                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                  {filter !== 'all' 
                    ? '当前筛选条件下没有找到图片'
                    : '目前还没有上传的测评报告图片，快来分享你的测评结果吧！'
                  }
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddPhotoAlternateIcon />}
                  onClick={() => setUploadDialogOpen(true)}
                  color="primary"
                >
                  上传图片
                </Button>
              </Paper>
            )}

            {loadingMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            )}

            <UploadDialog 
              open={uploadDialogOpen}
              onClose={() => setUploadDialogOpen(false)}
              onUpload={handleUpload}
              isAdmin={isAdmin}
            />

            <ImageDetailModal
              open={imageDetailOpen}
              image={selectedImage}
              onClose={() => setImageDetailOpen(false)}
            />

            <EditImageDialog
              open={editDialogOpen}
              image={editImage}
              onClose={() => setEditDialogOpen(false)}
              onSave={handleSaveImageInfo}
            />

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={5000}
              onClose={() => setSnackbarOpen(false)}
            >
              <Alert 
                onClose={() => setSnackbarOpen(false)} 
                severity={snackbarSeverity}
                variant="filled"
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Container>
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// 辅助函数：判断是否有编辑权限
const hasEditPermission = (image) => {
  return image.isAdmin || image.user_id === image.current_user_id;
};

export default GalleryApp; 