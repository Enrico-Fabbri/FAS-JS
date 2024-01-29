const axios = require("axios");
const cheerio = require("cheerio");
const { exec } = require("child_process");

/*
 * Example Usage:
 *
 * const keywords = "frieren";
 *
 * function f(min, max, currentProgress) {
 *     console.log(`${min} - ${currentProgress} -> ${max}`);
 * }
 *
 * animesaturn.search(keywords)
 *   .then((animeList) => {
 *     const firstAnime = animeList[0];
 *     return animesaturn.getAnimeEpisodes(firstAnime.mainPageLink, f);
 *   })
 *   .then((episodes) => {
 *     const firstEpisode = episodes[0];
 *     return animesaturn.getVideoLink(firstEpisode.videoID);
 *   })
 *   .then((link){
 * 	   animesaturn.playVideo(link);
 *   })
 *   .catch((error) => {
 *     console.error(error.message);
 *   });
 *
 * Search Results:
 * [
 *   {
 *     name: 'Frieren: Beyond Journey’s End',
 *     mainPageLink: '/anime/Frieren-Beyond-Journeys-End-a'
 *   },
 *   {
 *     name: 'Frieren: Beyond Journey’s End (ITA)',
 *     mainPageLink: '/anime/Frieren-Beyond-Journeys-End-ITA-a'
 *   },
 *   // ... (other entries)
 * ]
 *
 * Anime Episodes:
 * [
 *   { number: 1, videoID: 'oU51D-naQbstl' },
 *   { number: 2, videoID: 'x-xUpZVFHJx7S' },
 *   // ... (other entries)
 * ]
 *
 */

const link = "https://animesaturn.tv";

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
 * const searchResults = await animesaturn.search('one piece');
 * console.log("Search Results:", searchResults);
 */
async function search(keywords) {
	try {
		const response = await axios.get(
			`${link}/animelist?search=${keywords}`
		);
		const $ = cheerio.load(response.data);

		const found = [];
		$(".info-archivio h3 a").each((index, element) => {
			const e = $(element);

			const name = e.text();
			const mainPageLink = e.attr("href").match(/animesaturn\.tv(.*)/)[1];

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
 * Asynchronous function to retrieve information about anime episodes from a given animesaturn page.
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
 * const allEpisodes = await animesaturn.getAnimeEpisodes('/anime/example-anime.******', f);
 *
 * @example
 * // Fetch episodes from 1 to 10
 * const episodesSubset = await animesaturn.getAnimeEpisodes('/anime/example-anime.******', f, 1, 10);
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

		const tmp = [];
		//const tmp_n = [];

		const a = $(".episodes-button a");

		const last = a.index(a.last()) + 1;

		if (max > last) max = last;

		const batchNumber = 50;

		for (let current = min - 1; current <= max; current += batchNumber) {
			const batch = [];

			for (let i = 0; i <= batchNumber && current + i < max; i++) {
				batch.push(
					getLink(a.eq(current + i).attr("href")).then(
						progressBar(min, max, current + i + 1)
					)
				);

				//tmp_n.push(current + i + 1);
			}

			await Promise.all(batch)
				.then((resolvedValues) => {
					tmp.push(...resolvedValues);
				})
				.catch((error) => {
					console.error("Error during promise resolution:", error);
				});
		}

		const found = tmp.map((videoLink, index) => ({
			number: index + 1, //tmp_n[index],
			videoID: videoLink.match(/watch\?file=(.*)/)[1],
		}));

		//console.log(found);
		return found;
	} catch (error) {
		console.error("Error fetching the webpage:", error.message);
		throw error;
	}
}

async function getLink(epPageLink) {
	try {
		const response = await axios.get(epPageLink);
		const $ = cheerio.load(response.data);

		/*const epLink =*/
		return $('b:contains("Guarda lo Streaming")')
			.parent()
			.parent()
			.attr("href");

		/*const a = async () => {
				try {
					const response__ = await axios.get(epLink);
					const $__ = cheerio.load(response__.data);

					const script = $__("script").eq(9);
					const videoLink = script
						.html()
						.match(/file:\s*"(.*?)",/)[1];

					return videoLink;
				} catch (error) {
					console.error("Error fetching the webpage:", error.message);
					throw error;
				}
			};

        return await a();*/
	} catch (error) {
		console.error("Error fetching the webpage:", error.message);
		throw error;
	}
}

/**
 * Returns a formatted URL for watching anime videos on AnimeSaturn.
 *
 * @param {string} videoID - The unique identifier of the anime video.
 * @returns {string} - A direct link to watch the anime video on AnimeSaturn.
 *
 * @example
 * // Get a direct link to watch an anime video
 * const videoID = 'abc123';
 * const videoLink = animesaturn.getVideoLink(videoID);
 * console.log("Anime Video Link:", videoLink);
 */
function getVideoLink(videoID) {
	return `https://www.animesaturn.tv/watch?file=${videoID}`;
}

/**
 * Opens the default media player to play an anime video using the provided video link.
 *
 * @param {string} videoLink - The direct link to the anime video on AnimeSaturn.
 *
 * @example
 * // Play an anime video using the default media player
 * const videoLink = animesaturn.getVideoLink("example-id");
 * animesaturn.playVideo(videoLink);
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
