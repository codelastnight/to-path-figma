/**
 * deep copy but exclude children
 * @param inObject any object
 */
 export const clone = (inObject:any) => {
	let outObject: any, value: any, key: any

	if (typeof inObject == 'function') {
		return ""
	}
  
	if (typeof inObject !== "object" || inObject === null) {
	  return inObject // Return the value if inObject is not an object
	}
  
	// Create an array or object to hold the values
	outObject = Array.isArray(inObject) ? [] : {}
  
	for (key in inObject) {

	  if (key != "children" && key != "parent") {
		value = inObject[key]
  
		// Recursively (deep) copy for nested objects, including arrays
		outObject[key] = clone(value)
	  } else {
		  value = "" 
	  }

	}
  
	return outObject
}
