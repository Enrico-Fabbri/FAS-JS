const axios = require("axios");
const cheerio = require("cheerio");
const { exec } = require("child_process");

/*
 * Example Usage:
 *
 * const keywords = "naruto";
 *
 * function f(min, max, currentProgress) {
 *     console.log(`${min} - ${currentProgress} -> ${max}`);
 * }
 *
 * animeworld.search(keywords)
 *   .then((animeList) => {
 *     const firstAnime = animeList[0];
 *     return animeworld.getAnimeEpisodes(firstAnime.mainPageLink);
 *   })
 *   .then((episodes) => {
 *     const firstEpisode = episodes[0];
 *     return animeworld.getVideoLink(firstEpisode.videoID);
 *   })
 *   .then((link){
 * 	   animeworld.playVideo(link);
 *   })
 *   .catch((error) => {
 *     console.error(error.message);
 *   });
 *
 * Search Results:
 * [
 *   { name: 'Boruto: Naruto Next Generations', mainPageLink: '/play/boruto-naruto-next-generations.lYBFQ' },
 *   { name: 'Naruto Shippuden', mainPageLink: '/play/naruto-shippuden.v3U8a' },
 *   // ... (other entries)
 * ]
 *
 * Anime Episodes:
 * [
 *   { number: 1, videoID: 'mMTd5' },
 *   { number: 2, videoID: 'I1EWI' },
 *   // ... (other entries)
 * ]
 *
 */

const link = "https://animeworld.so";

/**
 * Asynchronous function to search for films using keywords and retrieve information about the search results.
 *
 * @param {string} keywords - The keywords to use for the anime search.
 * @returns {Array<{ name: string, mainPageLink: string }>} - An array of objects, each representing an anime found in the search.
 * Each object contains the anime's name and its main page link.
 * @throws Will throw an error if there is an issue with the search or if there is an error fetching the search results webpage.
 *
 * @example
 * // Search for animes using keywords
 * const searchResults = await animeworld.search('example anime');
 * console.log("Search Results:", searchResults);
 */
async function search(keywords) {
	try {
		// Fetch the search results webpage using Axios
		const response = await axios.get(`${link}/search?keyword=${keywords}`);
		const $ = cheerio.load(response.data);

		const found = [];

		// Extract anime information from the search results using Cheerio
		$(".film-list .name").each((index, element) => {
			const e = $(element);

			const name = e.text();
			const mainPageLink = e.attr("href");

			found.push({ name, mainPageLink });
		});

		//console.log(found);
		return found;
	} catch (error) {
		console.error("Error fetching the webpage:", error.message);
		throw error;
	}
}

/**
 * Asynchronous function to retrieve information about anime episodes from a given webpage.
 *
 * @param {string} mainPageLink - The main page link of the anime containing the episodes.
 * @param {function(number, number, number): void} progressBar - A function to update progress.
 *                              This function should accept the following parameters:
 *                              - {number} arg0 : min - The minimum value of the progress range.
 *                              - {number} arg1 : max - The maximum value of the progress range.
 *                              - {number} arg2 : currentProgress - The current progress value.
 * @param {number} [start] - The starting index of the episodes to fetch, if not specified will be the first episode.
 * @param {number} [end] - The ending index of the episodes to fetch, if not specified will be the last episode.
 * @returns {Array<{ number: number, videoID: string }>} An array of objects, each representing an anime episode.
 * @throws Will throw an error if there is an issue with the provided parameters or if there is an error fetching the webpage.
 *
 * @example
 * // Fetch all episodes of an anime
 * const allEpisodes = await animeworld.getAnimeEpisodes('/play/example-anime.******', f);
 *
 * @example
 * // Fetch episodes from 1 to 10
 * const episodesSubset = await animeworld.getAnimeEpisodes('/play/example-anime.******', f, 1, 10);
 */
async function getAnimeEpisodes(mainPageLink, progressBar, start, end) {
	let min, max;

	// Validate and set the range of episodes to fetch
	if (start == undefined && end == undefined) {
		min = 1;
		max = 100000;
	} else if (start >= 1 && end >= 1 && start <= end) {
		min = start;
		max = end;
	} else {
		throw new Error("Invalid values for start and end parameters");
	}

	try {
		// Fetch the webpage content using Axios
		const response = await axios.get(`${link}${mainPageLink}`);
		const $ = cheerio.load(response.data);

		const found = [];

		// Extract episode information from the webpage using Cheerio
		$(".server.active a").each((index, element) => {
			const number = index + 1;

			if (number >= min && number <= max) {
				const e = $(element);

				const videoID = e.attr("data-id");

				found.push({ number, videoID });

				progressBar(min, max, number - min);
			}
		});

		//console.log(found);
		return found;
	} catch (error) {
		console.error("Error fetching the webpage:", error.message);
		throw error;
	}
}

/**
 * Returns a formatted URL for watching anime videos on AnimeWorld.
 *
 * @param {string} videoID - The unique identifier of the anime video.
 * @returns {string} - A direct link to watch the anime video on AnimeWorld.
 *
 * @example
 * // Get a direct link to watch an anime video
 * const videoID = 'abc123';
 * const videoLink = animeworld.getVideoLink(videoID);
 * console.log("Anime Video Link:", videoLink);
 */
function getVideoLink(videoID) {
	return `${link}/api/episode/serverPlayerAnimeWorld?id=${videoID}`;
}

/**
 * Opens the default media player to play an anime video using the provided video link.
 *
 * @param {string} videoLink - The direct link to the anime video on AnimeWorld.
 *
 * @example
 * // Play an anime video using the default media player
 * const videoLink = animeitaly.getVideoLink("example-id");
 * animeitaly.playVideo(videoLink);
 */
function playVideo(videoLink) {
	const start =
		process.platform == "darwin"
			? "open"
			: process.platform == "win32"
			? "start"
			: "xdg-open";
	try {
		exec(start + " " + videoLink);
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
}

module.exports = {
	search,
	getAnimeEpisodes,
	getVideoLink,
	playVideo,
};
