import { useState, useEffect } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

export const UploadPic = ({category, url, setUrl}) => {
	const [progress, setProgress] = useState(0);
	const [file, setFile] = useState(null);
	const [error, setError] = useState(null)

	const uploadFiles = (file) => {
		if (!file) return;
		const sotrageRef = ref(storage, `${category}/${file.name}`);
		const uploadTask = uploadBytesResumable(sotrageRef, file);

		uploadTask.on("state_changed", (snapshot) => {
			const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
			setProgress(prog);
		},
			(error) => {
				setFile(null);
				setError(error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setUrl(downloadURL));
				setProgress(0);
			}
		);
	};

	useEffect(() => {
		if (file) {
			setError(null);
			setUrl(null);
			uploadFiles(file);
			setFile(null);
		}
	}, [file]);

	return (
		<div className="UploadPic">
			<input
				type="file" accept="image/png, image/jpeg"
				style={{ color: 'rgba(0,0,0,0)' }}
				onChange={e => setFile(e.target.files[0])} />
			{!!progress && <p>Subiendo imagen... {progress}%</p>}
			{error ? <>{error}</> : ''}
			
			{url && <img src={url} alt="perfil de usuario" style={{ width: '10%' }} />}
		</div>
	)
}