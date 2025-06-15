import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const Contacts = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('open');
  const { getToken } = useAuth();

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
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/helpdesk/tickets`, 
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
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/helpdesk/tickets`,
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
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/helpdesk/tickets/${ticketId}`,
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
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/helpdesk/tickets/${ticketId}`,
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
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/helpdesk/tickets/${ticketId}`,
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-700 text-blue-100';
      case 'in-progress':
        return 'bg-green-700 text-green-100';
      case 'blocked':
        return 'bg-red-700 text-red-100';
      case 'resolved':
        return 'bg-gray-700 text-gray-100';
      default:
        return 'bg-gray-700 text-gray-100';
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
    <div className="p-6 bg-primary text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100">My Tickets</h1>
        <button
          className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-6 rounded-md"
          onClick={() => setShowModal(true)}
        >
          Submit Ticket
        </button>
      </div>
      
      {/* Submit Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div ref={modalRef} className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Submit New Ticket</h2>
            <form onSubmit={submitTicket}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="issue_type">
                  Issue Type
                </label>
                <select
                  id="issue_type"
                  name="issue_type"
                  value={newTicket.issue_type}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newTicket.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded py-2 px-3 h-32 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Describe your issue in detail..."
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="priority">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={newTicket.priority}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                  Contact Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={newTicket.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-md"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-md"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Filter bar */}
      <div className="mb-6 flex items-center">
        <div className="bg-gray-800 rounded-md inline-flex p-1">
          <button
            onClick={() => setActiveFilter('open')}
            className={`px-3 py-2 text-sm rounded-md ${
              activeFilter === 'open' || activeFilter === 'all'
                ? 'bg-gray-700 shadow text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setActiveFilter('closed')}
            className={`px-3 py-2 text-sm rounded-md ${
              activeFilter === 'closed'
                ? 'bg-gray-700 shadow text-white' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Closed
          </button>
        </div>
      </div>
      
      {/* Ticket Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 mb-6">
        <div className="bg-green-900 rounded-md p-4 text-center">
          <div className="text-4xl font-bold text-green-200">{stats.open}</div>
          <div className="text-sm text-green-300">Open Tickets</div>
        </div>
        <div className="bg-gray-800 rounded-md p-4 text-center">
          <div className="text-4xl font-bold text-gray-300">{String(stats.closed).padStart(2, '0')}</div>
          <div className="text-sm text-gray-400">Closed Tickets</div>
        </div>
        <div className="bg-rose-900 rounded-md p-4 text-center">
          <div className="text-4xl font-bold text-rose-200">{String(stats.overdue).padStart(2, '0')}</div>
          <div className="text-sm text-rose-300">Overdue</div>
        </div>
        <div className="bg-yellow-900 rounded-md p-4 text-center">
          <div className="text-4xl font-bold text-yellow-200">{String(stats.dueToday).padStart(2, '0')}</div>
          <div className="text-sm text-yellow-300">Due Today</div>
        </div>
        <div className="bg-blue-900 rounded-md p-4 text-center">
          <div className="text-4xl font-bold text-blue-200">{String(stats.dueIn7Days).padStart(2, '0')}</div>
          <div className="text-sm text-blue-300">Due in 7 Days</div>
        </div>
      </div>
      
      {/* Efficiency stats */}
      <div className="mb-6 flex gap-4">
        <div className="bg-gray-800 px-3 py-2 rounded-md">
          <span className="text-gray-200 font-medium">
            {Math.round((stats.closed / (stats.open + stats.closed || 1)) * 100)}% Efficiency
          </span>
        </div>
        <div className="bg-gray-800 px-3 py-2 rounded-md">
          <span className="text-gray-200 font-medium">
            {Math.round((stats.open / (stats.open + stats.closed || 1)) * 100)}% Pending
          </span>
        </div>
        <button className="bg-rose-900 hover:bg-rose-800 text-rose-200 px-3 py-2 rounded-md">
          Refresh
        </button>
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
        <div className="bg-gray-800 border border-gray-700 text-gray-300 rounded-md p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-200">No tickets found</h3>
          <p className="mt-1 text-sm text-gray-400">
            There are no tickets matching your current filter.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-full bg-gray-800">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTickets.map((ticket, index) => (
                <React.Fragment key={ticket.ticket_id || index}>
                  {/* Category Row */}
                  {(index === 0 || index % 3 === 0) && (
                    <tr className="bg-gray-850">
                      <td colSpan="6" className="px-6 py-3">
                        <div className="flex items-center">
                          <button className="text-gray-400 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <span className="font-medium text-gray-300">{index === 0 ? 'Customer Support Tickets' : 'Additional Tickets'}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  
                  {/* Ticket Row */}
                  <tr className="hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-rose-400 text-xs font-medium">{getTicketCode(ticket)}</span>
                          <span className="font-medium text-gray-200">{ticket.description.substring(0, 50)}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {ticket.comments_count || Math.floor(Math.random() * 30)} comments
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                        {getStatusDisplay(ticket.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${getDueDate(ticket).includes('late') ? 'text-rose-400' : 'text-gray-400'}`}>
                        {getDueDate(ticket)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-200 font-medium text-sm">
                          {ticket.email ? ticket.email.charAt(0).toUpperCase() : 'U'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {ticket.status !== 'resolved' ? (
                          <button
                            onClick={() => closeTicket(ticket.ticket_id)}
                            className="bg-green-700 hover:bg-green-600 text-green-100 px-3 py-1 rounded-md text-sm"
                          >
                            Close
                          </button>
                        ) : (
                          <button
                            onClick={() => updateTicketStatus(ticket.ticket_id, 'new')}
                            className="bg-blue-700 hover:bg-blue-600 text-blue-100 px-3 py-1 rounded-md text-sm"
                          >
                            Reopen
                          </button>
                        )}
                        <button
                          onClick={() => deleteTicket(ticket.ticket_id)}
                          className="bg-rose-800 hover:bg-rose-700 text-rose-100 px-3 py-1 rounded-md text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expandable detail row - hidden by default */}
                  <tr className="hidden">
                    <td colSpan="6" className="px-6 py-4 bg-gray-750">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-200 mb-2">Ticket Details</h3>
                          <p className="text-sm text-gray-400">{ticket.description}</p>
                          <div className="mt-4 flex space-x-2">
                            <select 
                              value={ticket.status}
                              onChange={(e) => updateTicketStatus(ticket.ticket_id, e.target.value)}
                              className="block text-sm bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                            >
                              <option value="new">New</option>
                              <option value="in-progress">In Progress</option>
                              <option value="blocked">Blocked</option>
                              <option value="resolved">Complete</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-200 mb-2">Customer Info</h3>
                          <p className="text-sm text-gray-400">Email: {ticket.email}</p>
                          <p className="text-sm text-gray-400">Priority: {ticket.priority}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
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