//jshint esversion: 11

let lvlid = document.querySelector('#LvlId');
let h = new URL(document.URL).searchParams;
lvlid.innerHTML = h.get("id");
	  
let GraphData;
let LevelDifficulty;
let LevelName;
let LevelCreator;
let isDemon;
let isAuto;
	  
      
fetch(`https://gddif.gdspikes.workers.dev/browser?id=${h.get("id")}`).then(x => x.json()).then(json => {
    LvlName.innerHTML = json.name;
	LvlCrt.innerHTML = json.creator || "Player";
		
	setDiffFace(json.difficulty, json.demon, json.auto);
		
	GraphData = () => {
		if(json.diff.length == 1) {
			delete json.diff[0].results[0].id;
			delete json.diff[0].results[0].lock;
			return Object.values(json.diff[0].results[0]);
		} else {
			let merged = [0,0,0,0,0,0,0,0,0,0];
			json.diff[1].results.forEach((r) => {
				for(let i = 1; i<11; i++) {
					merged[i-1] += Object.values(r)[i];
				}
			});
			merged = merged.map(m => m/json.diff[1].results.length)
			return merged;
		}
	};
		
	createChart(GraphData());
		
	isDemon = json.demon || 0;
	isAuto = json.auto || 0;
});
	  
Chart.defaults.color = "#fff";
	  
function setDiffFace(diff, demon, auto) {
	if(auto) {
		DifficultyFace.src = "/static/auto.png";
	} else if(demon) {
		switch(diff) {
			case 10:
				DifficultyFace.src = "/static/easydemon.png";
				break;
			case 20:
				DifficultyFace.src = "/static/mediumdemon.png";
				break;
			case 30:
				DifficultyFace.src = "/static/demon.png";
				break;
			case 40:
				DifficultyFace.src = "/static/insanedemon.png";
				break;
			case 50:
				DifficultyFace.src = "/static/extremedemon.png";
				break;
		}
	} else {
		switch(diff) {
			case 10:
				DifficultyFace.src = "/static/easy.png";
				break;
			case 20:
				DifficultyFace.src = "/static/normal.png";
				break;
			case 30:
				DifficultyFace.src = "/static/hard.png";
				break;
			case 40:
				DifficultyFace.src = "/static/harder.png";
				break;
			case 50:
				DifficultyFace.src = "/static/insane.png";
				break;
			default:
				return;
		}
	}
}
	  
function createChart(diffdata) {
	new Chart(document.querySelector("#gdcanvas"), {
		type: "line",
		data: {
			labels: ["0-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60-70", "70-80", "80-90", "90-100"],
			datasets: [{
				label: "Difficulty Spike",
				data: diffdata
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true,
					max: 10
				}
			}
		}
	});
}