"use client";
import {classNames} from "primereact/utils";
import React, {useContext, useRef} from "react";
import {LayoutContext} from "../contexts/LayoutContext";
import AppTopBar from "./TopBar/AppTopBar";
import AppSidebar from "./SideBar/Sidebar";

function MainLayout(props) {
	const {layoutConfig, layoutState, setLayoutState} = useContext(LayoutContext);

	const containerClass = classNames("layout-wrapper", {
		"layout-overlay": layoutConfig.menuMode === "overlay",
		"layout-static": layoutConfig.menuMode === "static",
		"layout-static-inactive":
			layoutState.staticMenuDesktopInactive &&
			layoutConfig.menuMode === "static",
		"layout-overlay-active": layoutState.overlayMenuActive,
		"layout-mobile-active": layoutState.staticMenuMobileActive,
		"p-input-filled": layoutConfig.inputStyle === "filled",
		"p-ripple-disabled": !layoutConfig.ripple,
	});

	const topbarRef = useRef();
	const sidebarRef = useRef();

	return (
		<div className={containerClass}>
			<AppTopBar ref={topbarRef} />
			<div ref={sidebarRef} className="layout-sidebar">
				<AppSidebar />
			</div>
			<div className="layout-main-container">
				<div className="layout-main">{props.children}</div>
				{/* <AppFooter /> */}
			</div>
			{/* <AppConfig /> */}
			<div className="layout-mask"></div>
		</div>
	);
}

export default MainLayout;
