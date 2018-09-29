/** Standard Notification Interface */
export interface Notification<T> {
  to: string,
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