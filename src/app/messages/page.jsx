'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'
import { Search, Plus, Send, MoreVertical, Phone, CalendarClock, Paperclip, Smile, Check, CheckCheck, ChevronLeft } from 'lucide-react'
import Header from '@/app/components/global/Header'

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

export default function MessagesPage() {
  const [conversations] = useState(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState('1')
  const [newMessage, setNewMessage] = useState('')
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false)
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false)
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  /** On small screens, show thread full-width after picking a conversation */
  const [mobileShowThread, setMobileShowThread] = useState(false)

  const currentMessages = mockMessages[selectedConversation] || []
  const currentConversation = conversations.find(c => c.id === selectedConversation)

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    // Handle message sending logic here
    setNewMessage('')
  }

  const handleScheduleAppointment = (e) => {
    e.preventDefault()
    if (!appointmentDate || !appointmentTime) return
    // Handle appointment scheduling logic here
    // You could send this as a message or create an appointment
    const appointmentMessage = `I'd like to schedule an appointment for ${appointmentDate} at ${appointmentTime}`
    // Add this message to the conversation or handle appointment creation
    setAppointmentDate('')
    setAppointmentTime('')
    setShowAppointmentDialog(false)
  }

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
                      <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
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
                            <div className="flex gap-2 justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setShowAppointmentDialog(false)
                                  setAppointmentDate('')
                                  setAppointmentTime('')
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
                          <p className="text-sm">{message.text}</p>
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
