// pages/index.js - Final Version with Improved Resize
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { 
  AppShell, 
  Navbar, 
  Header, 
  Footer, 
  Text, 
  MediaQuery, 
  Burger, 
  Box, 
  useMantineTheme,
  Group,
  Button,
  ActionIcon,
  Tabs,
  Stack,
  Divider,
  NumberInput,
  Progress
} from '@mantine/core';

// Simple DIY Dropzone component
const DIYDropzone = ({ onDrop, children, style }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files);
    }
  };
  
  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.multiple = false;
    input.onchange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        onDrop(e.target.files);
      }
    };
    input.click();
  };
  
  return (
    <Box
      sx={{
        border: `2px dashed ${isDragging ? '#228be6' : '#5c5f66'}`,
        backgroundColor: isDragging ? 'rgba(34, 139, 230, 0.1)' : 'transparent',
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'all 0.2s',
        ...style
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {children}
    </Box>
  );
};

// Enhanced DIY Resizable component with multiple resize handles
const DIYResizable = ({ children, position, size, onResizeStop, style }) => {
  const [dimensions, setDimensions] = useState(size);
  const [resizing, setResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    setDimensions(size);
  }, [size]);
  
  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    setResizing(true);
    setResizeDirection(direction);
    setStartPos({
      x: e.clientX,
      y: e.clientY
    });
    setStartSize({
      width: dimensions.width,
      height: dimensions.height
    });
  };
  
  const handleResizeMove = (e) => {
    if (!resizing) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    let newWidth = startSize.width;
    let newHeight = startSize.height;
    let newX = position.x;
    let newY = position.y;
    
    // Apply changes based on resize direction
    switch (resizeDirection) {
      case 'e': // East (right)
        newWidth = Math.max(50, startSize.width + deltaX);
        break;
      case 's': // South (bottom)
        newHeight = Math.max(50, startSize.height + deltaY);
        break;
      case 'se': // Southeast (bottom-right)
        newWidth = Math.max(50, startSize.width + deltaX);
        newHeight = Math.max(50, startSize.height + deltaY);
        break;
      case 'sw': // Southwest (bottom-left)
        newWidth = Math.max(50, startSize.width - deltaX);
        newX = position.x + (startSize.width - newWidth);
        newHeight = Math.max(50, startSize.height + deltaY);
        break;
      case 'nw': // Northwest (top-left)
        newWidth = Math.max(50, startSize.width - deltaX);
        newX = position.x + (startSize.width - newWidth);
        newHeight = Math.max(50, startSize.height - deltaY);
        newY = position.y + (startSize.height - newHeight);
        break;
      case 'ne': // Northeast (top-right)
        newWidth = Math.max(50, startSize.width + deltaX);
        newHeight = Math.max(50, startSize.height - deltaY);
        newY = position.y + (startSize.height - newHeight);
        break;
      case 'n': // North (top)
        newHeight = Math.max(50, startSize.height - deltaY);
        newY = position.y + (startSize.height - newHeight);
        break;
      case 'w': // West (left)
        newWidth = Math.max(50, startSize.width - deltaX);
        newX = position.x + (startSize.width - newWidth);
        break;
      default:
        break;
    }
    
    setDimensions({
      width: newWidth,
      height: newHeight
    });
    
    // If we're changing position (for n, ne, w, nw, sw)
    if (newX !== position.x || newY !== position.y) {
      onResizeStop({
        width: newWidth - size.width,
        height: newHeight - size.height,
        x: newX - position.x,
        y: newY - position.y
      });
    }
  };
  
  const handleResizeEnd = () => {
    if (resizing) {
      onResizeStop({
        width: dimensions.width - size.width,
        height: dimensions.height - size.height
      });
    }
    setResizing(false);
    setResizeDirection(null);
  };
  
  useEffect(() => {
    if (resizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [resizing, resizeDirection, startPos, startSize]);
  
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: dimensions.width,
        height: dimensions.height,
        cursor: resizing ? 'grabbing' : 'grab',
        ...style
      }}
    >
      {children}
      
      {/* Resize handles */}
      <div
        className="resize-handle resize-handle-e"
        style={{
          position: 'absolute',
          right: -5,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 10,
          height: 10,
          background: '#2196f3',
          borderRadius: '50%',
          cursor: 'e-resize',
          zIndex: 10
        }}
        onMouseDown={(e) => handleResizeStart(e, 'e')}
      />
      <div
        className="resize-handle resize-handle-s"
        style={{
          position: 'absolute',
          bottom: -5,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 10,
          height: 10,
          background: '#2196f3',
          borderRadius: '50%',
          cursor: 's-resize',
          zIndex: 10
        }}
        onMouseDown={(e) => handleResizeStart(e, 's')}
      />
      <div
        className="resize-handle resize-handle-se"
        style={{
          position: 'absolute',
          right: -5,
          bottom: -5,
          width: 10,
          height: 10,
          background: '#2196f3',
          borderRadius: '50%',
          cursor: 'se-resize',
          zIndex: 10
        }}
        onMouseDown={(e) => handleResizeStart(e, 'se')}
      />
      <div
        className="resize-handle resize-handle-sw"
        style={{
          position: 'absolute',
          left: -5,
          bottom: -5,
          width: 10,
          height: 10,
          background: '#2196f3',
          borderRadius: '50%',
          cursor: 'sw-resize',
          zIndex: 10
        }}
        onMouseDown={(e) => handleResizeStart(e, 'sw')}
      />
      <div
        className="resize-handle resize-handle-nw"
        style={{
          position: 'absolute',
          left: -5,
          top: -5,
          width: 10,
          height: 10,
          background: '#2196f3',
          borderRadius: '50%',
          cursor: 'nw-resize',
          zIndex: 10
        }}
        onMouseDown={(e) => handleResizeStart(e, 'nw')}
      />
      <div
        className="resize-handle resize-handle-ne"
        style={{
          position: 'absolute',
          right: -5,
          top: -5,
          width: 10,
          height: 10,
          background: '#2196f3',
          borderRadius: '50%',
          cursor: 'ne-resize',
          zIndex: 10
        }}
        onMouseDown={(e) => handleResizeStart(e, 'ne')}
      />
      <div
        className="resize-handle resize-handle-n"
        style={{
          position: 'absolute',
          top: -5,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 10,
          height: 10,
          background: '#2196f3',
          borderRadius: '50%',
          cursor: 'n-resize',
          zIndex: 10
        }}
        onMouseDown={(e) => handleResizeStart(e, 'n')}
      />
      <div
        className="resize-handle resize-handle-w"
        style={{
          position: 'absolute',
          left: -5,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 10,
          height: 10,
          background: '#2196f3',
          borderRadius: '50%',
          cursor: 'w-resize',
          zIndex: 10
        }}
        onMouseDown={(e) => handleResizeStart(e, 'w')}
      />
    </div>
  );
};

export default function Home() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [position, setPosition] = useState({ x: 200, y: 150 });
  const [dimensions, setDimensions] = useState({ width: 500, height: 300 });
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mediaVisible, setMediaVisible] = useState(true);
  
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  
  // Handle file drop or selection
  const handleDrop = (files) => {
    const file = files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaFile(url);
      setMediaType(file.type.startsWith('image/') ? 'image' : 'video');
      setMediaVisible(true);
    }
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (!mediaFile) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    
    let newX = e.clientX - dragStart.x;
    let newY = e.clientY - dragStart.y;
    
    // Keep within canvas bounds
    newX = Math.max(0, Math.min(newX, canvasRect.width - dimensions.width));
    newY = Math.max(0, Math.min(newY, canvasRect.height - dimensions.height));
    
    setPosition({ x: newX, y: newY });
  };

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle dimension change from inputs
  const handleDimensionChange = (dimension, value) => {
    setDimensions({
      ...dimensions,
      [dimension]: value
    });
  };

  // Handle resize finish
  const handleResizeStop = (delta) => {
    const newDimensions = {
      width: dimensions.width + (delta.width || 0),
      height: dimensions.height + (delta.height || 0)
    };
    
    setDimensions(newDimensions);
    
    // If position change is included (for resizing from other corners/sides)
    if (delta.x !== undefined && delta.y !== undefined) {
      setPosition({
        x: position.x + delta.x,
        y: position.y + delta.y
      });
    }
  };

  // Handle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      clearInterval(timerRef.current);
      if (videoRef.current && mediaType === 'video') {
        videoRef.current.pause();
      }
    } else {
      setCurrentTime(startTime);
      
      // If it's a video, seek to the start time and play
      if (videoRef.current && mediaType === 'video') {
        // Only set currentTime if the video is loaded
        if (videoRef.current.readyState >= 2) {
          videoRef.current.currentTime = startTime;
          videoRef.current.play().catch(err => console.error("Video play error:", err));
        } else {
          // If not loaded, set up an event listener to play when it's ready
          videoRef.current.oncanplay = () => {
            videoRef.current.currentTime = startTime;
            videoRef.current.play().catch(err => console.error("Video play error:", err));
          };
        }
      }
      
      timerRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 0.1;
          if (newTime > endTime) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            if (videoRef.current && mediaType === 'video') {
              videoRef.current.pause();
            }
            return startTime;
          }
          return newTime;
        });
      }, 100);
    }
    setIsPlaying(!isPlaying);
  };

  // Update media visibility based on current time
  useEffect(() => {
    const isVisible = currentTime >= startTime && currentTime <= endTime;
    setMediaVisible(isVisible);
    
    // Control video playback based on visibility
    if (videoRef.current && mediaType === 'video') {
      if (isVisible && isPlaying) {
        videoRef.current.play().catch(err => console.error("Video play error:", err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentTime, startTime, endTime, isPlaying, mediaType]);

  // Clean up timer and media resources on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Revoke object URL to avoid memory leaks
      if (mediaFile) {
        URL.revokeObjectURL(mediaFile);
      }
    };
  }, [mediaFile]);
  
  return (
    <>
      <Head>
        <title>Video Editor</title>
        <meta name="description" content="A browser-based video editor" />
      </Head>
      
      <AppShell
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={
          <Navbar p="md" width={{ base: 300 }} height="100vh">
            <Navbar.Section grow>
              <Tabs defaultValue="edit" style={{ height: '100%' }}>
                <Tabs.List>
                  <Tabs.Tab value="edit">⚙️ Edit</Tabs.Tab>
                  <Tabs.Tab value="crop">✂️ Crop</Tabs.Tab>
                  <Tabs.Tab value="elements">➕ Elements</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="edit" pt="xs">
                  <Stack spacing="md">
                    <Box>
                      <Text weight={500} size="sm" mb={5}>Dimensions</Text>
                      <Group grow>
                        <NumberInput
                          label="Width"
                          value={dimensions.width}
                          onChange={(val) => handleDimensionChange('width', val)}
                          min={50}
                          max={1920}
                          step={10}
                        />
                        <NumberInput
                          label="Height"
                          value={dimensions.height}
                          onChange={(val) => handleDimensionChange('height', val)}
                          min={50}
                          max={1080}
                          step={10}
                        />
                      </Group>
                    </Box>

                    <Divider />

                    <Box>
                      <Text weight={500} size="sm" mb={5}>Timing</Text>
                      <Group grow>
                        <NumberInput
                          label="Start Time (s)"
                          value={startTime}
                          onChange={setStartTime}
                          min={0}
                          max={endTime}
                          step={0.1}
                          precision={1}
                        />
                        <NumberInput
                          label="End Time (s)"
                          value={endTime}
                          onChange={setEndTime}
                          min={startTime}
                          step={0.1}
                          precision={1}
                        />
                      </Group>
                    </Box>

                    <Divider />

                    <Box>
                      <Text weight={500} size="sm" mb={5}>Media Controls</Text>
                      <Group position="center">
                        <Button
                          onClick={togglePlay}
                          disabled={!mediaFile}
                        >
                          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                        </Button>
                        <Button
                          color="red"
                          onClick={() => setMediaFile(null)}
                          disabled={!mediaFile}
                        >
                          🗑️ Remove
                        </Button>
                      </Group>
                    </Box>
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="crop" pt="xs">
                  <Text>Crop tools would go here</Text>
                </Tabs.Panel>

                <Tabs.Panel value="elements" pt="xs">
                  <Text>Elements would go here</Text>
                </Tabs.Panel>
              </Tabs>
            </Navbar.Section>

            <Navbar.Section>
              <Button fullWidth color="blue" style={{ marginTop: 20 }}>
                Export
              </Button>
            </Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={60} p="md">
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Text size="xl" weight={700}>Video Editor</Text>
                <Group>
                  <Button variant="outline">
                    💾 Save
                  </Button>
                  <Button>
                    ⬇️ Export
                  </Button>
                </Group>
              </div>
            </div>
          </Header>
        }
        footer={
          <Footer height={60} p="md">
            <Group position="apart" style={{ height: '100%' }}>
              <Group>
                <Text size="sm">Current Time: {currentTime.toFixed(1)}s</Text>
                <Progress
                  value={((currentTime - startTime) / (endTime - startTime)) * 100}
                  style={{ width: 200 }}
                  disabled={!isPlaying}
                />
              </Group>
              <Group>
                <ActionIcon variant="subtle" onClick={togglePlay} disabled={!mediaFile}>
                  {isPlaying ? '⏸️' : '▶️'}
                </ActionIcon>
                <ActionIcon variant="subtle">
                  🔊
                </ActionIcon>
              </Group>
            </Group>
          </Footer>
        }
        styles={(theme) => ({
          main: {
            backgroundColor: theme.colors.dark[8],
            padding: 0,
          },
        })}
      >
        <div
          style={{
            width: '100%',
            height: 'calc(100vh - 120px)',
            backgroundColor: '#15181c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {!mediaFile ? (
            <DIYDropzone
              onDrop={handleDrop}
              style={{
                width: '80%',
                height: '80%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Group position="center" spacing="xl" style={{ pointerEvents: 'none', padding: 20 }}>
                <div>
                  <span style={{ fontSize: '50px' }}>🖼️</span>
                </div>

                <div>
                  <Text size="xl">
                    Drag images or videos here or click to select
                  </Text>
                  <Text size="sm" color="dimmed" mt={7}>
                    Drop files to add them to the canvas
                  </Text>
                </div>
              </Group>
            </DIYDropzone>
          ) : (
            mediaVisible && (
              <DIYResizable
                position={position}
                size={dimensions}
                onResizeStop={handleResizeStop}
              >
                {mediaType === 'image' ? (
                  <img
                    src={mediaFile}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                    draggable={false}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={mediaFile}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                    controls={false}
                    autoPlay={false}
                    loop={false}
                    muted
                    draggable={false}
                    onTimeUpdate={(e) => {
                      // Pause video if it goes beyond the end time
                      if (e.target.currentTime > endTime) {
                        e.target.pause();
                      }
                    }}
                    onCanPlay={() => {
                      if (isPlaying) {
                        videoRef.current.play().catch(err => console.error("Video play error:", err));
                      }
                    }}
                  />
                )}
              </DIYResizable>
            )
          )}
        </div>
      </AppShell>
    </>
  );
}