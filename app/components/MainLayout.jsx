import Head from "next/head";
import {usePathname, useRouter} from "next/navigation";
import {
	useEventListener,
	useMountEffect,
	useUnmountEffect,
} from "primereact/hooks";
import {classNames, DomHandler} from "primereact/utils";
import React, {useContext, useEffect, useRef} from "react";
import PrimeReact from "primereact/api";
import {AuthProvider} from "../contexts/AuthContext";
import AppSidebar from "./SideBar/Sidebar";
import AppTopBar from "./TopBar/AppTopBar";
import {LayoutContext} from "../contexts/LayoutContext";

const Layout = props => {
	const {setShowLayout, showLayout, layoutConfig, layoutState, setLayoutState} =
		useContext(LayoutContext);
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
	const layoutlessUrls = ["/login", "/register"];
	const usePathName = usePathname();

	useEffect(() => {
		if (layoutlessUrls.includes(usePathName)) {
			setShowLayout(false);
		} else {
			setShowLayout(true);
		}
	}, [showLayout]);
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
		// router.events.on("routeChangeComplete", () => {
		// 	hideMenu();
		// 	hideProfileMenu();
		// });
	}, []);

	useUnmountEffect(() => {
		unbindMenuOutsideClickListener();
		unbindProfileMenuOutsideClickListener();
	});

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

	return (
		<React.Fragment>
			<Head>
				<title>TKI Admin Panel</title>
				<meta charSet="UTF-8" />
				<meta
					name="description"
					content="The ultimate collection of design-agnostic, flexible and accessible React UI Components."
				/>
				<meta name="robots" content="index, follow" />
				<meta name="viewport" content="initial-scale=1, width=device-width" />
				<meta property="og:type" content="website"></meta>
				<meta
					property="og:title"
					content="Sakai by PrimeReact | Free Admin Template for NextJS"
				></meta>
				<meta
					property="og:url"
					content="https://www.primefaces.org/sakai-react"
				></meta>
				<meta
					property="og:description"
					content="The ultimate collection of design-agnostic, flexible and accessible React UI Components."
				/>
				<meta
					property="og:image"
					content="https://www.primefaces.org/static/social/sakai-nextjs.png"
				></meta>
				<meta property="og:ttl" content="604800"></meta>
				<link rel="icon" href={`/favicon.ico`} type="image/x-icon"></link>
			</Head>
			<AuthProvider>
				<div className={containerClass}>
					{showLayout && (
						<>
							<AppTopBar ref={topbarRef} />
							<div ref={sidebarRef} className="layout-sidebar">
								<AppSidebar />
							</div>
						</>
					)}
					<div
						className={
							"layout-main-container " + (!showLayout ? "layoutless-page" : "")
						}
					>
						<div className="layout-main">{props.children}</div>
						{/* <AppFooter /> */}
					</div>
					{/* <AppConfig /> */}
					<div className="layout-mask"></div>
				</div>
			</AuthProvider>
		</React.Fragment>
	);
};

export default Layout;
