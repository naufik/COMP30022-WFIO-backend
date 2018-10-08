/** Standard Notification Interface */
export interface Notification<T> {
  to: string,
  timestamp: Date,
  redirect: "msg.view" | "sos.respond", 
  content: T,
  display: {
    title: string,
    subtitle: string,
  }
}

export interface StandardMessage {
  from: {
    fullname: string,
    email: string,
  },
  message?: string,
}

export interface SOSRequest {
  from: {
    fullname: string,
    email: string,
  },
  route: Location[],
  destination: Location
}