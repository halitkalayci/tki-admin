"use client";
import {CDN_BASE_URL} from "@/app/environment";
import axiosInstance from "@/app/utilities/axiosInterceptors";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import React, {useEffect, useState} from "react";
import Iframe from "react-iframe";
import {Dialog} from "primereact/dialog";
function FileList() {
	const [data, setData] = useState([]);
	const [showIFrame, setShowIFrame] = useState(false);
	const [iframeLink, setIframeLink] = useState("");
	useEffect(() => {
		fetchFiles();
	}, []);

	const fetchFiles = () => {
		axiosInstance.get("FileUploads?PageIndex=0&PageSize=50").then(response => {
			setData(response.data.items);
		});
	};

	const downloadBtnTemplate = event => {
		return (
			<>
				<Button
					severity="info"
					label="Download"
					onClick={e => download(event)}
				></Button>
				<Button
					severity="warning"
					label="Open IFrame"
					onClick={e => openIFrame(event)}
				></Button>
			</>
		);
	};

	const openIFrame = event => {
		setIframeLink(CDN_BASE_URL + event.destination);
		setShowIFrame(true);
	};
	const download = event => {
		console.log();

		let element = document.createElement("a");
		element.href = CDN_BASE_URL + event.destination;
		element.target = "_empty";
		element.download = event.description;
		document.body.appendChild(element);
		element.click();
	};

	return (
		<>
			{showIFrame && (
				<Dialog onHide={() => setShowIFrame(false)} visible={true}>
					<Iframe
						url={iframeLink}
						width="1000px"
						height="1000px"
						id=""
						className=""
						display="block"
						position="relative"
					/>
				</Dialog>
			)}
			<DataTable value={data}>
				<Column header="ID" field="id"></Column>
				<Column header="Description" field="description"></Column>
				<Column
					body={downloadBtnTemplate}
					header="Download"
					field="destination"
				></Column>
			</DataTable>
		</>
	);
}

export default FileList;
