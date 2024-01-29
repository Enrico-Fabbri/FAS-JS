const animeitaly = require("./tests/animeitaly.test");
const animesaturn = require("./tests/animesaturn.test");
const animeworld = require("./tests/animeworld.test");

const n = 100;

async function animeitalyF() {
	let t = 0;
	for (let i = 0; i < n; i++) {
		t += await animeitaly.measureExecutionTime();
	}
	//console.log(t / n);
	return t / n;
}

async function animesaturnF() {
	let m = 0;
	for (let j = 0; j < n; j++) {
		m += await animesaturn.measureExecutionTime();
	}
	//console.log(m / n);
	return m / n;
}

async function animeworldF() {
	let s = 0;
	for (let k = 0; k < n; k++) {
		s += await animeworld.measureExecutionTime();
	}
	//console.log(s / n);
	return s / n;
}

//animeitalyF();
//animeworldF();
//animesaturnF(); // This is very slow, not recommended

async function single() {
	await animeitaly.measureExecutionTime();
	console.log();
	await animeworld.measureExecutionTime();
	console.log();
	await animesaturn.measureExecutionTime();
}

//single();

async function multiple() {
	const t = await animeitalyF();
	console.log();
	const s = await animeworldF();
	console.log();
	const m = await animesaturnF();
	console.log();

	console.log(`AnimeItaly: Total Execution time: ${t} \n`);
	console.log(`AnimeWorld: Total Execution time: ${s} \n`);
	console.log(`AnimeSaturn: Total Execution time: ${m} \n`);
}

multiple();
