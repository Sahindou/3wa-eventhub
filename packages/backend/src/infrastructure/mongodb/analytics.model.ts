import mongoose, { Schema, Document } from 'mongoose'

export interface IAnalyticsEvent extends Document {
  eventName: string // ex: "page_view"
  userId: string | null
  page: string // ex: "/dashboard"
  timestamp: Date
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>({
  eventName: { type: String, required: true },
  userId: { type: String, default: null },
  page: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
})

export const AnalyticsEventModel = mongoose.model<IAnalyticsEvent>(
  'AnalyticsEvent',
  AnalyticsEventSchema,
)
