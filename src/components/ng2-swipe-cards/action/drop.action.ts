export function hover(event, source_id, target_id) {
  return {
    type: 'HOVER',
    payload: {
      source_id,
      target_id,
      event
    }
  }
}

export function drop(event, source_id, target_id) {
  return {
    type: 'DROP',
    payload: {
      source_id,
      target_id,
      event
    }
  }
}
