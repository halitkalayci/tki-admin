"use client";
import {classNames} from "primereact/utils";
import React, {useContext, useEffect, useRef} from "react";
import {LayoutContext} from "../contexts/LayoutContext";
import AppTopBar from "./TopBar/AppTopBar";
import AppSidebar from "./SideBar/Sidebar";
import {AuthProvider} from "../contexts/AuthContext";
import {useRouter} from "next/navigation";
import {
	useEventListener,
	useMountEffect,
	useUnmountEffect,
} from "primereact/hooks";

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

	const topbarRef = useRef(null);
	const sidebarRef = useRef(null);

	const router = useRouter();
	const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] =
		useEventListener({
			type: "click",
			listener: event => {
				const isOutsideClicked = !(
					sidebarRef.current.isSameNode(event.target) ||
					sidebarRef.current.contains(event.target) ||
					topbarRef.current.menubutton.isSameNode(event.target) ||
					topbarRef.current.menubutton.contains(event.target)
				);

				if (isOutsideClicked) {
					hideMenu();
				}
			},
		});

	const [
		bindProfileMenuOutsideClickListener,
		unbindProfileMenuOutsideClickListener,
	] = useEventListener({
		type: "click",
		listener: event => {
			const isOutsideClicked = !(
				topbarRef.current.topbarmenu.isSameNode(event.target) ||
				topbarRef.current.topbarmenu.contains(event.target) ||
				topbarRef.current.topbarmenubutton.isSameNode(event.target) ||
				topbarRef.current.topbarmenubutton.contains(event.target)
			);

			if (isOutsideClicked) {
				hideProfileMenu();
			}
		},
	});

	const hideMenu = () => {
		setLayoutState(prevLayoutState => ({
			...prevLayoutState,
			overlayMenuActive: false,
			staticMenuMobileActive: false,
			menuHoverActive: false,
		}));
		unbindMenuOutsideClickListener();
		unblockBodyScroll();
	};

	const hideProfileMenu = () => {
		setLayoutState(prevLayoutState => ({
			...prevLayoutState,
			profileSidebarVisible: false,
		}));
		unbindProfileMenuOutsideClickListener();
	};

	const blockBodyScroll = () => {
		DomHandler.addClass("blocked-scroll");
	};

	const unblockBodyScroll = () => {
		DomHandler.removeClass("blocked-scroll");
	};

	useMountEffect(() => {
		PrimeReact.ripple = true;
	});

	useEffect(() => {
		if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
			bindMenuOutsideClickListener();
		}

		layoutState.staticMenuMobileActive && blockBodyScroll();
	}, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

	useEffect(() => {
		if (layoutState.profileSidebarVisible) {
			bindProfileMenuOutsideClickListener();
		}
	}, [layoutState.profileSidebarVisible]);

	useEffect(() => {
		router.events.on("routeChangeComplete", () => {
			hideMenu();
			hideProfileMenu();
		});
	}, []);

	useUnmountEffect(() => {
		unbindMenuOutsideClickListener();
		unbindProfileMenuOutsideClickListener();
	});

	return (
		<AuthProvider>
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
		</AuthProvider>
	);
}

export default MainLayout;
