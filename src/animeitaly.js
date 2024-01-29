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
 * animeitaly.search(keywords)
 *   .then((animeList) => {
 *     const firstAnime = animeList[0];
 *     return animeitaly.getAnimeEpisodes(firstAnime.mainPageLink);
 *   })
 *   .then((episodes) => {
 *     const firstEpisode = episodes[0];
 *     return animeitaly.getVideoLink(firstEpisode.videoID);
 *   })
 *   .then((link){
 * 	   animeitaly.playVideo(link);
 *   })
 *   .catch((error) => {
 *     console.error(error.message);
 *   });
 *
 * Search Results:
 * [
 *   { name: 'Naruto Film', mainPageLink: '/naruto-film/' },
 *   { name: 'Naruto ITA', mainPageLink: '/naruto-ita-c/' },
 *   // ... (other entries)
 * ]
 *
 * Anime Episodes:
 * [
 *   { number: 1, videoID: 'v91Lgy6jpQs41GR' },
 *   { number: 2, videoID: 'mqvOe0rg0atV9k' },
 *   // ... (other entries)
 * ]
 *
 */

const link = "https://animeitaly.tv";

/**
 * Asynchronous function to search for anime using keywords and retrieve information about the search results.
 *
 * @param {string} keywords - The keywords to use for the anime search.
 * @returns {Array<{ name: string, mainPageLink: string }>} - An array of objects,
 * each representing an anime found in the search. Each object contains the anime's name and its main page link.
 * @throws Will throw an error if there is an issue with the search or if there is an error fetching the search results webpage.
 *
 * @example
 * // Search for anime using keywords
 * const searchResults = await animeitaly.search('one piece');
 * console.log("Search Results:", searchResults);
 */
async function search(keywords) {
	try {
		const response = await axios.get(`${link}/?s=${keywords}`);
		const $ = cheerio.load(response.data);

		const found = [];
		$(".entry-header a").each((index, element) => {
			const e = $(element);

			const name = e.text();
			const mainPageLink = e.attr("href").match(/animeitaly\.tv(.*)/)[1];

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
 * Asynchronous function to retrieve information about anime episodes from a given animeitaly page.
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
 * const allEpisodes = await animeitaly.getAnimeEpisodes('/example-anime/', f);
 *
 * @example
 * // Fetch episodes from 1 to 10
 * const episodesSubset = await animeitaly.getAnimeEpisodes('/example-anime/', f, 1, 10);
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
		const response = await axios.get(`${link}${mainPageLink}`);
		const $ = cheerio.load(response.data);

		const found = [];

		const a = $(".row-hover .column-2 a");

		const last = a.index(a.last()) + 1;

		if (max > last) max = last;

		a.each(async (index, element) => {
			const number = index + 1;

			if (number >= min && number <= max) {
				const e = $(element);

				const videoLink = e.attr("href");
				const videoID = videoLink.match(/\/v\/(.*?)\//)[1];

				found.push({ number, videoID });

				progressBar(min, max, number - min + 1);
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
 * Returns a formatted URL for watching anime videos on AnimeItaly.
 *
 * @param {string} videoID - The unique identifier of the anime video.
 * @returns {string} - A direct link to watch the anime video on AnimeItaly.
 *
 * @example
 * // Get a direct link to watch an anime video
 * const videoID = 'abc123';
 * const videoLink = animeitaly.getVideoLink(videoID);
 * console.log("Anime Video Link:", videoLink);
 */
function getVideoLink(videoID) {
	return `https://streamtape.com/e/${videoID}`;
}

/**
 * Opens the default media player to play an anime video using the provided video link.
 *
 * @param {string} videoLink - The direct link to the anime video on AnimeItaly.
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
