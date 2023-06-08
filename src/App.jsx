import React, { useRef, useState } from 'react'
import './App.css'
import Swal from 'sweetalert2'
import { ReactCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'

function CropDemo({ src, modal, setImage = (f) => f }) {
  const canvasRef = useRef();
  const imgRef = useRef();
  const [crop, setCrop] = useState({
    unit: 'px',
    width: 300,
    height: 300,
  });

  // console.log(imgRef.current.src)

  function getCroppedImg() {
    const cropImageNow = () => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');

      const pixelRatio = window.devicePixelRatio;
      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      );

      // Converting to base64
      const base64Image = canvas.toDataURL('image/jpeg');
      setOutput(base64Image);
    };
  }


  return (
    <div className='crop-modal'>
      <ReactCrop crop={crop} locked={true} circularCrop={true} onChange={c => setCrop(c)}>
        <img ref={imgRef} id="result" src={src} className='image' />
      </ReactCrop>
      <canvas id="canvas"
        ref={canvasRef}
        width={crop.width}
        height={crop.height}
        style={{
          border: "1px solid black",
          objectFit: "contain"
        }}></canvas>
      <button onClick={() => {
        getCroppedImg(); modal.current.classList.remove('active');
      }}>ok</button>
    </div >
  );
}

function App() {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    unit: 'px',
    width: 300,
    height: 300,
  });
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);
  const modalRef = useRef();
  const imageRef = useRef();
  const inputRef = useRef();

  const selectImage = (file) => {
    setSrc(URL.createObjectURL(file));
  };

  const onClick = async () => {
    const { value: file } = await Swal.fire({
      title: 'Select image',
      input: 'file',
      inputAttributes: {
        'accept': 'image/*',
        'aria-label': 'Upload your profile picture'
      }
    })

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target.result);
        modalRef.current.classList.add('active');
      }
      reader.readAsDataURL(file)
    }
  }

  const cropImageNow = () => {
    const canvas = document.createElement('canvas');
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    // Converting to base64
    const base64Image = canvas.toDataURL('image/jpeg');
    setOutput(base64Image);
  };

  const showModal = () => {
    setImage(null);
    setOutput(null);
    setSrc(null);
    inputRef.current.value = null;
    modalRef.current.classList.add('active');
  }

  return (
    <div style={{ display: 'block' }}>
      <button onClick={showModal}>Click</button>
      <button onClick={() => Swal.fire({
        imageUrl: output
      })}>Show image</button>
      <div id="openModal" ref={modalRef} className="modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <input ref={inputRef} type='file' accept='image/*' onChange={(e) => {
                selectImage(e.target.files[0]);
              }} />
              <button className="close" onClick={() => modalRef.current.classList.remove('active')}>×</button>
            </div>
            <div className="modal-body">
              {
                src && <div>
                  <ReactCrop src={src}
                    crop={crop} onChange={setCrop} circularCrop={true} locked={true}>
                    <img ref={imageRef} src={src} onLoad={setImage} />
                  </ReactCrop>
                  <button onClick={cropImageNow}>Crop</button>
                </div>
              }
              <div>{output && <img src={output} />}</div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}


export default App;

