'use client'
import { useState, useEffect } from 'react'
import { Search, Bell, BellOff, Edit2, Trash2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Header from '@/app/components/global/Header'
import Footer from '@/app/components/global/Footer'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'

const SavedSearchesPage = () => {
  const [searches, setSearches] = useState([])
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingSearch, setEditingSearch] = useState(null)
  const [searchName, setSearchName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [alertsEnabled, setAlertsEnabled] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [pendingDeleteSearchId, setPendingDeleteSearchId] = useState(null)

  useEffect(() => {
    // Load from localStorage or API
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fhf-saved-searches')
      if (saved) {
        try {
          setSearches(JSON.parse(saved))
        } catch (e) {
          console.error('Error loading saved searches:', e)
        }
      }
    }
  }, [])

  const saveSearches = (newSearches) => {
    setSearches(newSearches)
    if (typeof window !== 'undefined') {
      localStorage.setItem('fhf-saved-searches', JSON.stringify(newSearches))
    }
  }

  const toggleAlerts = (id) => {
    const updated = searches.map(s => 
      s.id === id ? { ...s, alertsEnabled: !s.alertsEnabled } : s
    )
    saveSearches(updated)
    toast.success(updated.find(s => s.id === id).alertsEnabled ? 'Alerts enabled' : 'Alerts disabled')
  }

  const handleEdit = (search) => {
    setEditingSearch(search)
    setSearchName(search.name)
    setSearchQuery(search.query)
    setAlertsEnabled(search.alertsEnabled)
    setEditDialogOpen(true)
  }

  const saveEdit = () => {
    if (!searchName.trim() || !searchQuery.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    const updated = searches.map(s => 
      s.id === editingSearch.id 
        ? { ...s, name: searchName, query: searchQuery, alertsEnabled }
        : s
    )
    saveSearches(updated)
    toast.success('Search updated')
    setEditDialogOpen(false)
    setEditingSearch(null)
  }

  const requestDelete = (id) => {
    setPendingDeleteSearchId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    const updated = searches.filter(s => s.id !== pendingDeleteSearchId)
    saveSearches(updated)
    setIsDeleteDialogOpen(false)
    setPendingDeleteSearchId(null)
    toast.success('Search deleted')
  }

  if (searches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Saved Searches</h2>
            <p className="text-gray-600 mb-6">Save your searches to get notified when new matches appear</p>
            <Button onClick={() => window.history.back()}>Start Searching</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Searches</h1>
          <p className="text-gray-600">Manage your saved searches and alerts</p>
        </div>

        <div className="space-y-4">
          {searches.map((search) => (
            <div key={search.id} className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">{search.name}</h3>
                    {search.alertsEnabled && (
                      <Badge className="bg-green-100 text-green-800">
                        <Bell className="h-3 w-3 mr-1" />
                        Alerts On
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{search.query}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Saved {new Date(search.savedAt).toLocaleDateString()}
                    </div>
                    {search.lastMatch && (
                      <span>Last match: {new Date(search.lastMatch).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg">
                    <span className="text-sm">Alerts</span>
                    <Switch
                      checked={search.alertsEnabled}
                      onCheckedChange={() => toggleAlerts(search.id)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(search)}
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => requestDelete(search.id)}
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Saved Search</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Search Name</Label>
                <Input
                  id="editName"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="e.g., Affordable apartments near gate"
                />
              </div>
              <div>
                <Label htmlFor="editQuery">Search Query</Label>
                <Input
                  id="editQuery"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search terms..."
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="alerts">Email Alerts</Label>
                  <p className="text-xs text-gray-500">Get notified when new matches are found</p>
                </div>
                <Switch
                  id="alerts"
                  checked={alertsEnabled}
                  onCheckedChange={setAlertsEnabled}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveEdit} className="bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmActionDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title='Delete saved search?'
          description='You will stop receiving alerts for this saved search.'
          confirmText='Delete search'
          onConfirm={handleConfirmDelete}
        />
      </main>
      <Footer />
    </div>
  )
}

export default SavedSearchesPage

