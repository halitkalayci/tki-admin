"use client";
import {AuthContext} from "@/app/contexts/AuthContext";
import {LoaderContext} from "@/app/contexts/LoaderContext";
import {useRouter} from "next/navigation";
import React, {useContext, useEffect} from "react";

export default function Subscriber() {
	const authContext = useContext(AuthContext);
	const loaderContext = useContext(LoaderContext);
	const navigation = useRouter();

	// Dinleyicilerin oluşturulması..
	useEffect(() => {
		window.addEventListener("toastr", e => {
			console.log(e);
			authContext.showToastr(e.detail);
		});
		window.addEventListener("redirectToLogin", () => {
			navigation.push("/login");
		});
		window.addEventListener("requestStart", () => {
			loaderContext.requestStart();
		});
		window.addEventListener("requestEnd", () => {
			loaderContext.requestEnd();
		});
	}, []);

	return <></>;
}
