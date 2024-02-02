const { animesaturn } = require("../index");

async function measureExecutionTime() {
	const startTime = performance.now();

	let searchExecutionTime, getAnimeInfoTime, getAnimeEpisodesExecutionTime;

	try {
		const searchStartTime = performance.now();
		const result = await animesaturn.search("one piece");
		const searchEndTime = performance.now();
		searchExecutionTime = searchEndTime - searchStartTime;

		const mainPageLink = result[0].mainPageLink;

		const getAnimeInfoStartTime = performance.now();
		const info = await animesaturn.getAnimeInfo(mainPageLink);
		const getAnimeInfoEndTime = performance.now();

		getAnimeInfoTime = getAnimeInfoEndTime - getAnimeInfoStartTime;

		function f(min, max, currentProgress) {
			//console.log(`${min} - ${currentProgress} -> ${max}`);
		}

		const getAnimeEpisodesStartTime = performance.now();
		const episodes = await animesaturn.getAnimeEpisodes(mainPageLink, f);
		const getAnimeEpisodesEndTime = performance.now();
		getAnimeEpisodesExecutionTime =
			getAnimeEpisodesEndTime - getAnimeEpisodesStartTime;

		const link = await animesaturn.getVideoLink(episodes[0].videoID);
		//await animesaturn.playVideo(link);
	} catch (error) {
		console.error("Error:", error);
	} finally {
		const endTime = performance.now();
		const executionTime = endTime - startTime;

		console.log(
			`AnimeSaturn: search Function Execution time: ${searchExecutionTime} milliseconds`
		);
		console.log(
			`AnimeSaturn: getAnimeInfo Function Execution time: ${getAnimeInfoTime} milliseconds`
		);
		console.log(
			`AnimeSaturn: getAnimeEpisodes Function Execution time: ${getAnimeEpisodesExecutionTime} milliseconds`
		);
		console.log(
			`AnimeSaturn: Total Execution time: ${executionTime} milliseconds`
		);

		return executionTime;
	}
}

module.exports = { measureExecutionTime };
