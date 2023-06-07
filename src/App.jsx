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

	console.log(imgRef.current.src)

	function getCroppedImg() {
		const ctx = canvasRef.current.getContext("2d");
		ctx.putImageData(imgRef.current.data, crop.x, crop.y);

		// ctx.clearRect(0, 0, canvas.width, canvas.height);
		// const imageWidthRatio = image.naturalWidth / image.width;
		// const imageHeightRatio = image.naturalHeight / image.height;

		// ctx.drawImage(
		// 	image,
		// 	crop.x * imageWidthRatio,
		// 	crop.y * imageHeightRatio,
		// 	crop.width * imageWidthRatio,
		// 	crop.height * imageHeightRatio,
		// 	0,
		// 	0,
		// 	crop.width,
		// 	crop.height
		// );

		// const context = this.refs.canvasRef.getContext('2d');
		// context.putImageData(this.state.image, 0, 0);

		// var target = new Image();
		// target.src = canvas.toDataURL();

		// setImage(ctx);
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
	const [image, setImage] = useState();
	const modalRef = useRef();

	const onClick = async () => {
		// const { value: file } = await Swal.fire({
		// 	title: 'Выберите файл',
		// 	input: 'file',
		// 	inputAttributes: {
		// 		accept: '.jpg, .png, .JPEG',
		// 	}
		// });

		// if (file) {
		// 	const reader = new FileReader();
		// 	reader.onload = (e) => {
		// 		setImage(e.target.result);
		// 		modalRef.current.classList.add('active');
		// 	};
		// 	reader.readAsDataURL(file);
		// }

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

	return (
		<div style={{ display: 'block' }}>
			<button onClick={onClick}>Click</button>
			<button onClick={() => Swal.fire({
				imageUrl: image
			})}>Show image</button>
			<div id="openModal" ref={modalRef} className="modal">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h3 className="modal-title">Название</h3>
							<button className="close" onClick={() => modalRef.current.classList.remove('active')}>×</button>
						</div>
						<div className="modal-body">
							<CropDemo src={image} modal={modalRef} />
						</div>
					</div>
				</div>
			</div>

		</div>
	)
}

export default App
