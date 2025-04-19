import { z } from "zod"

// Validation schema for the contact form
export const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  company: z.string().optional(),
  subject: z.string().min(2, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

// Validation schema for the meeting form
export const MeetingFormSchema = ContactFormSchema.extend({
  date: z.string().min(1, { message: "Date is required" }),
  timeSlot: z.string().min(1, { message: "Time slot is required" }),
})

// Types
export type ContactFormValues = z.infer<typeof ContactFormSchema>
export type MeetingFormValues = z.infer<typeof MeetingFormSchema>

// Function to store meeting data in localStorage
export const storeMeetingData = (data: MeetingFormValues) => {
  const existingMeetings = JSON.parse(localStorage.getItem("scheduledMeetings") || "[]")
  localStorage.setItem("scheduledMeetings", JSON.stringify([
    ...existingMeetings, 
    {
      ...data,
      submittedAt: new Date().toISOString()
    }
  ]))
}

// Function to store contact form data in localStorage
export const storeContactData = (data: ContactFormValues) => {
  const existingMessages = JSON.parse(localStorage.getItem("contactMessages") || "[]")
  localStorage.setItem("contactMessages", JSON.stringify([
    ...existingMessages, 
    {
      ...data,
      submittedAt: new Date().toISOString()
    }
  ]))
} 