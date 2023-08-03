"use client";
import React, {useState} from "react";
import {FileUpload} from "primereact/fileupload";
import {InputText} from "primereact/inputtext";
import axiosInstance from "@/app/utilities/axiosInterceptors";
import {Editor} from "primereact/editor";
function CreateFile() {
	const [desc, setDesc] = useState("");
	const [htmlContent, setHtmlContent] = useState("");
	const handleUpload = async event => {
		console.log(event);
		console.log(htmlContent);
		// let request = new FormData();
		// request.append("description", desc);
		// event.files.forEach(file => {
		// 	request.append("files", file);
		// });

		// console.log(request);

		// axiosInstance.post("FileUploads", request).then(response => {
		// 	console.log(response);
		// });
	};

	return (
		<div className="grid">
			<div className="col-12">
				<div className="card">
					<h5>Yeni Dosya Yükle</h5>
					<div className="p-fluid formgrid grid">
						<div className="field col-12 md:col-12">
							<label htmlFor="firstname">Dosyalar</label>
							<FileUpload
								className="w-100"
								name="demo[]"
								customUpload
								uploadHandler={event => handleUpload(event)}
								multiple
								maxFileSize={1000000}
								emptyTemplate={
									<p className="m-0">
										Dosyalarınızı sürükleyip bu alana bırakabilirsiniz.
									</p>
								}
							/>
						</div>
						<div className="field col-12 md:col-12">
							<label>Açıklama</label>
							<InputText
								value={desc}
								onChange={e => setDesc(e.target.value)}
								className="p-inputtext p-component"
								type="text"
							/>
						</div>
						<div className="field col-12 md:col-12">
							<label>HTML İçerik</label>
							<Editor
								value={htmlContent}
								onTextChange={e => setHtmlContent(e.htmlValue)}
								style={{height: "300px"}}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="col-12"></div>
		</div>
	);
}

export default CreateFile;
