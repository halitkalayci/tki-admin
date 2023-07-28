"use client";
import React, {useEffect, useContext, useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import {LayoutContext} from "@/app/contexts/LayoutContext";
import {AuthContext} from "@/app/contexts/AuthContext";
import {MenuProvider} from "@/app/contexts/MenuContext";
import AppMenuitem from "../MenuItem/AppMenuItem";
import {NavbarTypes} from "@/app/constants/navbarTypes";

const AppMenu = () => {
	const {layoutConfig} = useContext(LayoutContext);
	const authContext = useContext(AuthContext);
	const navigate = useRouter();
	const [model, setModel] = useState([
		{
			label: "Home",
			items: [{label: "Dashboard", icon: "pi pi-fw pi-home", to: "/"}],
		},
	]);
	useEffect(() => {
		//fetchMenuItems();
	}, []);

	const fetchMenuItems = () => {
		axios
			.get("http://localhost:5210/api/GroupTreeContents/getall")
			.then(response => {
				let items = response.data
					.sort((a, b) => a.rowOrder - b.rowOrder)
					.filter(i => i.parentId == null || i.parentId == 0)
					.map(item => mapMenuItem(response.data, item));
				setModel(items);
			});
	};

	const mapMenuItem = (allMenu, menuItem) => {
		let newMenuItem = {
			id: menuItem.id,
			parentId: menuItem.parentId,
			label: menuItem.title,
			command: () => {
				if (menuItem.type == NavbarTypes.URL) navigate.push(menuItem.target);
				if (menuItem.type == NavbarTypes.LOGOUT) logout();
				// tüm türleri map.
			},
			to: menuItem.type == NavbarTypes.URL ? menuItem.target : "#",
			icon: menuItem.icon,
			visible: getVisibleStatus(menuItem),
			items: allMenu
				.sort((a, b) => a.rowOrder - b.rowOrder)
				.filter(i => i.parentId == menuItem.id)
				.map(subItem => mapMenuItem(allMenu, subItem)),
		};
		if (newMenuItem.items?.length <= 0) {
			newMenuItem = {...newMenuItem, items: undefined};
		}
		return newMenuItem;
	};

	const logout = () => {
		localStorage.removeItem("token");
		navigate.push("/login");
		authContext.setIsAuthenticated(false);
		authContext.showToastr({
			severity: "success",
			detail: "Başarıyla çıkış yapıldı.",
			summary: "Başarılı",
		});
	};

	const getVisibleStatus = menuItem => {
		let isAuthenticated = authContext.isAuthenticated;
		if (menuItem.hideOnAuth && isAuthenticated) return false;
		if (!menuItem.roles || menuItem.roles.length <= 0)
			return !menuItem.showOnAuth || isAuthenticated;
		if (!isAuthenticated) return false;
		return authContext.isAuthorized(menuItem.roles);
	};

	return (
		<MenuProvider>
			<ul className="layout-menu">
				{model.map((item, i) => {
					return !item.seperator ? (
						<AppMenuitem item={item} root={true} index={i} key={item.label} />
					) : (
						<li className="menu-separator"></li>
					);
				})}
			</ul>
		</MenuProvider>
	);
};

export default AppMenu;
