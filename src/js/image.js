import config from '../../tasks/config';

export const buildRestaurantImage = (restaurant, image, src, group) => {

	const idx = src.lastIndexOf('.');
	const ext = idx >= 0 ? src.substring(idx) : '.jpg';
	const base = idx >= 0 ? src.substring(0, idx) : src;

	const srcset =
		config.srcset.groups[group].
			map(set => `${base}-${set.tag}${ext} ${set.width}w`).
			join(', ');

	const sizes =
		config.srcset.groups[group].
			map(set => set.size ? `${set.size}` : null).
			filter(s => s != null).
			join(', ');

	image.className = 'restaurant-img';
	image.src = src;
	image.srcset = srcset;
	image.sizes = sizes;
	image.alt = restaurant.name;
};
