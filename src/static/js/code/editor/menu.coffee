delegate 'menu', 'div.menu', 'click', (event, element, target) ->
	buttonId = target.id
	if buttonId
		areaId = buttonId.replace 'Button', ''
		toggleClass buttonId, 'on'
		toggleClass areaId, 'on'
