const { animeworld } = require("../index");

async function measureExecutionTime() {
	const startTime = performance.now();

	let searchExecutionTime, getAnimeEpisodesExecutionTime;

	try {
		const searchStartTime = performance.now();
		const result = await animeworld.search("one piece");
		const searchEndTime = performance.now();
		searchExecutionTime = searchEndTime - searchStartTime;

		const mainPageLink = result[0].mainPageLink;

		function f(min, max, currentProgress) {
			//console.log(`${min} - ${currentProgress} -> ${max}`);
		}

		const getAnimeEpisodesStartTime = performance.now();
		const episodes = await animeworld.getAnimeEpisodes(mainPageLink, f);
		const getAnimeEpisodesEndTime = performance.now();
		getAnimeEpisodesExecutionTime =
			getAnimeEpisodesEndTime - getAnimeEpisodesStartTime;

		const link = await animeworld.getVideoLink(episodes[0].videoID);
		// await animeworld.playVideo(link);
	} catch (error) {
		console.error("Error:", error);
	} finally {
		const endTime = performance.now();
		const executionTime = endTime - startTime;

		console.log(
			`AnimeWorld: search Function Execution time: ${searchExecutionTime} milliseconds`
		);
		console.log(
			`AnimeWorld: getAnimeEpisodes Function Execution time: ${getAnimeEpisodesExecutionTime} milliseconds`
		);
		console.log(
			`AnimeWorld: Total Execution time: ${executionTime} milliseconds`
		);

		return executionTime;
	}
}

module.exports = { measureExecutionTime };
