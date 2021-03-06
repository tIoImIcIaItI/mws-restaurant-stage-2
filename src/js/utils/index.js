export const loadScript = (document, src, async, integrity, crossorigin) => {
	var child = document.createElement('script');
	child.src = src;

	if (async) child.async = true;
	if (integrity) child.integrity = integrity;
	if (crossorigin) child.crossOrigin = crossorigin;

	var parent = document.getElementsByTagName('head')[0];
	parent.appendChild(child);
};

const jsonResponse = (obj, status, statusText) =>
	new Response(
		new Blob([JSON.stringify(obj)], {
			type: 'application/json'
		}), {
			"status": status,
			"statusText": statusText
		});

export const jsonResponseFrom = (obj) =>
	jsonResponse(obj, 200, "ok");

export const acceptedResponseFrom = (obj) =>
	jsonResponse(obj, 202, "ACCEPTED");

// SOURCE: https://stackoverflow.com/questions/9457891/how-to-detect-if-domcontentloaded-was-fired
export const waitForDOMContentLoaded = (document) => {
	return new Promise(resolve => {
		if (/comp|inter|loaded/.test(document.readyState))
			resolve();
		else
			document.addEventListener('DOMContentLoaded', resolve);
	});
};

/**
 * Get a parameter by name from page URL.
 */
export const getParameterByName = (name, url) => {
	if (!url)
		url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
		results = regex.exec(url);
	if (!results)
		return null;
	if (!results[2])
		return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export const isTrue = (value) =>
	value === 'true' ? true :
		value === 'false' ? false :
			value;
