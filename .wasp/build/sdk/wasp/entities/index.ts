import {
  type User,
  type GptResponse,
  type Task,
  type File,
  type DailyStats,
  type PageViewSource,
  type Logs,
  type ContactFormMessage,
} from "@prisma/client"

export {
  type User,
  type GptResponse,
  type Task,
  type File,
  type DailyStats,
  type PageViewSource,
  type Logs,
  type ContactFormMessage,
  type Auth,
  type AuthIdentity,
} from "@prisma/client"

export type Entity = 
  | User
  | GptResponse
  | Task
  | File
  | DailyStats
  | PageViewSource
  | Logs
  | ContactFormMessage
  | never

export type EntityName = 
  | "User"
  | "GptResponse"
  | "Task"
  | "File"
  | "DailyStats"
  | "PageViewSource"
  | "Logs"
  | "ContactFormMessage"
  | never
