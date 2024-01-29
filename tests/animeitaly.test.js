const { animeitaly } = require("../index");

async function measureExecutionTime() {
	const startTime = performance.now();

	let searchExecutionTime, getAnimeEpisodesExecutionTime;

	try {
		const searchStartTime = performance.now();
		const result = await animeitaly.search("one piece");
		const searchEndTime = performance.now();
		searchExecutionTime = searchEndTime - searchStartTime;

		const mainPageLink = result[0].mainPageLink;

		function f(min, max, currentProgress) {
			//console.log(`${min} - ${currentProgress} -> ${max}`);
		}

		const getAnimeEpisodesStartTime = performance.now();
		const episodes = await animeitaly.getAnimeEpisodes(mainPageLink, f);
		const getAnimeEpisodesEndTime = performance.now();
		getAnimeEpisodesExecutionTime =
			getAnimeEpisodesEndTime - getAnimeEpisodesStartTime;

		const link = await animeitaly.getVideoLink(episodes[0].videoID);
		//await animeitaly.playVideo(link);
	} catch (error) {
		console.error("Error:", error);
	} finally {
		const endTime = performance.now();
		const executionTime = endTime - startTime;

		console.log(
			`AnimeItaly: search Function Execution time: ${searchExecutionTime} milliseconds`
		);
		console.log(
			`AnimeItaly: getAnimeEpisodes Function Execution time: ${getAnimeEpisodesExecutionTime} milliseconds`
		);
		console.log(
			`AnimeItaly: Total Execution time: ${executionTime} milliseconds`
		);

		return executionTime;
	}
}

module.exports = { measureExecutionTime };
