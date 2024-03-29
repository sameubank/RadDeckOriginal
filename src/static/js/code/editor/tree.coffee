toggleTree = ->
	toggleClass 'treeButton', 'on'
	toggleClass 'tree', 'on'


class Node
	constructor: (@parent, @name = '') ->
	add: () ->
		child = new Node this
		@children = [] if not @children
		@children.push child
		return child

node = new Node
for char in tree
	if char is '/'
		node = node.add()
	else if char is '|'
		node = node.parent.add()
	else if char is '\\' 
		node = node.parent
		if node.children[0].name is ''
			node.children = []
	else
		node.name += char


treeString = (node) ->
	inside = ''
	if node.children
		type = 'folder'
		if node.children.length
			mode = 'plus'
			for child in node.children
				inside += treeString child if child.children
			for child in node.children
				inside += treeString child if not child.children
		else
			mode = 'empty'
		expander = "<img class=plus src=/img/#{mode}.png>"
	else
		expander = ''
		type = 'file'
	icon = "<img class=#{type} src=/img/#{type}.png>"
	if node.name
		return "<div class=#{type}><div class=item>#{expander}#{icon}#{node.name}</div><div class=tree>#{inside}</div></div>"
	else
		return inside
	return string

string = treeString node
setHtml 'tree', string


delegate 'tree', 'div.item', 'click', (event, element, target) ->
	icon = firstChild target
	tree = nextSibling target
	toggleClass tree, 'on'
	if hasClass icon, 'file'
		rel = getText target
		while true
			target = getParent getParent target
			if hasClass target, 'area'
				break
			rel = (getText previousSibling target) + '/' + rel
		fetchFile rel
	else if /us/.test(icon.src)
		sign = if hasClass tree, 'on' then 'minus' else 'plus'
		icon.src = "/img/#{sign}.png"