let url

const inputCodePostal = document.getElementById('codePostal')
	, responseDiv = document.getElementById('response')
	, responseTable = responseDiv.querySelector('tbody')
	, fields = [['nom'], ['departement', 'nom'], ['region', 'nom'], ['population']]

inputCodePostal.addEventListener('input', async (e) => {

	const value = e.target.value

	if ((value.length === 5) && !isNaN(value)) {

		url = `https://geo.api.gouv.fr/communes?codePostal=${inputCodePostal.value}&fields=nom,departement,region,population`

		const response = await fetch(url)
		const data = await response.json()

		// Rendu du tableau de réponse s'il y a des résultats
		if (data.length > 0) {
			responseDiv.style.visibility = 'visible'

			// Reset
			responseTable.innerHTML = ''

			data.forEach(element => {
				const tr = document.createElement('tr')

				fields.forEach(field => {
					const td = document.createElement('td')

					if (field[1]) td.textContent = element[field[0]][field[1]]
					else td.textContent = element[field[0]]

					tr.appendChild(td)
				})
				responseTable.appendChild(tr)
			})
		} else {
			responseDiv.style.visibility = 'hidden'
		}
	} else {
		responseDiv.style.visibility = 'hidden'
	}
})