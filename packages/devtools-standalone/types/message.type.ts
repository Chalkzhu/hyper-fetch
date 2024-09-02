export enum EventTypes {
  ON_REQUEST_START = "ON_REQUEST_START",
  ON_REQUEST_REMOVE = "ON_REQUEST_REMOVE",
  ON_RESPONSE = "ON_RESPONSE",
  ON_REQUEST_PAUSE = "ON_REQUEST_PAUSE",
  ON_FETCH_QUEUE_CHANGE = "ON_FETCH_QUEUE_CHANGE",
  ON_FETCH_QUEUE_STATUS_CHANGE = "ON_FETCH_QUEUE_STATUS_CHANGE",
  ON_SUBMIT_QUEUE_CHANGE = "ON_SUBMIT_QUEUE_CHANGE",
  ON_SUBMIT_QUEUE_STATUS_CHANGE = "ON_SUBMIT_QUEUE_STATUS_CHANGE",
  ON_CACHE_CHANGE = "ON_CACHE_CHANGE",
  ON_CACHE_INVALIDATE = "ON_CACHE_INVALIDATE",
  ON_CACHE_DELETE = "ON_CACHE_DELETE",
}

export type MessageType = {
  data: {
    eventType: EventTypes;
    eventData: any;
  };
};
