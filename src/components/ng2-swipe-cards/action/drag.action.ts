export function drag(event: any, source_id: string) {
  return {
    type: 'DRAG',
    payload: {
      source_id,
      event
    }
  }
}

export function release(event: any, source_id: string) {
  return {
    type: 'RELEASE',
    payload: {
      source_id,
      event
    }
  }
}
