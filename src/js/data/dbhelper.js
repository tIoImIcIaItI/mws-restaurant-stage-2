import config from '../config';
import api from './api';

function distinct(arr, key) {
	const keys = arr.map((v, i) => arr[i][key]);
	return keys.filter((v, i) => keys.indexOf(v) === i);
}

/**
 * Common database helper functions.
 */
export default class DBHelper {

	/**
	 * Fetch all restaurants.
	 */
	static fetchRestaurants(callback) {

		const xhr = new XMLHttpRequest();
		xhr.open('GET', api.restaurants());
		xhr.onload = () => {
			if (xhr.status === 200) {
				callback(null, JSON.parse(xhr.responseText));
			} else {
				callback(`Request failed. Returned status of ${xhr.status}`, null);
			}
		};
		xhr.send();
	}

	/**
	 * Fetch a restaurant by its ID.
	 */
	static fetchRestaurantById(id, callback) {

		const xhr = new XMLHttpRequest();
		xhr.open('GET', api.restaurant(id));
		xhr.onload = () => {
			if (xhr.status === 200 && xhr.responseText == 'undefined') {
				callback('Request returned no data', null);
			} else if (xhr.status === 200) {
				callback(null, JSON.parse(xhr.responseText));
			} else if (xhr.status === 404) {
				callback(`Restaurant with ID ${id} not found`, null);
			} else {
				callback(`Request failed. Returned status of ${xhr.status}`, null);
			}
		};
		xhr.send();
	}

	/**
	 * Fetch restaurants by a cuisine type with proper error handling.
	 */
	static fetchRestaurantByCuisine(cuisine, callback) {
		// Fetch all restaurants  with proper error handling
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Filter restaurants to have only given cuisine type
				callback(null, (restaurants || []).filter(r => r.cuisine_type === cuisine));
			}
		});
	}

	/**
	 * Fetch restaurants by a neighborhood with proper error handling.
	 */
	static fetchRestaurantByNeighborhood(neighborhood, callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Filter restaurants to have only given neighborhood
				callback(null, (restaurants || []).filter(r => r.neighborhood === neighborhood));
			}
		});
	}

	/**
	 * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
	 */
	static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				let results = (restaurants || []);
				if (cuisine !== 'all') { // filter by cuisine
					results = results.filter(r => r.cuisine_type === cuisine);
				}
				if (neighborhood !== 'all') { // filter by neighborhood
					results = results.filter(r => r.neighborhood === neighborhood);
				}
				callback(null, results);
			}
		});
	}

	static fetchInitialData(callback) {
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				restaurants = restaurants || [];

				callback(null, {
					neighborhoods: distinct(restaurants, 'neighborhood'),
					cuisines: distinct(restaurants, 'cuisine_type'),
					restaurants
				});
			}
		});
	}

	/**
	 * Restaurant page URL.
	 */
	static urlForRestaurant(restaurant) {
		return (`./restaurant.html?id=${restaurant.id}`);
	}

	/**
	 * Restaurant image URL.
	 */
	static imageUrlForRestaurant(restaurant) {
		return (`/img/${restaurant.photograph || restaurant.id || 'missing.png'}`);
	}
}