import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  RefreshCcw, 
  MessageSquare, 
  Clock, 
  AlertCircle,
  CheckCircle, 
  Search,
  Mail,
  Tag,
  LifeBuoy,
  AlertTriangle,
  MoveUp,
  PieChart,
  UserCircle,
  Inbox
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://auto-social-backend.vercel.app';

const Contacts = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('open');
  const { getToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    issue_type: 'Technical',
    description: '',
    priority: 'Medium',
    email: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Handle closing the modal when clicking outside
  const modalRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    
    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  // Ticket statistics
  const [stats, setStats] = useState({
    open: 0,
    closed: 0,
    overdue: 0,
    dueToday: 0,
    dueIn7Days: 0
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `${API_BASE_URL}/api/helpdesk/tickets`, 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setTickets(response.data.tickets);
        calculateStats(response.data.tickets);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching help desk tickets:", err);
        setError("Failed to load tickets. Please try again later.");
        setLoading(false);
      }
    };

    fetchTickets();
  }, [getToken]);

  // Handle input changes for the new ticket form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket({
      ...newTicket,
      [name]: value
    });
  };
  
  // Submit new ticket
  const submitTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const token = await getToken();
      const response = await axios.post(
        `${API_BASE_URL}/api/helpdesk/tickets`,
        newTicket,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Add new ticket to state
      const createdTicket = response.data.ticket;
      const updatedTickets = [createdTicket, ...tickets];
      setTickets(updatedTickets);
      calculateStats(updatedTickets);
      
      // Reset form and close modal
      setNewTicket({
        issue_type: 'Technical',
        description: '',
        priority: 'Medium',
        email: ''
      });
      setShowModal(false);
      setSubmitting(false);
    } catch (err) {
      console.error("Error creating ticket:", err);
      alert("Failed to create ticket. Please try again.");
      setSubmitting(false);
    }
  };

  const calculateStats = (ticketList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const in7Days = new Date();
    in7Days.setDate(today.getDate() + 7);
    in7Days.setHours(0, 0, 0, 0);

    const newStats = {
      open: 0,
      closed: 0,
      overdue: 0,
      dueToday: 0,
      dueIn7Days: 0
    };

    ticketList.forEach(ticket => {
      // Calculate open vs closed
      if (ticket.status === 'resolved') {
        newStats.closed++;
      } else {
        newStats.open++;
      }

      // Calculate due dates
      const createdAt = new Date(ticket.created_at);
      const dueDate = new Date(createdAt);
      
      // Set due date to 5 days after creation for high priority,
      // 7 days for medium, 14 days for low
      if (ticket.priority === 'High') {
        dueDate.setDate(createdAt.getDate() + 5);
      } else if (ticket.priority === 'Medium') {
        dueDate.setDate(createdAt.getDate() + 7);
      } else {
        dueDate.setDate(createdAt.getDate() + 14);
      }

      // Check if overdue (past due date and not resolved)
      if (dueDate < today && ticket.status !== 'resolved') {
        newStats.overdue++;
      }
      
      // Check if due today
      else if (
        dueDate.getDate() === today.getDate() &&
        dueDate.getMonth() === today.getMonth() &&
        dueDate.getFullYear() === today.getFullYear() &&
        ticket.status !== 'resolved'
      ) {
        newStats.dueToday++;
      }
      
      // Check if due in next 7 days
      else if (dueDate > today && dueDate <= in7Days && ticket.status !== 'resolved') {
        newStats.dueIn7Days++;
      }
    });

    setStats(newStats);
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const token = await getToken();
      await axios.put(
        `${API_BASE_URL}/api/helpdesk/tickets/${ticketId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state
      const updatedTickets = tickets.map(ticket => 
        ticket.ticket_id === ticketId 
          ? { ...ticket, status: newStatus } 
          : ticket
      );
      
      setTickets(updatedTickets);
      calculateStats(updatedTickets);
      
    } catch (err) {
      console.error(`Error updating ticket ${ticketId} status:`, err);
      alert("Failed to update ticket status. Please try again.");
    }
  };

  const deleteTicket = async (ticketId) => {
    if (!confirm("Are you sure you want to delete this ticket? This action cannot be undone.")) {
      return;
    }
    
    try {
      const token = await getToken();
      await axios.delete(
        `${API_BASE_URL}/api/helpdesk/tickets/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Remove from local state
      const updatedTickets = tickets.filter(ticket => ticket.ticket_id !== ticketId);
      setTickets(updatedTickets);
      calculateStats(updatedTickets);
      
    } catch (err) {
      console.error(`Error deleting ticket ${ticketId}:`, err);
      alert("Failed to delete ticket. Please try again.");
    }
  };

  // Close a ticket - mark as resolved
  const closeTicket = async (ticketId) => {
    try {
      const token = await getToken();
      await axios.put(
        `${API_BASE_URL}/api/helpdesk/tickets/${ticketId}`,
        { status: 'resolved' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state
      const updatedTickets = tickets.map(ticket => 
        ticket.ticket_id === ticketId 
          ? { ...ticket, status: 'resolved' } 
          : ticket
      );
      
      setTickets(updatedTickets);
      calculateStats(updatedTickets);
      
    } catch (err) {
      console.error(`Error closing ticket ${ticketId}:`, err);
      alert("Failed to close ticket. Please try again.");
    }
  };

  // Filter tickets based on active filter
  const filteredTickets = tickets.filter(ticket => {
    // First apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        ticket.description?.toLowerCase().includes(searchLower) || 
        ticket.email?.toLowerCase().includes(searchLower) || 
        ticket.issue_type?.toLowerCase().includes(searchLower) || 
        ticket.priority?.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }
  
    // Then apply status filter
    switch (activeFilter) {
      case 'all':
      case 'open':
        return ticket.status !== 'resolved';
      case 'closed':
        return ticket.status === 'resolved';
      case 'overdue':
        const createdAt = new Date(ticket.created_at);
        const dueDate = new Date(createdAt);
        if (ticket.priority === 'High') {
          dueDate.setDate(createdAt.getDate() + 5);
        } else if (ticket.priority === 'Medium') {
          dueDate.setDate(createdAt.getDate() + 7);
        } else {
          dueDate.setDate(createdAt.getDate() + 14);
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate < today && ticket.status !== 'resolved';
      default:
        return true;
    }
  });

  // Track expanded rows
  const [expandedRows, setExpandedRows] = useState({});
  
  const toggleRowExpand = (ticketId) => {
    setExpandedRows(prev => ({
      ...prev,
      [ticketId]: !prev[ticketId]
    }));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new':
        return 'bg-gray-600 text-gray-100';
      case 'in-progress':
        return 'bg-green-600 text-green-100';
      case 'blocked':
        return 'bg-red-600 text-red-100';
      case 'resolved':
        return 'bg-gray-600 text-gray-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'new':
        return 'New';
      case 'in-progress':
        return 'In Progress';
      case 'blocked':
        return 'Blocked';
      case 'resolved':
        return 'Complete';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getDueDate = (ticket) => {
    const createdAt = new Date(ticket.created_at);
    const dueDate = new Date(createdAt);
    
    if (ticket.priority === 'High') {
      dueDate.setDate(createdAt.getDate() + 5);
    } else if (ticket.priority === 'Medium') {
      dueDate.setDate(createdAt.getDate() + 7);
    } else {
      dueDate.setDate(createdAt.getDate() + 14);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const days = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
    
    if (days < 0 && ticket.status !== 'resolved') {
      return `${Math.abs(days)} days late`;
    } else if (days === 0) {
      return 'Due today';
    } else if (days > 0) {
      return `Due in ${days} days`;
    } else {
      return 'Completed';
    }
  };

  const getTicketCode = (ticket) => {
    const issueType = ticket.issue_type?.substring(0, 3).toUpperCase() || 'TKT';
    const ticketId = ticket.id || Math.floor(Math.random() * 100);
    return `${issueType}-${ticketId}`;
  };

  return (
    <div className="p-6  text-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 mb-1 flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-rose-600/20">
              <LifeBuoy size={20} className="text-rose-400" />
            </div>
            Customer Support
          </h1>
          <p className="text-sm text-gray-400">
            Manage your support tickets and track your customer interactions
          </p>
        </div>
        <button
          className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-6 rounded-md flex items-center gap-2 transition-colors shadow-md"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          <span>Submit Ticket</span>
        </button>
      </div>
      
      {/* Submit Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
          <div 
            ref={modalRef} 
            className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-xl transition-all animate-fadeIn"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-full bg-rose-600/20">
                <LifeBuoy size={18} className="text-rose-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Submit New Ticket</h2>
            </div>
            
            <form onSubmit={submitTicket}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-1.5" htmlFor="issue_type">
                  <Tag size={14} className="text-gray-400" />
                  Issue Type
                </label>
                <select
                  id="issue_type"
                  name="issue_type"
                  value={newTicket.issue_type}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm transition-colors"
                  required
                >
                  <option value="Technical">Technical</option>
                  <option value="Billing">Billing</option>
                  <option value="Product">Product</option>
                  <option value="General">General</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-1.5" htmlFor="description">
                  <MessageSquare size={14} className="text-gray-400" />
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newTicket.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-md py-2.5 px-3 h-32 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm transition-colors"
                  placeholder="Describe your issue in detail..."
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-1.5" htmlFor="priority">
                  <AlertTriangle size={14} className="text-gray-400" />
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={newTicket.priority}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm transition-colors"
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-1.5" htmlFor="email">
                  <Mail size={14} className="text-gray-400" />
                  Contact Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={newTicket.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-2.5 px-5 rounded-md transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-5 rounded-md transition-colors shadow-sm flex items-center gap-2 disabled:bg-gray-600 disabled:text-gray-300"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      <span>Submit Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Filter bar */}
      <div className="mb-6 grid gap-4 md:flex md:items-center md:justify-between">
        <div className="flex items-center">
          <div className="bg-gray-800 rounded-md inline-flex p-1 shadow-md">
            <button
              onClick={() => setActiveFilter('open')}
              className={`px-4 py-2 text-sm rounded-md flex items-center gap-1 transition-colors ${
                activeFilter === 'open' || activeFilter === 'all'
                  ? 'bg-gray-700 shadow text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Inbox size={16} />
              <span>Open</span>
            </button>
            <button
              onClick={() => setActiveFilter('closed')}
              className={`px-4 py-2 text-sm rounded-md flex items-center gap-1 transition-colors ${
                activeFilter === 'closed'
                  ? 'bg-gray-700 shadow text-white' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <CheckCircle size={16} />
              <span>Closed</span>
            </button>
            <button
              onClick={() => setActiveFilter('overdue')}
              className={`px-4 py-2 text-sm rounded-md flex items-center gap-1 transition-colors ${
                activeFilter === 'overdue'
                  ? 'bg-gray-700 shadow text-white' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <AlertCircle size={16} />
              <span>Overdue</span>
            </button>
          </div>
          
          <button 
            className="ml-2 bg-rose-900 hover:bg-rose-800 text-rose-200 p-2 rounded-md transition-colors shadow-md"
            onClick={async () => {
              setLoading(true);
              try {
                const token = await getToken();
                const response = await axios.get(
                  `${API_BASE_URL}/api/helpdesk/tickets`, 
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                );
                setTickets(response.data.tickets);
                calculateStats(response.data.tickets);
              } catch (err) {
                console.error("Error refreshing tickets:", err);
              } finally {
                setLoading(false);
              }
            }}
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-200 pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-colors shadow-md"
          />
        </div>
      </div>
      
      {/* Ticket Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 mb-6">
        <div className="bg-gradient-to-br from-green-900 to-green-800/80 rounded-lg p-4 text-center shadow-md">
          <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-green-800/50 flex items-center justify-center">
            <Inbox size={20} className="text-green-200" />
          </div>
          <div className="text-3xl font-bold text-green-200">{stats.open}</div>
          <div className="text-xs text-green-300 mt-1">Open Tickets</div>
        </div>
        <div className="bg-gradient-to-br from-gray-800 to-gray-700/80 rounded-lg p-4 text-center shadow-md">
          <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center">
            <CheckCircle size={20} className="text-gray-300" />
          </div>
          <div className="text-3xl font-bold text-gray-300">{String(stats.closed).padStart(2, '0')}</div>
          <div className="text-xs text-gray-400 mt-1">Closed Tickets</div>
        </div>
        <div className="bg-gradient-to-br from-rose-900 to-rose-800/80 rounded-lg p-4 text-center shadow-md">
          <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-rose-800/50 flex items-center justify-center">
            <AlertCircle size={20} className="text-rose-200" />
          </div>
          <div className="text-3xl font-bold text-rose-200">{String(stats.overdue).padStart(2, '0')}</div>
          <div className="text-xs text-rose-300 mt-1">Overdue</div>
        </div>
        <div className="bg-gradient-to-br from-amber-900 to-amber-800/80 rounded-lg p-4 text-center shadow-md">
          <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-amber-800/50 flex items-center justify-center">
            <Clock size={20} className="text-amber-200" />
          </div>
          <div className="text-3xl font-bold text-amber-200">{String(stats.dueToday).padStart(2, '0')}</div>
          <div className="text-xs text-amber-300 mt-1">Due Today</div>
        </div>
        <div className="bg-gradient-to-br from-gray-800 to-gray-700/80 rounded-lg p-4 text-center shadow-md">
          <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center">
            <AlertTriangle size={20} className="text-gray-300" />
          </div>
          <div className="text-3xl font-bold text-gray-300">{String(stats.dueIn7Days).padStart(2, '0')}</div>
          <div className="text-xs text-gray-400 mt-1">Due in 7 Days</div>
        </div>
      </div>
      
      {/* Efficiency stats */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-md shadow-md flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-emerald-900/40">
            <PieChart size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm text-gray-200 font-medium">
            {Math.round((stats.closed / (stats.open + stats.closed || 1)) * 100)}% Efficiency
          </span>
        </div>
        <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-md shadow-md flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-gray-700/40">
            <MoveUp size={16} className="text-gray-400" />
          </div>
          <span className="text-sm text-gray-200 font-medium">
            {Math.round((stats.open / (stats.open + stats.closed || 1)) * 100)}% Pending
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900 border border-red-700 text-red-100 rounded-md p-4">
          {error}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-gray-800/60 rounded-md p-10 text-center border border-gray-700">
          <div className="flex justify-center">
            <div className="bg-gray-700/40 rounded-full p-4 mb-4">
              {searchTerm ? (
                <Search className="h-10 w-10 text-gray-400" />
              ) : activeFilter === 'closed' ? (
                <CheckCircle className="h-10 w-10 text-gray-400" />
              ) : (
                <Inbox className="h-10 w-10 text-gray-400" />
              )}
            </div>
          </div>
          <h3 className="text-xl font-medium text-gray-200 mb-2">
            {searchTerm 
              ? "No matching tickets found" 
              : activeFilter === 'closed' 
                ? "No closed tickets yet" 
                : "No tickets found"}
          </h3>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            {searchTerm 
              ? "Try adjusting your search criteria or check for typos." 
              : activeFilter === 'closed' 
                ? "Your closed tickets will appear here once resolved." 
                : "Submit a new ticket to get help with any issues you're facing."}
          </p>
          {!searchTerm && (
            <button
              className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-6 rounded-md flex items-center gap-2 mx-auto"
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} />
              <span>Submit Ticket</span>
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-700/50">
          <table className="min-w-full bg-gray-800/90 backdrop-blur-sm">
            <thead className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400/90 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-gray-500" />
                    <span>Ticket</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400/90 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Tag size={14} className="text-gray-500" />
                    <span>Status</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400/90 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400/90 uppercase tracking-wider">
                  Due
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400/90 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400/90 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTickets.map((ticket, index) => (
                <React.Fragment key={ticket.ticket_id || index}>
                  {/* Category Row */}
                  {(index === 0 || index % 3 === 0) && (
                    <tr className="bg-gray-900/70">
                      <td colSpan="6" className="px-6 py-3">
                        <div className="flex items-center">
                          <button className="text-gray-400 mr-2">
                            <ChevronDown size={16} className="text-gray-500" />
                          </button>
                          <span className="font-medium text-gray-300">{index === 0 ? 'Customer Support Tickets' : 'Additional Tickets'}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  
                  {/* Ticket Row */}
                  <tr className="hover:bg-gray-750 transition-colors border-b border-gray-700 bg-gray-800/80">
                    <td className="px-6 py-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-rose-900/30 text-rose-400 text-xs font-medium px-2 py-1 rounded-md">{getTicketCode(ticket)}</span>
                          <span className="font-medium text-gray-200">{ticket.description.substring(0, 40)}{ticket.description.length > 40 ? '...' : ''}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                          <MessageSquare size={12} className="text-gray-500" />
                          <span>{ticket.comments_count || Math.floor(Math.random() * 30)} comments</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                        {getStatusDisplay(ticket.status)}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400 text-center">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span className={`text-sm flex items-center justify-center gap-1.5 ${getDueDate(ticket).includes('late') ? 'text-rose-400' : 'text-gray-400'}`}>
                        {getDueDate(ticket).includes('late') ? <AlertCircle size={14} /> : <Clock size={14} />}
                        <span>{getDueDate(ticket)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-gray-200 text-sm">
                          <span className="leading-none">{ticket.email ? ticket.email.charAt(0).toUpperCase() : 'U'}</span>
                        </div>
                        <span className="text-gray-400 text-sm hidden md:inline">{ticket.email?.split('@')[0] || 'User'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => toggleRowExpand(ticket.ticket_id)}
                          className="text-gray-400 hover:text-white transition-colors p-1"
                        >
                          {expandedRows[ticket.ticket_id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {ticket.status !== 'resolved' ? (
                          <button
                            onClick={() => closeTicket(ticket.ticket_id)}
                            className="bg-green-700 hover:bg-green-600 text-green-100 px-4 py-2 rounded-md text-sm transition-colors font-medium"
                          >
                            Close
                          </button>
                        ) : (
                          <button
                            onClick={() => updateTicketStatus(ticket.ticket_id, 'new')}
                            className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded-md text-sm transition-colors font-medium"
                          >
                            Reopen
                          </button>
                        )}
                        <button
                          onClick={() => deleteTicket(ticket.ticket_id)}
                          className="bg-rose-800 hover:bg-rose-700 text-rose-100 px-4 py-2 rounded-md text-sm transition-colors font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expandable detail row */}
                  {expandedRows[ticket.ticket_id] && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-gray-750 border-t border-b border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-200 mb-3 flex items-center gap-2">
                              <Tag size={14} className="text-gray-400" />
                              <span>Ticket Details</span>
                            </h3>
                            <div className="bg-gray-800/50 p-4 rounded-md mb-3">
                              <p className="text-sm text-gray-300 whitespace-pre-line">{ticket.description}</p>
                            </div>
                            <div className="mb-4 flex gap-2 flex-wrap">
                              <div className="bg-gray-800/60 text-xs px-3 py-1.5 rounded-md text-gray-300 flex items-center gap-1.5">
                                <Tag size={12} className="text-gray-400" />
                                <span>Type: {ticket.issue_type || 'Technical'}</span>
                              </div>
                              <div className={`text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 
                                ${ticket.priority === 'High' || ticket.priority === 'Urgent' ? 'bg-rose-900/30 text-rose-300' : 
                                  ticket.priority === 'Medium' ? 'bg-amber-900/30 text-amber-300' : 
                                  'bg-gray-700/30 text-gray-300'}`}
                              >
                                <AlertTriangle size={12} />
                                <span>Priority: {ticket.priority || 'Low'}</span>
                              </div>
                            </div>
                            
                            <h3 className="text-sm font-medium text-gray-200 mb-2">Update Status:</h3>
                            <div className="mt-2 flex space-x-2">
                              <select 
                                value={ticket.status}
                                onChange={(e) => updateTicketStatus(ticket.ticket_id, e.target.value)}
                                className="block text-sm bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-200 p-2"
                              >
                                <option value="new">New</option>
                                <option value="in-progress">In Progress</option>
                                <option value="blocked">Blocked</option>
                                <option value="resolved">Complete</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-200 mb-3 flex items-center gap-2">
                              <UserCircle size={14} className="text-gray-400" />
                              <span>Customer Information</span>
                            </h3>
                            <div className="bg-gray-800/50 p-4 rounded-md">
                              <div className="grid grid-cols-1 gap-3">
                                <div>
                                  <p className="text-xs text-gray-400 mb-1">Contact Email</p>
                                  <p className="text-sm text-gray-200 flex items-center gap-2">
                                    <Mail size={14} className="text-gray-400" />
                                    {ticket.email || 'No email provided'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400 mb-1">Submission Date</p>
                                  <p className="text-sm text-gray-200">
                                    {new Date(ticket.created_at).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400 mb-1">Last Updated</p>
                                  <p className="text-sm text-gray-200">
                                    {new Date(ticket.updated_at || ticket.created_at).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Contacts; 