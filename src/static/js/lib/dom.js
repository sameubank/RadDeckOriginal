/**
 * Get a DOM element by its ID (if the argument is an ID).
 * If you pass in a DOM element, it just returns it, so this can be used to ensure that you're using a DOM element.
 */
var getElement = function(id, fromDocument) {
    trace('dom/getElement')
    // If the argument is not a string, just assume it's already an element reference, and return it.
    return typeof id == 'string' ? (fromDocument || document).getElementById(id) : id
}

/**
 * Get DOM elements that have a specified tag name.
 */
var getElementsByTagName = function(tagName, parentElement) {
    trace('dom/getElementsByTagName')
    parentElement = getElement(parentElement || document)
    return parentElement ? parentElement.getElementsByTagName(tagName) : []
}

/**
 * Get DOM elements that have a specified tag and class.
 */
var getElementsByTagAndClass = function(tagAndClass, parentElement) {
    trace('dom/getElementsByTagAndClass')
    tagAndClass = tagAndClass.split('.')
    var tagName = (tagAndClass[0] || '*').toUpperCase()
    var className = tagAndClass[1]
    parentElement = getElement(parentElement || document)
    var elements = []
    if (parentElement.getElementsByClassName) {
        forEach(parentElement.getElementsByClassName(className), function(element) {
            if (element.tagName == tagName) {
                elements.push(element)
            }
        })
    }
    else {
        forEach(getElementsByTagName(tagName), function(element) {
            if (hasClass(element, className)) {
                elements.push(element)
            }
        })
    }
    return elements
}

/**
 * Get the parent of a DOM element.
 */
var getParent = function(element, tagName) {
    trace('dom/getParent')
    var parentElement = (getElement(element) || {}).parentNode
    // If a tag name is specified, keep walking up.
    if (tagName && parentElement) {
        if (parentElement.tagName != tagName) {
            parentElement = getParent(parentElement, tagName)
        }
    }
    return parentElement
}

/**
 * Create a DOM element, and optionally apply styles and append it to a parent element.
 */
var addElement = function(parentElement, tagName, cssText, beforeSibling) {
    trace('dom/addElement')
    var cachedElement = addElement[tagName] || (addElement[tagName] = document.createElement(tagName))
    var element = cachedElement.cloneNode(true)
    element.style.cssText = cssText
    if (parentElement) {
        insertChild(parentElement, element, beforeSibling)
    }
    return element
}

/**
 * Return the children of a parent DOM element.
 */
var getChildren = function(parentElement) {
    trace('dom/getChildren')
    return getElement(parentElement).childNodes
}

/**
 * Return a DOM element's index with respect to its parent.
 */
var getIndex = function(element) {
    trace('dom/getIndex')
    if (element = getElement(element)) {
        var index = 0
        while (element = element.previousSibling) {
            ++index
        }
        return index
    }
}

/**
 * Append a child DOM element to a parent DOM element.
 */
var insertChild = function(parentElement, childElement, beforeSibling) {
    trace('dom/insertChild')
    // Ensure that we have elements, not just IDs.
    parentElement = getElement(parentElement)
    childElement = getElement(childElement)
    if (parentElement && childElement) {
        // If the beforeSibling value is a number, get the (future) sibling at that index.
        if (typeof beforeSibling == 'number') {
            beforeSibling = getChildren(parentElement)[beforeSibling]
        }
        // Insert the element, optionally before an existing sibling.
        parentElement.insertBefore(childElement, beforeSibling || null)
    }
}

/**
 * Remove a DOM element from its parent.
 */
var removeElement = function(element) {
    trace('dom/removeElement')
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        // Remove the element from its parent, provided that its parent still exists.
        var parentElement = getParent(element)
        if (parentElement) {
            parentElement.removeChild(element)
        }
    }
}

/**
 * Get a DOM element's inner HTML if the element can be found.
 */
var getHtml = function(element) {
    trace('dom/getHtml')
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        return element.innerHTML
    }
}

/**
 * Set a DOM element's inner HTML if the element can be found.
 */
var setHtml = function(element, html) {
    trace('dom/setHtml')
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        // Set the element's innerHTML.
        element.innerHTML = html
    }
}

/**
 * Get a DOM element's inner text if the element can be found.
 */
var getText = function(element) {
    trace('dom/getText')
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        return element.innerText
    }
}

/**
 * Get a DOM element's firstChild if the element can be found.
 */
var firstChild = function(element) {
    trace('dom/firstChild')
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        return element.firstChild
    }
}

/**
 * Get a DOM element's previousSibling if the element can be found.
 */
var previousSibling = function(element) {
    trace('dom/previousSibling')
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        return element.previousSibling
    }
}

/**
 * Get a DOM element's previousSibling if the element can be found.
 */
var nextSibling = function(element) {
    trace('dom/nextSibling')
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        return element.nextSibling
    }
}

/**
 * Naive class detection.
 */
function hasClass(element, className) {
    element = getElement(element)
    return containsString(element.className, className)
}

/**
 * Turn a class on or off on a given element.
 */
function flipClass(element, className, flipOn) {
    var pattern = new RegExp('(^| )' + className, 'g')
    element = getElement(element)
    element.className = element.className.replace(pattern, '') + (flipOn ? ' ' + className : '')
}

/**
 * Turn a class on or off on a given element.
 */
function toggleClass(element, className) {
    flipClass(element, className, !hasClass(element, className))
}

/**
 * Insert a call to an external JavaScript file.
 */
var insertScript = function(src, callback) {
    trace('dom/insertScript')
    var head = getElementsByTagName('head')[0]
    var script = addElement(0, 'script')
    if (callback) {
        script.onload = callback
        script.onreadystatechange = function() {
            if (isLoaded(script)) {
                callback()
            }
        }
    }
    script.src = src
}

// Appends JavaScript with an onload callback
var insertScript = function(src, callback) {
    var headElement = document.head || document.getElementsByTagName('head')[0]
    var scriptElement = document.createElement('script')
        
    scriptElement.async = "async"
    scriptElement.src = src

    // Attach handlers for all browsers
    scriptElement.onload = scriptElement.onreadystatechange = function(_, isAbort) {

        if (!scriptElement.readyState || isLoaded(scriptElement)) {

            // Handle memory leak in IE
            scriptElement.onload = scriptElement.onreadystatechange = null

            // Remove the script
            removeElement(scriptElement)

            // Dereference the script
            delete scriptElement

            // Callback if not abort
            if (callback && !isAbort) {
                callback()
            }
        }
    }
    // Use insertBefore instead of insertChild  to circumvent an IE6 bug.
    // This arises when a base node is used (#2709 and #4378).
    insertChild(headElement, scriptElement)
}
