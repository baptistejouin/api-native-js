const canvas = document.getElementById('js-canvas')
	, inputQuery = document.getElementById('js-input-query')
	, submitQuery = document.getElementById('js-submit')
	, error = document.getElementById('js-error')
	, errorText = document.getElementById('js-error-text')

// Normally hide this information in .env file
const API_KEY = "appid=3b2d341d07c93912528fb586fc873dd3"

submitQuery.addEventListener('click', (e) => {
	e.preventDefault()
	handleSubmit(e)
})

async function handleSubmit(e) {
	// Reset error
	handleError(false)
	// Search with lowerCase
	const value = inputQuery.value.toLowerCase()
	// Get latitude, longitude and name with the input value and destructuring
	const { lat, lon, name } = await getLatLon(`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=1&${API_KEY}`)
	// Updating the graph with the API and GPS coordinates
	updateChart(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation`, name)
}

function handleError(bool) {
	errorText.textContent = inputQuery.value
	error.style.display = bool ? "block" : "none"
	if (bool) throw new Error('No data found')
}

async function getLatLon(url) {
	const response = await fetch(url)
	const data = await response.json()
	if (data.length === 0) {
		handleError(true)
	}
	// Return only latitude, longitude and name as an object
	return { lon: data[0].lon, lat: data[0].lat, name: data[0].name }
}

async function updateChart(url, name) {
	console.log(url)
	const response = await fetch(url)
	const data = await response.json()

	for (let i = 0; i < data.hourly.time.length; i++) {
		// Change of the date display for better readability
		data.hourly.time[i] = getDate(data.hourly.time[i])
	}

	// Update Dataset [0]
	// Update Y Axis
	chart.data.labels = data.hourly.time
	// Update X Axis
	chart.data.datasets[0].data = data.hourly.temperature_2m

	// Update Dataset [1]
	// Update X Axis
	chart.data.datasets[1].data = data.hourly.precipitation

	// Update Title
	chart.options.plugins.title.text = `Prévision météo de ${name} sur 7 jours`
	// Launch update
	chart.update()
}

function getDate(date) {
	// const date1 = new Date(date).getTime()
	// const date2 = new Date().getTime()

	// const diff_time = date2 - date1
	// const diff_days = Math.floor(diff_time / (1000 * 3600 * 24))
	// const diff_hours = Math.floor(diff_time / (1000 * 3600))
	// const diff_minutes = Math.floor(diff_time / (1000 * 60))

	return new Date(date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', hour: 'numeric' })
}

// Creating a new instance of Chart.js
const chart = new Chart(canvas, {
	type: 'line',
	data: {
		labels: [],
		datasets: [
			{
				label: "Températures (C°)",
				data: [],
				pointHoverRadius: 10,
				backgroundColor: ["#1f1f1f80"],
				borderColor: ["#00000040"]
			},
			{
				label: "Précipitations (mm)",
				data: [],
				pointHoverRadius: 10,
				backgroundColor: ["#1d25ff80"],
				borderColor: ["#4b51ff40"]
			}
		]
	},
	options: {
		plugins: {
			title: {
				display: true,
				text: 'Prévision météo',
				font: {
					size: 18
				}
			}
		},
		interaction: {
			mode: 'index',
			intersect: false
		},
	}
})

// Define default value at setup 
inputQuery.value = 'Nantes'
handleSubmit(inputQuery)