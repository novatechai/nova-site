"use client"

import * as React from "react"
import { motion } from "motion/react"
import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

type ContactMessage = {
  name: string
  email: string
  company?: string
  subject: string
  message: string
  submittedAt: string
}

type MeetingRequest = ContactMessage & {
  date: string
  timeSlot: string
}

export default function AdminContactPage() {
  const [meetings, setMeetings] = React.useState<MeetingRequest[]>([])
  const [messages, setMessages] = React.useState<ContactMessage[]>([])
  const [activeTab, setActiveTab] = React.useState<"meetings" | "messages">("meetings")

  // Load data from localStorage on client side
  React.useEffect(() => {
    try {
      const storedMeetings = localStorage.getItem("scheduledMeetings")
      const storedMessages = localStorage.getItem("contactMessages")
      
      if (storedMeetings) {
        setMeetings(JSON.parse(storedMeetings))
      }
      
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages))
      }
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP p")
    } catch (error) {
      return dateString
    }
  }

  const clearData = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      if (activeTab === "meetings") {
        localStorage.removeItem("scheduledMeetings")
        setMeetings([])
      } else {
        localStorage.removeItem("contactMessages")
        setMessages([])
      }
    }
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Contact Management</h1>
          <Button variant="destructive" onClick={clearData}>
            Clear {activeTab === "meetings" ? "Meetings" : "Messages"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact Requests</CardTitle>
            <CardDescription>
              View and manage all contact requests and scheduled meetings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="meetings" className="w-full" onValueChange={(value) => setActiveTab(value as "meetings" | "messages")}>
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                <TabsTrigger value="meetings">Scheduled Meetings</TabsTrigger>
                <TabsTrigger value="messages">Contact Messages</TabsTrigger>
              </TabsList>
              
              <TabsContent value="meetings">
                {meetings.length > 0 ? (
                  <Table>
                    <TableCaption>A list of scheduled meetings.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Submitted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {meetings.map((meeting, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{meeting.name}</TableCell>
                          <TableCell>{meeting.email}</TableCell>
                          <TableCell>{meeting.subject}</TableCell>
                          <TableCell>{meeting.date}</TableCell>
                          <TableCell>{meeting.timeSlot}</TableCell>
                          <TableCell>{formatDate(meeting.submittedAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No scheduled meetings found.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="messages">
                {messages.length > 0 ? (
                  <Table>
                    <TableCaption>A list of contact messages.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Submitted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messages.map((message, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{message.name}</TableCell>
                          <TableCell>{message.email}</TableCell>
                          <TableCell>{message.subject}</TableCell>
                          <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                          <TableCell>{formatDate(message.submittedAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No contact messages found.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end border-t p-6">
            <p className="text-xs text-muted-foreground">
              Note: This is a temporary admin interface for demo purposes.
              In production, this would connect to a backend database.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
} 