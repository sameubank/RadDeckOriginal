modes =
	coffee: 'coffeescript'
	css: 'css'
	html: 'htmlmixed'
	jade: 'jade'
	js: 'javascript'
	json: 'javascript'
	less: 'less'
	project: 'xml'
	sas: 'sass'
	sql: 'sql'
	xml: 'xml'

content = getElement 'content'
editor = null

fetchFile = (rel) ->
	setValue 'lastFile', rel
	socket.emit 'code:get', {rel: rel}

socket.on 'code:got', (json) ->
	flipClass 'treeButton', 'on', 0
	flipClass 'tree', 'on', 0
	rel = json.rel
	code = json.code
	extension = rel.replace /^.*\./, ''
	mode = modes[extension] or 'text'
	location.hash = '#' + rel
	editor = CodeMirror(content,
		mode: mode
		smartIndent: true
		indentWithTabs: true
		lineNumbers: true
		autofocus: true
		value: code
	)
	editor.on 'change', (cm, change) ->
		return if change.origin is 'io'
		from = 0
		to = change.from.line - 1
		if to > -1
			for i in [0..to]
				from += editor.doc.getLine(i).length + 1
		from += change.from.ch
		text = removed = ''
		while change
			text += change.text.join '\n'
			removed += change.removed.join '\n'
			change = change.next
		change = [
			from
			removed.length
			text
		]
		socket.emit 'code:change', {rel: rel, change: change}

socket.on 'code:changed', (json) ->
	doc = editor.doc
	change = json.change
	text = change[2]
	change =
		from: change[0]
		to: change[0] + change[1]
	pos = peek = 0
	line = -1
	for own key, boundary of change
		while peek <= boundary
			pos = peek
			peek += doc.getLine(++line).length + 1
		change[key] = {line: line, ch: boundary - pos}
	change.replacement = text
	doc.replaceRange change.replacement, change.from, change.to, 'io'


rel = location.hash.substr 1
fetchFile rel if rel
