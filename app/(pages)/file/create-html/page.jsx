"use client";
import React, {useState} from "react";
import {FileUpload} from "primereact/fileupload";
import {InputText} from "primereact/inputtext";
import axiosInstance from "@/app/utilities/axiosInterceptors";
import {Editor} from "primereact/editor";
import {Button} from "primereact/button";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";
function CreateFile() {
	const [desc, setDesc] = useState("");
	const [htmlContent, setHtmlContent] = useState("");
	const submit = async event => {
		console.log(htmlContent);
		axiosInstance
			.post("FileTemplates", {content: htmlContent, userId: 0})
			.then(response => {
				console.log(response);
			});
	};

	const exportToWord = () => {
		debugger;
		var header =
			"<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";

		var footer = "</body></html>";

		var html = header + htmlContent + footer;

		var blob = new Blob(["\ufeff", html], {
			type: "application/msword",
		});
		// Specify link url
		var url =
			"data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(html);

		// Specify file name
		let filename = "document.docx";

		// Create download link element
		var downloadLink = document.createElement("a");

		document.body.appendChild(downloadLink);

		if (navigator.msSaveOrOpenBlob) {
			navigator.msSaveOrOpenBlob(blob, filename);
		} else {
			downloadLink.href = url;

			downloadLink.download = filename;

			downloadLink.click();
		}

		document.body.removeChild(downloadLink);

		const formData = new FormData();
		formData.append("description", "Oluşturulmuş WORD");
		formData.append("files", blob);
		formData.append("extension", ".docx");

		axiosInstance.post("FileUploads", formData).then(response => {
			console.log(response);
		});
	};

	const exportToPDF = async () => {
		let doc = new jsPDF();
		doc.html(htmlContent).save("html.pdf");

		let tempElement = document.createElement("div");
		tempElement.innerHTML = htmlContent;
		tempElement.id = "tempCanvas";
		tempElement.style.zIndex = "-1";
		document.body.appendChild(tempElement);
		html2canvas(tempElement).then(canvas => {
			let imgBase64 = canvas.toDataURL();
			doc.addImage(imgBase64, "JPEG", 0, 0);
			doc.save("e.pdf");
			document.body.removeChild(tempElement);
		});
	};

	return (
		<div className="grid">
			<div className="col-12">
				<div className="card">
					<h5>Yeni Dosya Oluştur</h5>
					<div className="p-fluid formgrid grid">
						<div className="field col-12 md:col-12">
							<label>HTML İçerik</label>
							<Editor
								value={htmlContent}
								onTextChange={e => setHtmlContent(e.htmlValue)}
								style={{height: "300px"}}
							/>
						</div>
					</div>
					<div className="p-fluid formgrid grid">
						<div className="field col-4 md:col-4">
							<Button onClick={submit} label="Oluştur" severity="info"></Button>
						</div>
						<div className="field col-4 md:col-4">
							<Button
								onClick={exportToWord}
								label="Word'e Çevir"
								severity="info"
							></Button>
						</div>
						<div className="field col-4 md:col-4">
							<Button
								onClick={exportToPDF}
								label="PDF'e Çevir"
								severity="info"
							></Button>
						</div>
					</div>
				</div>
			</div>
			<div className="col-12"></div>
		</div>
	);
}

export default CreateFile;
