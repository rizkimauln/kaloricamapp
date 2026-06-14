import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Image as ImageIcon, RefreshCcw, Camera, Upload } from 'lucide-react';

const ScanPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Camera error:', err);
        setError('Could not access camera. Please ensure you have given camera permissions.');
      }
    };

    initCamera();

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Capture image from video stream
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      
      // Stop the camera stream after capturing
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      
      // Auto analyze
      analyzeImage(imageData);
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;
        setCapturedImage(imageData);
        
        // Stop camera if it's running
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        
        // Auto analyze
        analyzeImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send image to API
  const analyzeImage = async (imageDataParam) => {
    const imageToAnalyze = imageDataParam || capturedImage;
    if (!imageToAnalyze) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Convert data URL to Blob
      const response = await fetch(imageToAnalyze);
      const blob = await response.blob();
      
      // Create FormData
      const formData = new FormData();
      formData.append('file', blob, 'food.jpg');
      
      // Send to API
      const apiResponse = await fetch(`${import.meta.env.VITE_AI_SERVICE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });
      
      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`);
      }
      
      const result = await apiResponse.json();
      console.log('API Result:', result);
      
      // Navigate to results page with data AND the captured image
      navigate('/result', { state: { result, capturedImage: imageToAnalyze } });
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset capture - restart camera
  const resetCapture = async () => {
    setCapturedImage(null);
    
    // Restart camera
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Could not access camera. Please ensure you have given camera permissions.');
    }
  };

  return (
    <div className="page scan-page mobile-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px' }}>
      
      {/* New Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <ArrowLeft size={20} color="#64748b" />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1, paddingLeft: '15px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginTop: '6px' }}></div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>Scan Makanan</h2>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Arahkan kamera ke makanan</p>
          </div>
        </div>

        <button 
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Zap size={20} color="#64748b" />
        </button>
      </header>
      <div className="camera-viewport-container card">
        {error && <div className="error-message">{error}</div>}
        
        {capturedImage ? (
          <div className="captured-image-preview" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <img src={capturedImage} alt="Captured food" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div className="preview-controls" style={{ 
              position: 'absolute', 
              bottom: '20px', 
              left: '0', 
              right: '0', 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '15px',
              padding: '0 20px'
            }}>
              {isLoading ? (
                <div style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: '12px 24px', borderRadius: '17px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  Menganalisis Makanan...
                </div>
              ) : error ? (
                <button className="pill-btn" onClick={resetCapture} style={{ 
                  zIndex: 10,
                  backgroundColor: 'white',
                  border: '1px solid #ddd'
                }}>
                  <RefreshCcw size={18} /> Coba Lagi
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="viewport-overlay">
            <div ></div>
            <div className="frame-corner tl"></div>
            <div className="frame-corner tr"></div>
            <div className="frame-corner bl"></div>
            <div className="frame-corner br"></div>
            
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}
      </div>

      {!capturedImage && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingBottom: '30px', paddingTop: '20px' }}>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '11px', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', cursor: 'pointer' }}>
            <ImageIcon size={16} /> Galeri
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              aria-label="Upload from gallery"
            />
          </label>
          
          <div style={{ background: '#d1fae5', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button 
              onClick={captureImage}
              style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#10b981', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
            >
              <Camera size={26} color="white" />
            </button>
          </div>
          
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '11px', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', cursor: 'pointer' }}>
            <RefreshCcw size={16} /> Flip
          </button>
        </div>
      )}
    </div>
  );
};

export default ScanPage;