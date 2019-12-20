export const projectValid = validate => Array.isArray(validate) && validate[1].type === 'project' ? true : false
export const createdValid = validate => typeof validate[1].created.charAt(0) === 'number' ? true : false
export const nameValid = validate => typeof validate[1].name === 'string' ? true : false
export const colorValid = validate => typeof validate[1].color === 'string' && validate[1].color.charAt(0) === '#' ? true : false
export const timeValid = validate => typeof parseInt(validate[1].time) === 'number' && validate.length > 0 ? true : false 
export const timerValid = value => value.type === 'timer' ? true : false

export const justtimeValid = time => typeof parseInt(time) === 'number' ? true : false 
