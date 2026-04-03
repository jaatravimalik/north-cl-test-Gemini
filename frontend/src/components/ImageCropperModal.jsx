import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

export default function ImageCropperModal({ imageSrc, onCropComplete, onCancel, title = "Crop Image", aspect = 1 }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      onCropComplete(croppedBlob);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div className="card fade-in" style={modalContentStyle}>
        <div className="card-body">
          <h3 className="mb-3">{title}</h3>
          
          <div style={cropperContainerStyle}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropCompleteHandler}
              onZoomChange={setZoom}
              style={{
                containerStyle: { background: 'black' },
                mediaStyle: { objectFit: 'contain' }
              }}
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-semibold mb-1">Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="w-full"
              style={{ width: '100%' }}
            />
          </div>

          <div className="flex justify-between mt-4">
            <button className="btn btn-secondary" onClick={onCancel} disabled={isProcessing}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Save & Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '16px'
};

const modalContentStyle = {
  width: '100%',
  maxWidth: '500px',
  background: 'white',
  overflow: 'hidden'
};

const cropperContainerStyle = {
  position: 'relative',
  height: '300px',
  width: '100%',
  background: '#333',
  overflow: 'hidden',
  borderRadius: '8px'
};
