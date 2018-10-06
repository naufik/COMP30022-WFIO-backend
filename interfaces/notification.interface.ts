/** Standard Notification Interface */
export interface Notification<T> {
  to: string,
  timestamp: Date,
  redirect: "msg.view" | "sos.respond", 
  content: T,
}

export interface StandardMessage {
  from: {
    fullName: string,
    email: string,
  },
  message?: string,
}