"use client";

import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";

import { MenuContext, SearchContext } from "@/app/components/RootApp";

import { analyticsService } from "../analytics";
import { Category } from "../utils/categories";

const getNumberOfInitiatives = (category: Category) =>
	category.subCategories.reduce(
		(acc, subcategory) => acc + subcategory.links.length,
		0,
	);

export function CategoriesList({
	categories,
	categoryId,
}: {
	categories: Array<Category>;
	categoryId?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const navbarRef = useRef<HTMLDivElement>(null);

	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(true);
	const { search, onSearch } = useContext(SearchContext);
	// const { isMobile, isMenuOpen, toggleMenu } = useContext(MenuContext);

	useEffect(() => {
		const selected = document.querySelector(".links-section.desktop-open");
		if (!selected) return;
		selected.scrollIntoView({
			behavior: "auto",
			inline: "center",
		});
	}, []);

	useEffect(() => {
		const container = navbarRef.current;
		if (container) {
			const checkScrollArrows = () => {
				const isAtStart = container.scrollLeft === 0;
				const isAtEnd =
					container.scrollLeft + container.offsetWidth ===
					container.scrollWidth;
				setShowLeftArrow(!isAtStart);
				setShowRightArrow(!isAtEnd);
			};

			// Initial check
			checkScrollArrows();

			// Set up event listener for scroll
			container.addEventListener("scroll", checkScrollArrows, {
				passive: true,
			});

			// Clean up event listener on unmount
			return () => container.removeEventListener("scroll", checkScrollArrows);
		}
	}, []);

	function scrollLeft() {
		const container = document.querySelector(".icon-navbar");
		if (container) {
			container.scrollBy({ left: -300, behavior: "smooth" });
		}
	}

	function scrollRight() {
		const container = document.querySelector(".icon-navbar");
		if (container) {
			container.scrollBy({ left: 300, behavior: "smooth" });
		}
	}

	return (
		<div className={`desktop-category`}>
			<div dir="rtl" className="icon-navbar" ref={navbarRef}>
				<div
					className={`scroll-arrow left ${showLeftArrow ? "" : "hidden"}`}
					onClick={scrollLeft}
				>
					<FaCircleChevronLeft />
				</div>

				{categories.map((category) => (
					<div
						ref={ref}
						className={[
							"links-section",
							!search && category.id === categoryId && "desktop-open",
						]
							.filter(Boolean)
							.join(" ")}
						id={category.name}
						key={category.name}
					>
						<Link
							href={`/${category.id}`}
							key={category.name}
							replace
							className="w-full"
							onClick={() => {
								analyticsService.trackCategoryView(category.id);
								onSearch("");
								// isMobile && isMenuOpen && toggleMenu();
							}}
						>
							<div className="links-section-title">
								{category.image && (
									<img
										src={category.image}
										alt={`${category.displayName} Icon`}
										className="category-icon"
									/>
								)}
								<span>{category.displayName}</span>
								<span className="numbers">
									{getNumberOfInitiatives(category)}
								</span>
							</div>
						</Link>
					</div>
				))}

				<div
					className={`scroll-arrow right ${showRightArrow ? "" : "hidden"}`}
					onClick={scrollRight}
				>
					<FaCircleChevronRight />
				</div>
			</div>
		</div>
	);
}
