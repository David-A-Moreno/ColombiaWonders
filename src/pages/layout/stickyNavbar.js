import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import myImage from "../../images/profile-default.jpg";
import logoImage from '../../images/logo.png'; // Import your image

import {
	Navbar,
	MobileNav,
	Typography,
	Button,
	IconButton,
	Card,
	Popover,
	PopoverHandler,
	PopoverContent,
	Avatar,
	List,
	ListItem,
	ListItemPrefix,
} from "@material-tailwind/react";

export default function StickyNavbar() {
	const [openNav, setOpenNav] = React.useState(false);
	const navigate = useNavigate(); // Hook de navegación

	const name = JSON.parse(localStorage.getItem("name"));

	const email = JSON.parse(localStorage.getItem("email"));

	const [cerrarSesion, setCerrarSesion] = useState(false);

	React.useEffect(() => {
		window.addEventListener("resize", () => window.innerWidth >= 960 && setOpenNav(false));
	}, []);

	if (cerrarSesion) {
		//Limpiar toda la informacion del usuario incluido el token
		localStorage.clear();
		window.localStorage.clear(); //try this to clear all local storage
		window.location.reload();
	}

	return (
		<Navbar className="absolute top-0 left-0 right-0 z-10 max-w-full rounded-none px-2 py-2 lg:px-12 lg:py-3 bg-[#3667A6]">
			<div className="flex items-center justify-between text-blue-gray-900 ">
				<div className="flex items-center justify-between" onClick={() => navigate("/")}>
					<img src={logoImage} alt="Logo" className="w-36 h-auto cursor-pointer" />
				</div>
			</div>
		</Navbar>
	);
}
