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
		<Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none lg:px-12 lg:py-3 bg-[#3667A6]">
			<div className="flex items-center justify-between text-blue-gray-900 ">
				<div className="flex items-center justify-between" onClick={() => navigate("/")}>
					<img src={logoImage} alt="Logo" className="w-36 h-auto cursor-pointer" />
				</div>
			</div>
		</Navbar>
	);
}
