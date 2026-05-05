'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'
import { Search, Plus, Send, MoreVertical, Phone, CalendarClock, Paperclip, Smile, Check, CheckCheck, ChevronLeft } from 'lucide-react'
import Header from '@/app/components/global/Header'
import { toast } from 'sonner'

// Mock conversations data
const mockConversations = [
  {
    id: '1',
    name: 'John Doe',
    avatar: '/declutter1.png',
    lastMessage: 'Yes, the item is still available',
    timestamp: '2 mins ago',
    unreadCount: 2,
    isOnline: true,
    type: 'seller'
  },
  {
    id: '2',
    name: 'Sarah Smith',
    avatar: '/declutter1.png',
    lastMessage: 'The property viewing is scheduled for tomorrow',
    timestamp: '1 hour ago',
    unreadCount: 0,
    isOnline: false,
    type: 'agent'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    avatar: '/declutter1.png',
    lastMessage: 'Thanks for your inquiry!',
    timestamp: '3 hours ago',
    unreadCount: 1,
    isOnline: true,
    type: 'provider'
  }
]

// Mock messages
const mockMessages = {
  '1': [
    {
      id: 'm1',
      text: 'Hi, is this item still available?',
      sender: 'me',
      timestamp: '10:30 AM',
      read: true
    },
    {
      id: 'm2',
      text: 'Yes, the item is still available',
      sender: 'other',
      timestamp: '10:32 AM',
      read: true
    },
    {
      id: 'm3',
      text: 'Great! What condition is it in?',
      sender: 'me',
      timestamp: '10:33 AM',
      read: true
    },
    {
      id: 'm4',
      text: 'It\'s in excellent condition, only used for 6 months',
      sender: 'other',
      timestamp: '10:35 AM',
      read: true
    },
    {
      id: 'm5',
      text: 'Can you send me more pictures?',
      sender: 'me',
      timestamp: '10:40 AM',
      read: false
    }
  ],
  '2': [
    {
      id: 'm1',
      text: 'Hello, I\'m interested in the property',
      sender: 'me',
      timestamp: '9:00 AM',
      read: true
    },
    {
      id: 'm2',
      text: 'Hi! Great to hear from you. When would you like to schedule a viewing?',
      sender: 'other',
      timestamp: '9:15 AM',
      read: true
    },
    {
      id: 'm3',
      text: 'The property viewing is scheduled for tomorrow',
      sender: 'other',
      timestamp: '11:00 AM',
      read: true
    }
  ]
}

const normalizeTimeInput = (timeValue) => {
  if (!timeValue) return ''
  if (/^\d{2}:\d{2}$/.test(timeValue)) return timeValue

  const timeMatch = timeValue.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!timeMatch) return ''

  let hours = Number(timeMatch[1])
  const minutes = timeMatch[2]
  const period = timeMatch[3].toUpperCase()

  if (period === 'PM' && hours < 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0

  return `${String(hours).padStart(2, '0')}:${minutes}`
}

const formatScheduleDate = (dateValue) => {
  if (!dateValue) return dateValue
  const normalizedDate = new Date(`${dateValue}T00:00:00`)
  if (Number.isNaN(normalizedDate.getTime())) return dateValue
  return normalizedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatScheduleTime = (timeValue) => {
  const normalizedTime = normalizeTimeInput(timeValue)
  if (!normalizedTime) return timeValue
  const [hoursText, minutes] = normalizedTime.split(':')
  const hours = Number(hoursText)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${hour12}:${minutes} ${period}`
}

const getCurrentTimeLabel = () => {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState('1')
  const [messagesByConversation, setMessagesByConversation] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false)
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false)
  const [appointmentTitle, setAppointmentTitle] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [appointmentDuration, setAppointmentDuration] = useState('')
  const [appointmentLocation, setAppointmentLocation] = useState('')
  const [appointmentNote, setAppointmentNote] = useState('')
  const [scheduleContext, setScheduleContext] = useState(null)
  const [handledRescheduleKey, setHandledRescheduleKey] = useState('')
  /** On small screens, show thread full-width after picking a conversation */
  const [mobileShowThread, setMobileShowThread] = useState(false)

  const currentMessages = messagesByConversation[selectedConversation] || []
  const currentConversation = conversations.find(c => c.id === selectedConversation)

  const appendMessageToConversation = (conversationId, messagePayload) => {
    setMessagesByConversation((previousMessages) => ({
      ...previousMessages,
      [conversationId]: [...(previousMessages[conversationId] || []), messagePayload],
    }))
  }

  const updateConversationPreview = (conversationId, previewText) => {
    setConversations((previousConversations) =>
      previousConversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              lastMessage: previewText,
              timestamp: 'Now',
            }
          : conversation
      )
    )
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    const trimmedMessage = newMessage.trim()
    if (!trimmedMessage || !selectedConversation) return

    appendMessageToConversation(selectedConversation, {
      id: `msg-${Date.now()}`,
      text: trimmedMessage,
      sender: 'me',
      timestamp: getCurrentTimeLabel(),
      read: false,
      type: 'text',
    })
    updateConversationPreview(selectedConversation, trimmedMessage)
    setNewMessage('')
  }

  const handleScheduleAppointment = (e) => {
    e.preventDefault()
    if (!appointmentTitle.trim() || !appointmentDate || !appointmentTime || !appointmentDuration.trim() || !appointmentLocation.trim() || !selectedConversation) return

    const scheduleProposal = {
      id: `schedule-${Date.now()}`,
      type: 'schedule_proposal',
      sender: 'me',
      timestamp: getCurrentTimeLabel(),
      read: false,
      text: 'Proposed a new schedule',
      schedule: {
        title: appointmentTitle.trim(),
        date: appointmentDate,
        time: appointmentTime,
        duration: appointmentDuration.trim(),
        location: appointmentLocation.trim(),
        note: appointmentNote.trim() || null,
        status: 'pending',
        bookingId: scheduleContext?.bookingId || null,
        serviceName: scheduleContext?.serviceName || null,
      },
    }

    appendMessageToConversation(selectedConversation, scheduleProposal)
    updateConversationPreview(selectedConversation, 'Sent a reschedule request')

    setAppointmentTitle('')
    setAppointmentDate('')
    setAppointmentTime('')
    setAppointmentDuration('')
    setAppointmentLocation('')
    setAppointmentNote('')
    setScheduleContext(null)
    setShowAppointmentDialog(false)
    toast.success('Reschedule request sent in chat')
  }

  const handleScheduleDecision = (message, decision) => {
    if (!selectedConversation || !message?.schedule || message.schedule.status !== 'pending') return

    setMessagesByConversation((previousMessages) => ({
      ...previousMessages,
      [selectedConversation]: (previousMessages[selectedConversation] || []).map((entry) =>
        entry.id === message.id
          ? {
              ...entry,
              schedule: {
                ...entry.schedule,
                status: decision,
              },
            }
          : entry
      ),
    }))

    const dateLabel = formatScheduleDate(message.schedule.date)
    const timeLabel = formatScheduleTime(message.schedule.time)
    const decisionText =
      decision === 'accepted'
        ? `Accepted proposed schedule for ${dateLabel} at ${timeLabel}`
        : `Rejected proposed schedule for ${dateLabel} at ${timeLabel}`

    appendMessageToConversation(selectedConversation, {
      id: `msg-${Date.now()}-${decision}`,
      text: decisionText,
      sender: 'me',
      timestamp: getCurrentTimeLabel(),
      read: false,
      type: 'text',
    })
    updateConversationPreview(selectedConversation, decisionText)
    toast.success(decision === 'accepted' ? 'Schedule accepted' : 'Schedule rejected')
  }

  useEffect(() => {
    const shouldReschedule = searchParams.get('reschedule') === '1'
    const participant = (searchParams.get('participant') || '').trim()
    const bookingId = searchParams.get('bookingId') || ''
    const serviceName = searchParams.get('serviceName') || ''
    const date = searchParams.get('date') || ''
    const time = searchParams.get('time') || ''
    const duration = searchParams.get('duration') || ''
    const location = searchParams.get('location') || ''
    const rescheduleKey = [participant, bookingId, date, time].join('|')

    if (!shouldReschedule || !participant || !rescheduleKey || handledRescheduleKey === rescheduleKey) {
      return
    }

    const existingConversation = conversations.find(
      (conversation) => conversation.name.toLowerCase() === participant.toLowerCase()
    )

    const targetConversationId = existingConversation?.id || `conv-${Date.now()}`

    if (!existingConversation) {
      setConversations((previousConversations) => [
        {
          id: targetConversationId,
          name: participant,
          avatar: '/declutter1.png',
          lastMessage: 'New conversation',
          timestamp: 'Now',
          unreadCount: 0,
          isOnline: false,
          type: 'provider',
        },
        ...previousConversations,
      ])
      setMessagesByConversation((previousMessages) => ({
        ...previousMessages,
        [targetConversationId]: previousMessages[targetConversationId] || [],
      }))
    }

    setSelectedConversation(targetConversationId)
    setMobileShowThread(true)
    setScheduleContext({
      bookingId,
      serviceName,
    })
    setAppointmentTitle(serviceName)
    setAppointmentDate(date)
    setAppointmentTime(normalizeTimeInput(time))
    setAppointmentDuration(duration)
    setAppointmentLocation(location)
    setAppointmentNote(bookingId ? `Request to reschedule booking ${bookingId}` : '')
    setShowAppointmentDialog(true)
    setHandledRescheduleKey(rescheduleKey)
    toast.info('Pick a new date and time, then send the reschedule request')
  }, [searchParams, conversations, handledRescheduleKey])

  return (
    <div className="bg-white flex h-dvh min-h-0 w-full flex-col overflow-hidden">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-3 md:px-6 md:pb-5 md:pt-4">
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
          <div className="mb-3 shrink-0 md:mb-4">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Messages</h1>
              <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    New Message
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Start New Conversation</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Search Users</label>
                      <Input placeholder="Search by name or username..." />
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {/* Mock user list */}
                      {['John Doe', 'Sarah Smith', 'Mike Johnson'].map((name, idx) => (
                        <button
                          key={idx}
                          className="w-full p-3 text-left hover:bg-gray-50 rounded-lg flex items-center gap-3"
                          onClick={() => {
                            setShowNewMessageDialog(false)
                            // Handle starting conversation
                          }}
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                          <span className="font-medium">{name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-black10 bg-white md:flex-row">
            {/* Conversations List */}
            <div
              className={`flex min-h-0 w-full min-w-0 flex-col border-black10 md:w-80 md:max-w-[20rem] md:border-r ${
                mobileShowThread ? 'hidden md:flex' : 'flex'
              }`}
            >
              <div className="p-4 border-b border-black10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10 border border-black66"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation.id)
                      setMobileShowThread(true)
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-black66 ${
                      selectedConversation === conversation.id ? 'bg-primary/5 border-l-4 border-l-black66' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                          <Image
                            src={conversation.avatar}
                            alt={conversation.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {conversation.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-sm truncate">{conversation.name}</h3>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {conversation.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div
              className={`min-h-0 flex-1 flex-col ${mobileShowThread ? 'flex' : 'hidden md:flex'}`}
            >
              {currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="flex shrink-0 items-center justify-between border-b border-black10 p-3 md:p-4">
                    <div className="flex min-w-0 items-center gap-2 md:gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 md:hidden"
                        onClick={() => setMobileShowThread(false)}
                        aria-label="Back to conversations"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                          <Image
                            src={currentConversation.avatar}
                            alt={currentConversation.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {currentConversation.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{currentConversation.name}</h3>
                        <p className="text-xs text-gray-500">
                          {currentConversation.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Dialog
                        open={showAppointmentDialog}
                        onOpenChange={(open) => {
                          setShowAppointmentDialog(open)
                          if (open && !scheduleContext) {
                            setAppointmentTitle('')
                            setAppointmentDate('')
                            setAppointmentTime('')
                            setAppointmentDuration('')
                            setAppointmentLocation('')
                            setAppointmentNote('')
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <CalendarClock className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Schedule Appointment</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleScheduleAppointment} className="space-y-4">
                            {scheduleContext?.bookingId && (
                              <div className="rounded-lg border border-black10 bg-gray-50 p-3 text-sm">
                                <p className="font-medium text-gray-900">Rescheduling booking {scheduleContext.bookingId}</p>
                                {scheduleContext.serviceName ? (
                                  <p className="text-gray-600">{scheduleContext.serviceName}</p>
                                ) : null}
                              </div>
                            )}
                            <div>
                              <label className="text-sm font-medium mb-2 block">What are you scheduling?</label>
                              <Input
                                type="text"
                                value={appointmentTitle}
                                onChange={(e) => setAppointmentTitle(e.target.value)}
                                placeholder="e.g. Plumbing service visit"
                                className="w-full"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Select Date</label>
                              <Input
                                type="date"
                                value={appointmentDate}
                                onChange={(e) => setAppointmentDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Select Time</label>
                              <Input
                                type="time"
                                value={appointmentTime}
                                onChange={(e) => setAppointmentTime(e.target.value)}
                                className="w-full"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Duration</label>
                              <Input
                                type="text"
                                value={appointmentDuration}
                                onChange={(e) => setAppointmentDuration(e.target.value)}
                                placeholder="e.g. 2 hours"
                                className="w-full"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Location or meeting link</label>
                              <Input
                                type="text"
                                value={appointmentLocation}
                                onChange={(e) => setAppointmentLocation(e.target.value)}
                                placeholder="Address or online meeting link"
                                className="w-full"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Additional note (optional)</label>
                              <textarea
                                value={appointmentNote}
                                onChange={(e) => setAppointmentNote(e.target.value)}
                                placeholder="Add any context for the proposed schedule"
                                className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setShowAppointmentDialog(false)
                                  setAppointmentTitle('')
                                  setAppointmentDate('')
                                  setAppointmentTime('')
                                  setAppointmentDuration('')
                                  setAppointmentLocation('')
                                  setAppointmentNote('')
                                }}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" className="bg-primary hover:bg-primary/90">
                                Schedule
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-gray-50 p-3 md:p-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${message.sender === 'me' ? 'bg-primary text-white' : 'bg-white'} rounded-lg p-3 shadow-sm`}>
                          {message.type === 'schedule_proposal' ? (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Reschedule proposal</p>
                              <p className="text-sm">
                                {message.schedule?.title ? `${message.schedule.title}: ` : ''}
                                {formatScheduleDate(message.schedule?.date)} at {formatScheduleTime(message.schedule?.time)}
                              </p>
                              {message.schedule?.duration ? (
                                <p className="text-xs opacity-80">Duration: {message.schedule.duration}</p>
                              ) : null}
                              {message.schedule?.location ? (
                                <p className="text-xs opacity-80">Location: {message.schedule.location}</p>
                              ) : null}
                              {message.schedule?.note ? (
                                <p className="text-xs opacity-80">Note: {message.schedule.note}</p>
                              ) : null}
                              <p
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                  message.schedule?.status === 'accepted'
                                    ? 'bg-green-100 text-green-800'
                                    : message.schedule?.status === 'rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {message.schedule?.status === 'accepted'
                                  ? 'Accepted'
                                  : message.schedule?.status === 'rejected'
                                    ? 'Rejected'
                                    : 'Pending response'}
                              </p>

                              {message.schedule?.status === 'pending' && message.sender !== 'me' ? (
                                <div className="flex gap-2 pt-1">
                                  <Button
                                    type="button"
                                    size="sm"
                                    className="h-8 bg-green-600 px-3 text-xs hover:bg-green-700"
                                    onClick={() => handleScheduleDecision(message, 'accepted')}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-3 text-xs"
                                    onClick={() => handleScheduleDecision(message, 'rejected')}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <p className="text-sm">{message.text}</p>
                          )}
                          <div className={`flex items-center gap-1 mt-1 text-xs ${
                            message.sender === 'me' ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            <span>{message.timestamp}</span>
                            {message.sender === 'me' && (
                              message.read ? (
                                <CheckCheck className="w-3 h-3" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="shrink-0 border-t border-black10 bg-white p-3 md:p-4">
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="ghost" size="sm">
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border border-black66"
                      />
                      <Button type="button" variant="ghost" size="sm">
                        <Smile className="w-5 h-5" />
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
